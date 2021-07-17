/** @namespace model/schemas */

import { Schema, model } from 'mongoose';

const meetingSchema = new Schema({                           //Creo una tabla de nombre UserSchema
  title:  { type: String },
  day:    { type: String },
  hour:   { type: String },
  row:    { type: Number },
  col:    { type: Number },
  list:   { type: Array  }
});

/** 
 * Mongodb schema with all user params 
 * @const {schema} userSchema
 * @memberof model/schemas
 */
const userSchema = new Schema({
  username: { type: String, required: true , unique: true },
  fullname: { type: String },
  email:    { type: String },
  password: { type: String, required: true },
  history:  { type: Array },
  date:     { type: Number }
});

export const Event= model('events', meetingSchema);
export const Client= model('users', userSchema);