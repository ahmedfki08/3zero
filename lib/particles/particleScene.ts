import { Renderer, Geometry, Program, Mesh, OGLRenderingContext } from 'ogl';
import { ParticleConfig, DEFAULT_PARTICLE_CONFIG } from './config';
import { sampleImage, sampleCombinedTargets } from './sampleShape';
import { WordTargetRect } from './measureTextTargets';
import { vertexShader, fragmentShader } from './shaders';

export class ParticleScene {
  private canvas: HTMLCanvasElement;
  private renderer!: Renderer;
  private gl!: OGLRenderingContext;
  private program!: Program;
  private geometry!: Geometry;
  private mesh!: Mesh;

  private config: ParticleConfig;
  private isDestroyed = false;
  private isPaused = false;
  private animationFrameId = 0;

  private progress = 0;
  private targetProgress = 0;
  private time = 0;

  private logoImg: HTMLImageElement | null = null;
  private headlineLines: string[] = ['3 ZERO', 'ISIMS CAMPUS CLUB'];
  private wordTargets: WordTargetRect[] = [];
  private onReadyCallback?: () => void;

  constructor(
    canvas: HTMLCanvasElement,
    logoSrc: string,
    headlineLines: string[],
    wordTargets: WordTargetRect[] = [],
    config: Partial<ParticleConfig> = {},
    onReady?: () => void
  ) {
    this.canvas = canvas;
    this.headlineLines = headlineLines;
    this.wordTargets = wordTargets;
    this.config = { ...DEFAULT_PARTICLE_CONFIG, ...config };
    this.onReadyCallback = onReady;

    this.init(logoSrc);
  }

  private async init(logoSrc: string) {
    const dpr = Math.min(window.devicePixelRatio || 1, this.config.maxDPR);
    this.renderer = new Renderer({
      canvas: this.canvas,
      dpr,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });

    this.gl = this.renderer.gl;
    const gl = this.gl;

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

    this.logoImg = await this.loadImage(logoSrc);
    if (this.isDestroyed) return;

    await this.rebuildBuffers();
    if (this.isDestroyed) return;

    this.handleResize();
    this.startLoop();

    if (this.onReadyCallback) {
      this.onReadyCallback();
    }
  }

  private loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  }

  public async updateWordTargets(wordTargets: WordTargetRect[]) {
    this.wordTargets = wordTargets;
    await this.rebuildBuffers();
  }

  public setConfig(newConfig: Partial<ParticleConfig>) {
    this.config = { ...this.config, ...newConfig };
    if (this.program) {
      this.program.uniforms.u_descMode.value =
        this.config.descriptionMode === 'crisp-reveal' ? 1.0 : 0.0;
    }
  }

  public async rebuildBuffers() {
    if (!this.logoImg || this.isDestroyed) return;

    const width = window.innerWidth;
    const height = window.innerHeight;
    const isMobile = width < 768;
    const particleCount = isMobile
      ? this.config.particleCountMobile
      : this.config.particleCountDesktop;

    const logoData = sampleImage(this.logoImg, particleCount, width, height);

    const targetData = await sampleCombinedTargets(
      this.headlineLines,
      this.wordTargets,
      particleCount,
      width,
      height,
      this.config.brandGreen
    );

    if (this.isDestroyed) return;

    if (this.geometry) {
      this.geometry.remove();
    }

    this.geometry = new Geometry(this.gl, {
      a_posLogo: { size: 3, data: logoData.positions },
      a_posText: { size: 3, data: targetData.positions },
      a_colorLogo: { size: 4, data: logoData.colors },
      a_colorText: { size: 4, data: targetData.colors },
      a_delay: { size: 1, data: logoData.delays },
      a_seed: { size: 4, data: logoData.seeds },
      a_targetMeta: { size: 4, data: targetData.targetMeta },
    });

    if (!this.program) {
      this.program = new Program(this.gl, {
        vertex: vertexShader,
        fragment: fragmentShader,
        transparent: true,
        depthTest: false,
        depthWrite: false,
        uniforms: {
          u_progress: { value: this.progress },
          u_time: { value: 0 },
          u_resolution: { value: [width, height] },
          u_pointSize: { value: (isMobile ? 2.4 : this.config.pointSize) * this.renderer.dpr },
          u_swirlStrength: { value: this.config.swirlStrength },
          u_delaySpread: { value: this.config.delaySpread },
          u_shimmerAmplitude: { value: this.config.shimmerAmplitude },
          u_aspect: { value: width / height },
          u_descMode: { value: this.config.descriptionMode === 'crisp-reveal' ? 1.0 : 0.0 },
        },
      });
    }

    this.mesh = new Mesh(this.gl, {
      geometry: this.geometry,
      program: this.program,
      mode: this.gl.POINTS,
    });
  }

  public setProgress(target: number) {
    this.targetProgress = Math.max(0, Math.min(1, target));
  }

  public setPaused(paused: boolean) {
    this.isPaused = paused;
    if (!paused && !this.animationFrameId) {
      this.startLoop();
    }
  }

  public handleResize = () => {
    if (this.isDestroyed || !this.renderer) return;

    const width = window.innerWidth;
    const height = window.innerHeight;
    this.renderer.setSize(width, height);

    if (this.program) {
      this.program.uniforms.u_resolution.value = [width, height];
      this.program.uniforms.u_aspect.value = width / height;
      const isMobile = width < 768;
      this.program.uniforms.u_pointSize.value =
        (isMobile ? 2.4 : this.config.pointSize) * this.renderer.dpr;
    }
  };

  private startLoop() {
    const render = () => {
      if (this.isDestroyed || this.isPaused) {
        this.animationFrameId = 0;
        return;
      }

      this.time += 0.016;
      this.progress += (this.targetProgress - this.progress) * 0.15;

      if (this.program && this.mesh) {
        this.program.uniforms.u_time.value = this.time;
        this.program.uniforms.u_progress.value = this.progress;

        this.renderer.render({ scene: this.mesh });
      }

      this.animationFrameId = requestAnimationFrame(render);
    };

    this.animationFrameId = requestAnimationFrame(render);
  }

  public destroy() {
    this.isDestroyed = true;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }

    if (this.geometry) {
      this.geometry.remove();
    }
    if (this.program) {
      this.program.remove();
    }
  }
}
