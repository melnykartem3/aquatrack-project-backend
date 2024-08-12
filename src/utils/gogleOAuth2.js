import { OAuth2Client } from "google-auth-library";
import { readFile } from "node:fs/promises";
import path from "node:path";
import env from './env.js';
import createHttpError from "http-errors";

const googleAuthSettingPath = path.resolve("google-auth.json");
const googleAuthSetting = JSON.parse(await readFile(googleAuthSettingPath));
const clientId = env("GOOGLE_AUTH_CLIENT_ID");
const clientSecret = env("GOOGLE_AUTH_CLIENT_SECRET");

const googleAuthClient = new OAuth2Client({
    clientId,
    clientSecret,
    redirectUri: googleAuthSetting.web.redirect_uris[0]
});
export const validateGoogleAuthCode = async (code) => {
    const response = await googleAuthClient.getToken(code);
    if (!response.tokens.id_token) {
        throw createHttpError(401, "Google OAuth ocde invalid");
    }
    const ticket = await googleAuthClient.verifyIdToken({
        idToken: response.tokens.id_token
    });
    return ticket;
};

export const getGoogleOAuthName = ({ given_name, family_name }) => {
    if (!given_name) return "User";

    const name = family_name ? `${given_name} ${family_name}` : given_name;

    return name;
};


export const generateAuthUlr = () => {
    return googleAuthClient.generateAuthUrl({
        scope: [
            "https://www.googleapis.com/auth/userinfo.email",
            "https://www.googleapis.com/auth/userinfo.profile",
        ]
    });
};

