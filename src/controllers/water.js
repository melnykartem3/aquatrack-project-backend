import { deleteWaterIdService , updateWaterIdService} from "../services/water.js";

export const deleteWaterController = async (req,res,next)=>{
    try {
    const waterRecord = await deleteWaterIdService(req.water.id);

    res.status(200).json({
        msg: 'DELETED!',
        waterRecord: {
          _id: waterRecord.id,

        },
      });
}
    catch (error) {
    next(error);
}};
 export const updateWaterController = async(req, res, next) => {try {
  const waterRecord = await updateWaterIdService ( req.water.id, {...req.body, localDate:"" });

  res.status(200).json({
    msg: 'UPDATED!',
    waterRecord: {
      _id: waterRecord.id,

    },
  });

 } catch (error) {
  next(error);

 }};
