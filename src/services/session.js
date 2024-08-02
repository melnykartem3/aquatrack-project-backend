import { randomBytes } from "node:crypto";
import { SessioCollection } from "../db/models/Session.js";
import { ACCESS_TOKEN_LIFETIME, REFRESH_TOKEN_LIFETIME } from "../constants/index.js";

export const findSession = filter => SessioCollection.findOne(filter);

export const createSession = async(userId) => {

    await SessioCollection.deleteOne({ userId });

    const accessToken = randomBytes(30).toString("base64");
    const refreshToken = randomBytes(30).toString("base64");

    const accessTokenValidUntil = new Date(Date.now() + ACCESS_TOKEN_LIFETIME);
    const refreshTokenValidUntil =   new Date(Date.now() + REFRESH_TOKEN_LIFETIME);

    return SessioCollection.create({
        userId,
        accessToken,
        refreshToken,
        accessTokenValidUntil,
        refreshTokenValidUntil,
    });
};

export const deleteSession = filter => SessioCollection.deleteOne(filter);
