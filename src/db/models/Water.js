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

const WaterCollection = model('water', WaterSchema);

export default WaterCollection;
