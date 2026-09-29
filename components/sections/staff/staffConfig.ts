export interface StaffSectionConfig {
  mode: 'interactive' | 'scroll';
  hoverIntentDelayMs: number; // ms to wait before switching on hover
  transitionDuration: number;  // seconds for slide/mask transitions
  idleFloatAmplitude: number;  // pixels of subtle idle floating
  idleFloatPeriod: number;     // seconds for one sine wave float cycle
  parallax: {
    enabled: boolean;
    layerBackground: { x: number; y: number }; // max px displacement for background big typography
    layerPortrait: { x: number; y: number };   // max px displacement for portrait cutout/frame
    layerForeground: { x: number; y: number }; // max px displacement for badges & metadata
    springConfig: {
      stiffness: number;
      damping: number;
      mass: number;
    };
  };
}

export const defaultStaffConfig: StaffSectionConfig = {
  mode: 'interactive',
  hoverIntentDelayMs: 65,
  transitionDuration: 0.5,
  idleFloatAmplitude: 6,
  idleFloatPeriod: 4,
  parallax: {
    enabled: true,
    layerBackground: { x: 12, y: 8 },
    layerPortrait: { x: 26, y: 18 },
    layerForeground: { x: 38, y: 26 },
    springConfig: {
      stiffness: 150,
      damping: 22,
      mass: 0.6,
    },
  },
};
