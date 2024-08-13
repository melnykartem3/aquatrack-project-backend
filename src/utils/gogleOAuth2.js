import { OAuth2Client } from "google-auth-library";
import { readFile } from "node:fs/promises";
import path from "node:path";
import axios from "axios";
import env from './env.js';
import jwt from 'jsonwebtoken'; // Імплементуйте jwt тут
import createHttpError from "http-errors";

const googleAuthSettingPath = path.resolve("google-auth.json");
const googleAuthSetting = JSON.parse(await readFile(googleAuthSettingPath));
const clientId = env("GOOGLE_AUTH_CLIENT_ID");
const clientSecret = env("GOOGLE_AUTH_CLIENT_SECRET");

const client = new OAuth2Client(clientId);

export async function validateGoogleAuthCode(idToken) {
  const ticket = await client.verifyIdToken({
    idToken: idToken,
    audience: clientId,
  });
  return ticket.getPayload();
};

export const getGoogleOAuthName = ({ given_name, family_name }) => {
  if (!given_name) return "User";
  const name = family_name ? `${given_name} ${family_name}` : given_name;
  return name;
};

export const generateAuthUrl = () => {
  return client.generateAuthUrl({
    scope: [
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
    ]
  });
};

export const authGoogleController = async (req, res) => {
  const { idToken } = req.body;
  const JWT_SECRET = env("JWT_SECRET"); // Переконайтесь, що змінна середовища правильна

  if (!idToken) {
    return res.status(400).json({ message: 'Token is required' });
  }

  try {
    // Перевірка idToken
    const payload = await validateGoogleAuthCode(idToken);
    const { email, given_name, family_name } = payload;
    const name = getGoogleOAuthName({ given_name, family_name });

    // Генерація JWT
    const accessToken = jwt.sign(
      { email, name },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ data: { accessToken, user: { email, name } } });
  } catch (error) {
    console.error('Google Auth Error:', error);
    res.status(401).json({ message: 'Invalid grant', data: error.message });
  }
};
