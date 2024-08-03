import { isValidObjectId } from 'mongoose';
import createError from 'http-errors';

const { NotFound } = createError;

export const isValidId = (req, res, next) => {
  const { contactId } = req.params;
  if (!isValidObjectId(contactId)) {
    return next(new NotFound('Not found'));
  }
  next();
};
