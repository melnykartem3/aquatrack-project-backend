import createHttpError from 'http-errors';
import env from '../utils/env';
import { readFile } from 'fs/promises';
import path from 'node:path';
import { OAuth2Client } from 'google-auth-library';
const PATH_JSON = path.join(process.cwd(), 'google-oauth.json');

const oauthConfig = JSON.parse(await readFile(PATH_JSON));

const googleOAuthClient = new OAuth2Client({
  clientId: env("GOOGLE_AUTH_CLIENT_ID"),
  clientSecret: env("GOOGLE_AUTH_CLIENT_SECRET"),
  redirectUri: oauthConfig.web.redirect_uris[0],
});

export const generateAuthUrl = () =>
  googleOAuthClient.generateAuthUrl({
    scope: [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ],
  });

export const validateCode = async (code) => {
  const response = await googleOAuthClient.getToken(code);
  if (!response.tokens.id_token) throw createHttpError(401, 'Unauthorized');

  const ticket = await googleOAuthClient.verifyIdToken({
    idToken: response.tokens.id_token,
  });
  return ticket;
};

export const getNameFromGoogleTokenPayload = (payload) =>
  payload.given_name ? payload.given_name : 'User';
