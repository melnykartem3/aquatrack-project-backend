import Water  from '../db/models/Water.js';

export const deleteWaterIdService = async (id) => {
    const waterData = await Water.findByIdAndDelete(id);
    return waterData;
  };


  export const updateWaterIdService = async (id, waterData) => {
           const updatedRecord = await Water.findByIdAndUpdate(
      id,
      { ...waterData, localDate: ""},
      { new: true },
    );
    return updatedRecord;
  };
