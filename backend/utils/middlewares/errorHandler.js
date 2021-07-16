/** @namespace util/middleware/error */

const boom= require('@hapi/boom');
const { DEV } = require("../../utils/config.js");

/**
 * Return if request is ajax or api
 * @function isreqAjaxorApi
 * @memberof util/middleware/error
 * @param {object} req server request object 
 * @returns {object} validate is ajax or api
 */
function isreqAjaxorApi(req) {
  return !req.accepts('html') || req.xhr;
};
/**
 * Create a new error object with normal error body and err.stack
 * @function withErrorStack
 * @memberof util/middleware/error
 * @param {error} err object error
 * @param {object} stack object error.stack
 * @returns {object} object error with more information
 */
function withErrorStack( err, stack ) {
  if( DEV ) return { ...err , stack }
};
/**
 * Middleware that print in console status error
 * @function logError
 * @memberof util/middleware/error
 * @param {error} err server object error
 * @param {object} req server object request
 * @param {object} res server object response
 * @param {function} next server function next 
 * @returns {function} call next() function 
 */
function logError(err, req, res, next) {
  let error= "";
  if( err.stack )         error= err.stack.split('\n')[0];
  else if ( err.message ) error= err.message;
  else                    error= String(err);

  console.error(`[handlerError] ${ error }`);
  next(err);
};
/**
 * Middleware that transform common error in a boom error
 * @function wrapError
 * @memberof util/middleware/error
 * @param {error} err server object error
 * @param {object} req server object request
 * @param {object} res server object response
 * @param {function} next server function next 
 * @returns {function} call next() function 
 */
function wrapError( err, req, res, next ) {
  if(!err.isBoom) next( boom.badImplementation(err) )
  next(err);
};
/**
 * Middleware that send Boom error is request from API request
 * @function cliErrorHandler
 * @memberof util/middleware/error
 * @param {error} err server object error
 * @param {object} req server object request
 * @param {object} res server object response
 * @param {function} next server function next 
 * @returns {function} call next() function 
 */
function cliErrorHandler(err, req, res, next) {
  const {
    output: { statusCode, payload }
  } = err; 
  
  if( isreqAjaxorApi(req) || res.headersSent ){
    res.status(statusCode).json( withErrorStack( payload , err.stack ) );
  }else{
    next(err);
  };
};
/**
 * Middleware that redirect user to view 404
 * @function errorHandler
 * @memberof util/middleware/error
 * @param {error} err server object error
 * @param {object} req server object request
 * @param {object} res server object response
 * @param {function} next server function next 
 */
function errorHandler(err, req, res, next) {
  if( !isreqAjaxorApi(req) ){
    const {
      output: { statusCode, payload }
    } = err; 
  
    res.status( statusCode );
    res.redirect("/404");
  };
};

module.exports= {
  logError,
  wrapError,
  cliErrorHandler,
  errorHandler
};