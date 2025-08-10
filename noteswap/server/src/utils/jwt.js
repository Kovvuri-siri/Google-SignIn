import jwt from 'jsonwebtoken';

export function createJwt(userId) {
  const payload = { sub: userId };
  const token = jwt.sign(payload, process.env.JWT_SECRET || 'dev_secret', { expiresIn: '7d' });
  return token;
}

export function createResetToken(userId) {
  const payload = { sub: userId, type: 'reset' };
  const token = jwt.sign(payload, process.env.RESET_TOKEN_SECRET || 'dev_secret', { expiresIn: '1h' });
  return token;
}