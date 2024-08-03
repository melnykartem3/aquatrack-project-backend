import { WaterCollection } from "../db/models/Water.js";

export const getWaterById = (waterId)=> WaterCollection.findById(waterId);

export const createWater = (data) => WaterCollection.create(data);

export const deleteWater = (filter) => WaterCollection.findOneAndDelete(filter);
