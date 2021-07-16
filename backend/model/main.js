/** @namespace model/schemas */

const { Schema, model } = require('mongoose'); 

const eventSchema = new Schema({                           //Creo una tabla de nombre UserSchema
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
  date:  { type: String }
})

module.exports.Event = model('events', eventSchema);
module.exports.User = model('users', userSchema);