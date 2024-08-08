import createHttpError from 'http-errors';
import {
  createWater,
  deleteWaterIdService,
  updateWaterIdService,
  getPerDay,
  getPerMonth,
} from '../services/water.js';

export const createNewWaterController = async (req, res, next) => {
  try {
    const { _id: userId } = req.user;
    const data = await createWater({ ...req.body, userId });

    res.status(201).json({
      status: 201,
      message: 'The drunk part of the water has been successfully added!',
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteWaterController = async (req, res, next) => {
  try {
    const waterRecord = await deleteWaterIdService(req.water.id);

    res.status(200).json({
      msg: 'DELETED!',
      waterRecord: {
        _id: waterRecord.id,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateWaterController = async (req, res, next) => {
  try {
    const waterRecord = await updateWaterIdService(req.water.id, {
      ...req.body,
      localDate: '',
    });

    res.status(200).json({
      msg: 'UPDATED!',
      waterRecord: {
        _id: waterRecord.id,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getWaterPerDayController = async (req, res, next) => {
  try {
    const { _id } = req.user;
    if (!_id) {
      throw createHttpError(400, 'User ID is required');
    }
    const { day } = req.query;
    if (!day) {
      throw createHttpError(400, 'Day is required');
    }

    const data = await getPerDay(_id, day);
    if (!data || data.length === 0) {
      throw createHttpError(404, 'No data found for the given day');
    }

    const totalWaterVolume = data.reduce(
      (sum, entry) => sum + entry.waterVolume,
      0,
    );

    res.status(200).json({
      status: 200,
      message: 'Success find water per day',
      data,
      totalWaterVolume,
    });
  } catch (error) {
    next(error);
  }
};

export const getWaterPerMonthController = async (req, res, next) => {
  const { _id } = req.user;
  if (!_id) {
    throw createHttpError(400, 'User ID is required');
  }

  const { month } = req.query;
  if (!month) {
    throw createHttpError(400, 'Month is required');
  }

  try {
    const data = await getPerMonth(_id, month);

    if (data.length === 0) {
      res.status(404).json({
        status: 404,
        message: 'No data found for the given month',
        data: [],
      });
    }

    res.json({
      status: 200,
      message: 'Success find water per month',
      data: data.map((item) => ({
        day: item.day,
        totalWaterVolume: item.totalWaterVolume,
      })),
    });
  } catch (error) {
    next(error);
  }
};
