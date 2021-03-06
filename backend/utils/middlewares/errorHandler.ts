/** @namespace util/middleware/error */

import boom from '@hapi/boom';
import { ErrorRequestHandler, Request } from 'express';

/**
 * Return if request is ajax or api
 * @function isreqAjaxorApi
 * @memberof util/middleware/error
 * @param {object} req Express server request object
 * @returns {object} validate is ajax or api
 */
const isreqAjaxorApi: boolean|any= ( req: Request ) => {
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
const withErrorStack: Error|object|any= ( err: Error, stack: object ) => {
  //if( process.env.NODE_ENV !== "production" ) return { ...err , stack };
  return { ...err , stack };
};

/**
 * Middleware that print in console status error
 * @function logError
 * @memberof util/middleware/error
 * @param {error} err object error
 * @param {object} req Express server request object
 * @param {object} res Express server response object
 * @param {function} next Express server next method
 * @returns {function} call next() function 
 */
export const logError:ErrorRequestHandler= (err, req, res, next) => {
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
 * @param {error} err object error
 * @param {object} req Express server request object
 * @param {object} res Express server response object
 * @param {function} next Express server next method
 * @returns {function} call next() function 
 */
export const wrapError: ErrorRequestHandler= ( err, req, res, next ) => {
  if(!err.isBoom) next( boom.badImplementation(err) )
  next(err);
};

/**
 * Middleware that send Boom error is request from API request
 * @function cliErrorHandler
 * @memberof util/middleware/error
 * @param {error} err object error
 * @param {object} req Express server request object
 * @param {object} res Express server response object
 * @param {function} next Express server next method
 * @returns {function} call next() function 
 */
export const cliErrorHandler: ErrorRequestHandler= (err, req, res, next) => {
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
 * @param {error} err object error
 * @param {object} req Express server request object
 * @param {object} res Express server response object
 * @param {function} next Express server next method
 */
export const errorHandler: ErrorRequestHandler= (err, req, res, next) => {
  if( !isreqAjaxorApi(req) ){
    const {
      output: { statusCode, payload }
    } = err; 
  
    res.status( statusCode );
    res.redirect("/404.html");
  };
};