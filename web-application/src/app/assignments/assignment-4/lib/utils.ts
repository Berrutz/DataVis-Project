export function fahrenheitToCelsius(value: number): number {
  return ((value - 32) * 5) / 9;
}

// Helper function to calculate angle in degrees
export function getAngleDeg(value: number): number {
  const angle = value - Math.PI / 2;
  return (angle * 180) / Math.PI;
}

// Lookup objects for 'dx' adjustments based on angle
export const dxAdjustments: Record<string, string> = {
  '0': '1.1em',
  '180': '-1.1em',
  '-30': '0.6em',
  '30': '0.6em',
  '150': '-0.6em',
  '210': '-0.6em'
};

// Array to map month numbers to month names
export const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

// Array to map month numbers to month names
export const shortMonthNames = [
  'JAN',
  'FEB',
  'MAR',
  'APR',
  'MAY',
  'JUN',
  'JUL',
  'AUG',
  'SEP',
  'OCT',
  'NOV',
  'DEC'
];
