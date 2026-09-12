export function getOrientationLabel(orientation) {
  if (orientation === 'phone') return 'Mobile'
  if (orientation === 'tablet') return 'Tablet'
  if (orientation === 'both') return 'Mobile + Desktop'
  return 'Desktop'
}

export function getAspectRatioLabel(orientation) {
  if (orientation === 'phone') return '9:16'
  if (orientation === 'tablet') return '4:3'
  if (orientation === 'both') return '16:9'
  return '16:9'
}

export function getOrientationAspectClass(orientation) {
  if (orientation === 'phone') return 'aspect-[9/16]'
  if (orientation === 'tablet') return 'aspect-square'
  return 'aspect-[16/9]'
}

export function getOrientationWidth(orientation) {
  if (orientation === 'phone') return 520
  if (orientation === 'tablet') return 640
  return 760
}
