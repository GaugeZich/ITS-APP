export const theme = {
  // Paleta por modo. theme.context elige light o dark según el modo actual.
  colors: {
    light: {
      primary: '#1E88C7',
      secondary: '#4CAF6D',
      background: '#F8FAFC',
      surface: '#FFFFFF',
      text: '#1A1A1A',
      muted: '#64748B',
      border: '#CBD5E1',
      danger: '#DC2626',
    },
    dark: {
      primary: '#1E88C7',
      secondary: '#4CAF6D',
      background: '#0F172A',
      surface: '#1E293B',
      text: '#F1F5F9',
      muted: '#94A3B8',
      border: '#334155',
      danger: '#EF4444',
    },
    onAccent: '#FFFFFF',
  },

  // Escala de espacios: margin, padding y gap.
  spacing: { xxxs: 2, xxs: 4, xs: 6, sm: 10, md: 16, lg: 24, xl: 40 },

  // Redondeo de bordes.
  radius: { xs: 4, sm: 8, md: 12, lg: 18, pill: 20 },

  // Tamaños de letra.
  fontSize: {
    xxs: 11,
    xs: 12,
    sm: 13,
    md: 14,
    base: 15,
    lg: 16,
    xl: 18,
    title: 22,
    heading: 24,
    display: 28,
    hero: 32,
  },

  fontWeight: {
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  } as const,

  // Grosor de bordes de tarjetas.
  borderWidth: { thin: 1 },

  // Opacidades para estados: deshabilitado, presionado, texto suave.
  opacity: {
    disabled: 0.5,
    faded: 0.6,
    soft: 0.7,
    pressed: 0.85,
  },

  // Medidas fijas puntuales.
  sizes: {
    logo: 130,
    progressBar: 8,
  },
};