import createHttpError from 'http-errors';
import { 
  createWater, 
  deleteWaterIdService, 
  updateWaterIdService, 
  getPerDay, 
  getPerMonth 
} from "../services/water.js";

export const createNewWaterController = async (req, res, next) => {
  try {
    const { _id: userId } = req.user;
    const data = await createWater({ ...req.body, userId });

    res.status(201).json({
      status: 201,
      message: "The drunk part of the water has been successfully added!",
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteWaterController = async (req, res, next) => {
  const userId = req.user._id; 
  const  waterId  = req.params.waterId;
  const waterRecord = await deleteWaterIdService(waterId, userId);
  if (!waterRecord) {
        throw createHttpError(404, 'Record not found');
  }
  res.status(204).send(); 
};

 export const updateWaterController = async (req, res, next) => { 
  try { 
    const userId = req.user._id; 
    const  waterId  = req.params.waterId; 
    const data = await updateWaterIdService(userId, waterId, req.body); 
    if (!data) {
        next(createHttpError(404, 'Record not found'));
        return;
  }
    res.status(201).json({ 
      status: 201, 
      message: "The drunk part of the water has been successfully edit!", 
      data, 
    }); 
  } catch (error) { 
    next(error); 
  } 
};

export const getWaterPerDayController = async (req, res, next) => {
  try {
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
  try {
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

    res.status(200).json({
      status: 200,
      message: 'Success find water per month',
      data,
    });
  } catch (error) {
    next(error);
  }
};

