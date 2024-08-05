import { Schema, model } from 'mongoose';

import { mongooseSaveError, setUpdateSettings } from './hooks.js';




const WaterSchema = new Schema({
  date: {
    type: String,
  },
  waterVolume: {
    type: Number,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  },
}, {
  versionKey: false,

});


WaterSchema.post("save", mongooseSaveError);

WaterSchema.pre("findOneAndUpdate", setUpdateSettings );

WaterSchema.post("findOneAndUpdate", mongooseSaveError);

const WaterCollection = model('water', WaterSchema);

export default WaterCollection;




