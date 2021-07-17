/** @namespace util/schemas */

const Joi= require('joi');


/**
 * Using joi structure, create a validator for ID mongo db values
 * @type {Object}
 * @constant meetingSchemaID
 * @property {string} id Check if exist 24 hexadecimal positions 
 * @memberof util/schemas
 */

export const meetingSchemaID= Joi.object({
  eid: Joi.string().regex(/^[0-9a-fA-F]{24}$/)
});

/**
 * Using joi structure, create a validator for each field into form recipe
 * @type {Object}
 * @constant meetingSchema
 * @property {string} title evaluate that string contain 100 between 3 values 
 * @memberof util/schemas
 */
export const meetingSchema= Joi.object({
  title: Joi.string().min(3).max(100).required(),
  day:  Joi.string().min(3).max(25),
  hour:  Joi.string().min(3).max(25),
  col: Joi.number().integer().min(1).max(10),
  row: Joi.number().integer().min(1).max(10),
});

export const reservationSchema= Joi.object({
  eid:    Joi.string().regex(/^[0-9a-fA-F]{24}$/),
  sites:  Joi.array().items(Joi.number().integer().min(1)),
});

/**
 * Using joi structure, create a validator for each field into form user
 * @type {Object}
 * @constant userNewSchema
 * @property {string} fullname evaluate that value is a string
 * @property {string} username evaluate that value is a string
 * @property {string} password evaluate that string contain more 3 character
 * @property {string} confirm evaluate that string contain more 3 character
 * @property {string} email evaluate that string is a email end with com or net
 * @memberof util/schemas
 */
export const userNewSchema= Joi.object({
  fullname: Joi.string(),
  username: Joi.string(),
  password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
  confirm:  Joi.ref('password'),
  email:    Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
}).with('password', 'confirm');