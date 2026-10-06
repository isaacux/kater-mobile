export const colors = {
  black: '#141414',
  yellow: '#FFC400',
  yellowSoft: '#FFF3C4',
  offWhite: '#F6F4EE',
  white: '#FFFFFF',
  text: '#141414',
  textMuted: '#5C5A55',
  textSubtle: '#8A877F',
  border: '#E4E1D8',
  borderStrong: '#CFCBC0',
  disabledBg: '#ECEAE3',
  disabledText: '#A7A398',
  danger: '#B42318',
  dangerSoft: '#FDECEA',
  success: '#1E7B45',
  successSoft: '#E5F4EA',
  info: '#1F4E8C',
  infoSoft: '#E7EEF8',
  overlay: 'rgba(20, 20, 20, 0.5)',
} as const;

export const fonts = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semibold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
  extrabold: 'Inter_800ExtraBold',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  pill: 999,
} as const;

/** Minimum comfortable tap target */
export const TAP_TARGET = 48;

export const shadow = {
  card: {
    shadowColor: '#141414',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
} as const;
