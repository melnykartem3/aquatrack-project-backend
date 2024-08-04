import { createWater } from "../services/water.js";


export const createNewWaterController = async (req, res) => {
    const { _id: userId } = req.user;
    const data = await createWater({ ...req.body, userId });

    res.status(201).json({
        status: 201,
        message: "The drunk part of the water has been successfully added!",
        data,
    });
};
