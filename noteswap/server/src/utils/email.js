export async function sendPasswordResetEmail({ to, resetLink }) {
  // Dev mailer: log to console. Replace with SMTP in production.
  console.log(`[DEV MAILER] Send password reset to ${to}: ${resetLink}`);
}