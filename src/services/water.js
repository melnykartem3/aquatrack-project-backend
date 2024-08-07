import  WaterCollection  from "../db/models/Water.js";

// export const getWaterById = (waterId)=> WaterCollection.findById(waterId);

export const createWater = (data) => WaterCollection.create(data);

// export const deleteWater = (filter) => WaterCollection.findOneAndDelete(filter);

export const deleteWaterIdService = async (waterId, userId) => {
    const waterData = await WaterCollection.findByIdAndDelete({_id: waterId, userId });
    return waterData;
  };


  export const updateWaterIdService = async (userId, waterId, payload, options = {}) => { 
          const waterData = await WaterCollection.findOneAndUpdate( 
    { userId, _id: waterId }, 
    payload, 
    { new: true, ...options }, 
  ); 
  return waterData; 
  };

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

