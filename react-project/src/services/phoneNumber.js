import { parsePhoneNumberFromString } from 'libphonenumber-js';

export const padronizarTelefone = (telefone) => {
  const phoneNumber = parsePhoneNumberFromString(telefone, 'BR'); // BR para Brasil
  if (!phoneNumber || !phoneNumber.isValid()) {
    throw new Error('Número de telefone inválido');
  }
  return phoneNumber.format('E.164'); // Formato padrão internacional
};