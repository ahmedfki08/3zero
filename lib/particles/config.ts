export type DescriptionMode = 'crisp-reveal' | 'particle-glyphs';

export interface ParticleConfig {
  // Mode switch: 'crisp-reveal' (DOM text materialization) vs 'particle-glyphs' (pure particle letters)
  descriptionMode: DescriptionMode;

  // Particle counts
  particleCountDesktop: number;
  particleCountMobile: number;
  maxDPR: number;

  // Particle appearance
  pointSize: number;
  glowStrength: number;
  shimmerSpeed: number;
  shimmerAmplitude: number;

  // Transition dynamics
  swirlStrength: number;
  curlNoiseFrequency: number;
  delaySpread: number;
  overshootStrength: number;

  // Scroll Choreography (0.0 to 1.0)
  scrollRanges: {
    logoHoldEnd: number;        // 0.00 -> 0.09: Logo hold & crossfade
    headlineFormStart: number;  // 0.09: Logo disintegrates -> headline starts forming
    headlineFormEnd: number;    // 0.48: Headline is fully assembled
    descRevealStart: number;    // 0.50: Description particles peel off and stream to words
    descRevealEnd: number;      // 0.80: Words are fully materialized into crisp text
    lockHoldEnd: number;        // 1.00: Hold both before transition to Part 2
  };

  // Word Reveal Timing & Polish
  wordReveal: {
    staggerProgress: number;    // E.g. 0.015 per word
    blurStartPx: number;        // Initial blur before arrival
    arrivalGlowDuration: number;
  };

  // Color Palette
  brandGreen: [number, number, number];    // RGB [0..1]
  brandMint: [number, number, number];     // RGB [0..1]
  brandCharcoal: [number, number, number]; // RGB [0..1]
}

export const DEFAULT_PARTICLE_CONFIG: ParticleConfig = {
  descriptionMode: 'crisp-reveal', // Toggle between 'crisp-reveal' and 'particle-glyphs'

  particleCountDesktop: 26000,
  particleCountMobile: 9000,
  maxDPR: 2.0,

  pointSize: 3.2,
  glowStrength: 1.0,
  shimmerSpeed: 2.2,
  shimmerAmplitude: 0.003,

  swirlStrength: 0.42,
  curlNoiseFrequency: 1.8,
  delaySpread: 0.25,
  overshootStrength: 0.05,

  scrollRanges: {
    logoHoldEnd: 0.09,
    headlineFormStart: 0.09,
    headlineFormEnd: 0.48,
    descRevealStart: 0.50,
    descRevealEnd: 0.80,
    lockHoldEnd: 1.00,
  },

  wordReveal: {
    staggerProgress: 0.014,
    blurStartPx: 6,
    arrivalGlowDuration: 0.05,
  },

  brandGreen: [0.247, 0.658, 0.356],    // #3FA85B
  brandMint: [0.290, 0.870, 0.502],     // #4ADE80
  brandCharcoal: [0.058, 0.094, 0.062], // #0F1810
};
