import { isValidObjectId } from 'mongoose';
import createError from 'http-errors';

const { NotFound } = createError;

export const isValidId = (req, res, next) => {
  const { userId } = req.params;
  if (!isValidObjectId(userId)) {
    return next(new NotFound('Not found'));
  }
  next();
};
