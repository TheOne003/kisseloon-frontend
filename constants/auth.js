export const DEMO_PHONE = '9876543210';
export const DEMO_EMAIL = 'aarav@example.com';
export const DEMO_OTP = '123456';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normalizeEmail(value = '') {
  return String(value).trim().toLowerCase();
}

export function isValidEmail(value = '') {
  return EMAIL_PATTERN.test(normalizeEmail(value));
}

export function isDemoOtp(otp) {
  return String(otp).replace(/\D/g, '') === DEMO_OTP;
}

export function maskPhone(phone = '') {
  const digits = String(phone).replace(/\D/g, '');
  if (digits.length < 4) return '+91 ••••••••••';
  return `+91 ${digits.slice(0, 2)}••••••${digits.slice(-2)}`;
}

export function maskEmail(value = '') {
  const email = normalizeEmail(value);
  const at = email.indexOf('@');
  if (at < 1) return email || '••••@••••';
  const local = email.slice(0, at);
  const domain = email.slice(at + 1);
  const visible = local.slice(0, local.length <= 2 ? 1 : 2);
  return `${visible}${'•'.repeat(Math.max(local.length - visible.length, 1))}@${domain}`;
}
