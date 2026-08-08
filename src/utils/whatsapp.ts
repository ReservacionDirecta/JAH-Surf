const DEFAULT_NUMBER = '51952641118';

export const toWhatsAppNumber = (value?: unknown): string => {
  if (typeof value !== 'string') return DEFAULT_NUMBER;
  const digits = value.replace(/\D/g, '');
  return digits.length >= 9 ? digits : DEFAULT_NUMBER;
};
