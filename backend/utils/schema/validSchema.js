/** @namespace util/schemas */

const Joi= require('joi');

/**
 * Using joi structure, create a validator for ID mongo db values
 * @type {Object}
 * @constant recipeIdSchema
 * @property {string} id Check if exist 24 hexadecimal positions 
 * @memberof util/schemas
 */
const recipeIdSchema= Joi.object({
  id: Joi.string().regex(/^[0-9a-fA-F]{24}$/)
});
/**
 * Using joi structure, create a validator for each field into form recipe
 * @type {Object}
 * @constant recipeSchema
 * @property {string} title evaluate that string contain 100 between 3 values 
 * @property {Array} list evaluate that exist an array of strings
 * @property {string} inst evaluate that string contain more 3 character
 * @property {string} from evaluate that string contain more 3 character
 * @property {string} desc evaluate that string contain 100 between 3 values 
 * @property {string} image evaluate that string contain 100 between 3 values 
 * @property {string} datec evaluate that string contain 100 between 3 values 
 * @property {string} datem evaluate that string contain 100 between 3 values 
 * @memberof util/schemas
 */
const recipeSchema= Joi.object({
  title: Joi.string().min(3).max(100).required(),
  list:  Joi.array().items(Joi.string()),
  inst:  Joi.string().min(3),
  from:  Joi.string().min(3).max(100),
  desc:  Joi.string().min(3).max(200),
  image: Joi.string().min(3).max(100),
  datec: Joi.string().min(3).max(100),
  datem: Joi.string().min(3).max(100),
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
const userNewSchema= Joi.object({
  fullname: Joi.string(),
  username: Joi.string(),
  password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
  confirm:  Joi.ref('password'),
  email:    Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
}).with('password', 'confirm');

module.exports= {
  recipeIdSchema,
  recipeSchema,
  userNewSchema
};