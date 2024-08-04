import createHttpError from 'http-errors';

import { getPerDay, getPerMonth } from '../services/water.js';

export const getWaterPerDayController = async (req, res) => {
  const { _id } = req.user;
  const { day } = req.body;

  if (!_id) {
    throw createHttpError(400, 'User ID is required');
  }
  if (!day) {
    throw createHttpError(400, 'Date is required');
  }

  const data = await getPerDay(_id, day);

  if (!data || data.length === 0) {
    throw createHttpError(404, 'Data not found');
  }

  const totalWaterVolume = data
    .reduce((sum, entry) => sum + entry.waterVolume, 0)
    .toFixed(2);

  res.json({
    status: 200,
    message: 'Success find water per day',
    data,
    totalWaterVolume,
  });
};

export const getWaterPerMonthController = async (req, res) => {
  const { _id } = req.user;
  const { month } = req.body;

  if (!_id) {
    throw createHttpError(400, 'User ID is required');
  }
  if (!month) {
    throw createHttpError(400, 'Month is required');
  }

  const data = await getPerMonth(_id, month);

  if (!data || data.length === 0) {
    throw createHttpError(404, 'Data not found');
  }

  res.json({
    status: 200,
    message: 'Success find water per month',
    data,
  });
};
