import { Schema, model } from 'mongoose';

import { mongooseSaveError, setUpdateSettings } from './hooks.js';

const WaterSchema = new Schema({
  date: {
    type: String,
  },
  waterVolume: {
    type: String,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  },
});


  WaterSchema.post("save", mongooseSaveError);

WaterSchema.pre("findOneAndUpdate", setUpdateSettings );

WaterSchema.post("findOneAndUpdate", mongooseSaveError);

const WaterCollection = model('water', WaterSchema);

export default WaterCollection;
