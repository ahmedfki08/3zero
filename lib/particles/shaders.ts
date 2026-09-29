export const vertexShader = /* glsl */ `
  attribute vec3 a_posLogo;
  attribute vec3 a_posText;
  attribute vec4 a_colorLogo;
  attribute vec4 a_colorText;
  attribute float a_delay;
  attribute vec4 a_seed;        // x: rnd1, y: rnd2, z: sizeFactor, w: speedVar
  attribute vec4 a_targetMeta;  // x: isDesc (0/1), y: wordNorm, z: wordEndNorm, w: rnd

  uniform float u_progress;
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform float u_pointSize;
  uniform float u_swirlStrength;
  uniform float u_delaySpread;
  uniform float u_shimmerAmplitude;
  uniform float u_aspect;
  uniform float u_descMode;     // 0 = particle-glyphs, 1 = crisp-reveal

  varying vec4 v_color;
  varying float v_glow;
  varying float v_alpha;

  // Classic Simplex / Perlin-like 3D noise for curl turbulence
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);

    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);

    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;

    i = mod289(i);
    vec4 p = permute(permute(permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));

    float n_ = 0.142857142857;
    vec3  ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);

    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);

    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;

    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);

    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  vec3 computeCurl(vec3 p) {
    float eps = 0.08;
    float n1 = snoise(p + vec3(0.0, eps, 0.0));
    float n2 = snoise(p - vec3(0.0, eps, 0.0));
    float n3 = snoise(p + vec3(0.0, 0.0, eps));
    float n4 = snoise(p - vec3(0.0, 0.0, eps));
    float n5 = snoise(p + vec3(eps, 0.0, 0.0));
    float n6 = snoise(p - vec3(eps, 0.0, 0.0));

    float a = (n1 - n2) / (2.0 * eps);
    float b = (n3 - n4) / (2.0 * eps);
    float c = (n5 - n6) / (2.0 * eps);

    return vec3(a - b, b - c, c - a);
  }

  void main() {
    float isDesc = a_targetMeta.x;
    float wordNorm = a_targetMeta.y;
    
    // Staggered local progress
    float effectiveDelay = a_delay * u_delaySpread;
    float effectiveWindow = max(0.01, 1.0 - u_delaySpread);
    float pLocal = clamp((u_progress - effectiveDelay) / effectiveWindow, 0.0, 1.0);

    float smoothP = smoothstep(0.0, 1.0, pLocal);
    vec3 basePos = mix(a_posLogo, a_posText, smoothP);

    // Dynamic curl noise turbulence
    float swirlFactor = sin(smoothP * 3.14159265);
    vec3 noiseCoord = basePos * 1.5 + vec3(u_time * 0.15, u_time * 0.1, a_seed.x);
    vec3 curl = computeCurl(noiseCoord);

    // Shimmer and overshoot
    float shimmer = sin(u_time * a_seed.w * 2.5 + a_seed.x * 6.28) * u_shimmerAmplitude;
    float settleOvershoot = sin(smoothP * 3.14159265 * 2.0) * (1.0 - smoothP) * 0.02;

    vec3 finalPos = basePos 
      + curl * (swirlFactor * u_swirlStrength) 
      + vec3(shimmer, shimmer * 0.5, 0.0)
      + vec3(0.0, settleOvershoot, 0.0);

    gl_Position = vec4(finalPos.x, finalPos.y, finalPos.z, 1.0);

    // Point size calculation
    float dynamicSize = u_pointSize * a_seed.z * (1.0 + swirlFactor * 0.5);
    gl_PointSize = dynamicSize;

    // Color interpolation
    vec4 baseColor = mix(a_colorLogo, a_colorText, smoothP);
    float twinkle = 0.88 + 0.12 * sin(u_time * 3.2 + a_seed.y * 6.28);
    
    v_color = vec4(baseColor.rgb * twinkle, baseColor.a);
    v_glow = a_seed.z;

    // In 'crisp-reveal' mode, description particles fade out upon word convergence (0.50 -> 0.80)
    float particleAlpha = 1.0;
    if (u_descMode > 0.5 && isDesc > 0.5) {
      // Word arrival progress in scroll space: [0.48 + wordNorm * 0.28]
      float wordArrivalScroll = 0.48 + wordNorm * 0.28;
      if (u_progress > wordArrivalScroll) {
        float fadeOut = clamp((u_progress - wordArrivalScroll) / 0.06, 0.0, 1.0);
        particleAlpha = 1.0 - fadeOut; // Fade out to let crisp text take over
      }
    }

    v_alpha = particleAlpha;
  }
`;

export const fragmentShader = /* glsl */ `
  precision highp float;

  varying vec4 v_color;
  varying float v_glow;
  varying float v_alpha;

  void main() {
    if (v_alpha <= 0.005) {
      discard;
    }

    vec2 coord = gl_PointCoord - vec2(0.5);
    float dist = length(coord);

    if (dist > 0.5) {
      discard;
    }

    float intensity = 1.0 - smoothstep(0.0, 0.5, dist);
    intensity = pow(intensity, 1.8);

    float core = 1.0 - smoothstep(0.0, 0.18, dist);
    vec3 finalRgb = v_color.rgb + vec3(core * 0.35);

    gl_FragColor = vec4(finalRgb, intensity * v_color.a * v_alpha);
  }
`;
