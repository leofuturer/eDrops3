export const EMAIL_HOSTNAME =
  process.env.APP_FRONTEND_HOSTNAME ?? 'localhost';
export const EMAIL_PORT = process.env.APP_FRONTEND_PORT ?? 8086;
export const EMAIL_SENDER = process.env.APP_EMAIL_USERNAME ?? 'info@edroplets.org'