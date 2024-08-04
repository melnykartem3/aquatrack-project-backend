import WaterCollection from '../db/models/Water.js';

export const getPerDay = async (userId, date) => {
  return WaterCollection.aggregate([
    {
      $match: {
        userId,
        date,
      },
    },
    {
      $addFields: {
        waterVolume: { $toDouble: '$waterVolume' },
      },
    },
    {
      $project: {
        _id: 0,
        date: 1,
        waterVolume: 1,
      },
    },
  ]);
};

export const getPerMonth = async (userId, month) => {
  return WaterCollection.aggregate([
    {
      $match: {
        userId,
        date: {
          $regex: `^${month}`,
        },
      },
    },
    {
      $addFields: {
        waterVolume: { $toDouble: '$waterVolume' },
      },
    },
    {
      $project: {
        _id: 0,
        date: 1,
        waterVolume: 1,
      },
    },
  ]);
};
