import createHttpError from 'http-errors';

import { createSession, deleteSession, findSession } from '../services/session.js';
import { env } from 'node:process';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { saveFileToPublicDir } from '../utils/saveFileToPublicDir.js';
import { userService } from '../services/auth.js';

export const signUpController = async (req, res) => {};

export const signInController = async (req, res) => {};

export const getUserInfController = async (req, res) => {
  const { contactId } = req.params;
  const userId = req.user._id;
  const contact = await userService.getContactById({ _id: contactId, userId });
  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }
  res.status(200).json({
    status: 200,
    message: `Contact with id=${contactId} found success`,
    data: contact
  });
};

const enable_cloudinary = env("ENABLE_CLOUDINARY");

export const updateUserController = async (req, res) => {
    const { contactId } = req.params;
    const userId = req.user._id;
    let photo = "";
  
    if (req.file) {
      if (enable_cloudinary === "true") {
        photo = await saveFileToCloudinary(req.file, "photos");
      } else {
        photo = await saveFileToPublicDir(req.file, "photos");
      }
    };
  
    const updatedContact = await userService.updateUser({ _id: contactId, userId }, { ...req.body, photo });
    if (!updatedContact) {
      throw createHttpError(404, 'Contact not found');
    }
    res.status(200).json({
      status: 200,
      message: 'Successfully patched a contact!',
      data: updatedContact,
    });
  };

const setupResponseSession = (res, { refreshToken, refreshTokenValidUntil, _id}) => {

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      expires: refreshTokenValidUntil,
  });
  
  res.cookie("sessionId", _id, {
      httpOnly: true,
      expires: refreshTokenValidUntil,
  });
  };

export const refreshController = async (req, res) => {
    const { refreshToken, sessionId } = req.cookies;
  
    const currentSession = await findSession({_id: sessionId, refreshToken});
  
    if (!currentSession) {
      throw createHttpError(401, "Session not found");
    }
    const refreshTokenExpired = new Date() > new Date(currentSession.refreshTokenValidUntil);
    if (refreshTokenExpired) {
      throw createHttpError(401, "Session expired");
    }
    const newSession = await createSession(currentSession.userId);
  
    setupResponseSession(res, newSession);
    res.json({
      status: 200,
      message: "User signed in successfully",
      data: {
          accessToken: newSession.accessToken,
      }
  });
  };

export const logoutController = async (req, res) => {
    const { sessionId } = req.cookies;
    if (!sessionId) {
      throw createHttpError(401, "Session not found");
    };
  
    await deleteSession({ _id: sessionId });
  
    res.clearCookie("sessionId");
    res.clearCookie("refreshToken");
  
    res.status(204).send();
  };