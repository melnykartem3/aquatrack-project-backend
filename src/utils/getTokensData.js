import { randomBytes } from 'crypto';

export const getTokensData = () => {
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() ),
    refreshTokenValidUntil: new Date(Date.now() ),
  };
};
