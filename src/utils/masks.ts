// Brazilian document and field masks and validations

// CPF Mask: 000.000.000-00
export const maskCPF = (value: string): string => {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  return digits
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
};

export const unmaskCPF = (value: string): string => {
  return value.replace(/\D/g, '');
};

export const validateCPF = (cpf: string): boolean => {
  const digits = cpf.replace(/\D/g, '');
  if (digits.length !== 11) return false;
  if (/^(\d)\1+$/.test(digits)) return false;
  
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(digits[i]) * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(digits[9])) return false;
  
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(digits[i]) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(digits[10])) return false;
  
  return true;
};

// CNPJ Mask: 00.000.000/0000-00
export const maskCNPJ = (value: string): string => {
  const digits = value.replace(/\D/g, '').slice(0, 14);
  return digits
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d{1,2})$/, '$1-$2');
};

export const unmaskCNPJ = (value: string): string => {
  return value.replace(/\D/g, '');
};

export const validateCNPJ = (cnpj: string): boolean => {
  const digits = cnpj.replace(/\D/g, '');
  if (digits.length !== 14) return false;
  if (/^(\d)\1+$/.test(digits)) return false;
  
  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += parseInt(digits[i]) * weights1[i];
  }
  let remainder = sum % 11;
  const digit1 = remainder < 2 ? 0 : 11 - remainder;
  if (digit1 !== parseInt(digits[12])) return false;
  
  sum = 0;
  for (let i = 0; i < 13; i++) {
    sum += parseInt(digits[i]) * weights2[i];
  }
  remainder = sum % 11;
  const digit2 = remainder < 2 ? 0 : 11 - remainder;
  if (digit2 !== parseInt(digits[13])) return false;
  
  return true;
};

// Phone Mask: (00) 00000-0000 or (00) 0000-0000
export const maskPhone = (value: string): string => {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 10) {
    return digits
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d)/, '$1-$2');
  }
  return digits
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2');
};

export const unmaskPhone = (value: string): string => {
  return value.replace(/\D/g, '');
};

export const validatePhone = (phone: string): boolean => {
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 10 && digits.length <= 11;
};

// CEP Mask: 00000-000
export const maskCEP = (value: string): string => {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  return digits.replace(/(\d{5})(\d)/, '$1-$2');
};

export const unmaskCEP = (value: string): string => {
  return value.replace(/\D/g, '');
};

export const validateCEP = (cep: string): boolean => {
  const digits = cep.replace(/\D/g, '');
  return digits.length === 8;
};

// Date Mask: DD/MM/YYYY
export const maskDate = (value: string): string => {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  return digits
    .replace(/(\d{2})(\d)/, '$1/$2')
    .replace(/(\d{2})(\d)/, '$1/$2');
};

export const unmaskDate = (value: string): string => {
  // Convert DD/MM/YYYY to YYYY-MM-DD for backend
  const parts = value.split('/');
  if (parts.length === 3 && parts[0].length === 2 && parts[1].length === 2 && parts[2].length === 4) {
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }
  return value;
};

export const validateDate = (date: string): boolean => {
  const parts = date.split('/');
  if (parts.length !== 3) return false;
  
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const year = parseInt(parts[2], 10);
  
  if (isNaN(day) || isNaN(month) || isNaN(year)) return false;
  if (month < 1 || month > 12) return false;
  if (day < 1 || day > 31) return false;
  if (year < 1900 || year > 2100) return false;
  
  // Check days in month
  const daysInMonth = new Date(year, month, 0).getDate();
  if (day > daysInMonth) return false;
  
  return true;
};

// Currency Mask: R$ 0,00
export const maskCurrency = (value: string): string => {
  const digits = value.replace(/\D/g, '');
  if (!digits) return '';
  
  const number = parseInt(digits, 10) / 100;
  return number.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
};

export const unmaskCurrency = (value: string): number => {
  const digits = value.replace(/\D/g, '');
  if (!digits) return 0;
  return parseInt(digits, 10) / 100;
};

export const validateCurrency = (value: string): boolean => {
  const number = unmaskCurrency(value);
  return !isNaN(number) && number >= 0;
};

// Percentage Mask: 0,00%
export const maskPercentage = (value: string): string => {
  const digits = value.replace(/\D/g, '').slice(0, 5);
  if (!digits) return '';
  
  const number = parseInt(digits, 10) / 100;
  if (number > 100) return '100,00%';
  
  return number.toFixed(2).replace('.', ',') + '%';
};

export const unmaskPercentage = (value: string): number => {
  const digits = value.replace(/\D/g, '');
  if (!digits) return 0;
  return Math.min(parseInt(digits, 10) / 100, 100);
};

export const validatePercentage = (value: string): boolean => {
  const number = unmaskPercentage(value);
  return !isNaN(number) && number >= 0 && number <= 100;
};

// Email validation
export const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// Generic mask handler
export type MaskType = 'cpf' | 'cnpj' | 'phone' | 'cep' | 'date' | 'currency' | 'percentage';

export const applyMask = (value: string, type: MaskType): string => {
  switch (type) {
    case 'cpf': return maskCPF(value);
    case 'cnpj': return maskCNPJ(value);
    case 'phone': return maskPhone(value);
    case 'cep': return maskCEP(value);
    case 'date': return maskDate(value);
    case 'currency': return maskCurrency(value);
    case 'percentage': return maskPercentage(value);
    default: return value;
  }
};

export const removeMask = (value: string, type: MaskType): string | number => {
  switch (type) {
    case 'cpf': return unmaskCPF(value);
    case 'cnpj': return unmaskCNPJ(value);
    case 'phone': return unmaskPhone(value);
    case 'cep': return unmaskCEP(value);
    case 'date': return unmaskDate(value);
    case 'currency': return unmaskCurrency(value);
    case 'percentage': return unmaskPercentage(value);
    default: return value;
  }
};

export const validate = (value: string, type: MaskType): boolean => {
  switch (type) {
    case 'cpf': return validateCPF(value);
    case 'cnpj': return validateCNPJ(value);
    case 'phone': return validatePhone(value);
    case 'cep': return validateCEP(value);
    case 'date': return validateDate(value);
    case 'currency': return validateCurrency(value);
    case 'percentage': return validatePercentage(value);
    default: return true;
  }
};

export const getErrorMessage = (type: MaskType): string => {
  switch (type) {
    case 'cpf': return 'CPF invalido';
    case 'cnpj': return 'CNPJ invalido';
    case 'phone': return 'Telefone invalido';
    case 'cep': return 'CEP invalido';
    case 'date': return 'Data invalida';
    case 'currency': return 'Valor invalido';
    case 'percentage': return 'Percentual invalido';
    default: return 'Valor invalido';
  }
};
