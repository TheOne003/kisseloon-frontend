export const DEMO_PHONE = '9876543210';
export const DEMO_OTP = '123456';

export function isDemoOtp(otp) {
  return String(otp).replace(/\D/g, '') === DEMO_OTP;
}
