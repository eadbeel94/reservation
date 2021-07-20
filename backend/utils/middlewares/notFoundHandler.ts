/** @namespace util/middleware/notF */

import boom from '@hapi/boom';
import { RequestHandler } from 'express';

/**
 * Middleware that redirect to page not found or send message not found
 * @function notFoundHandler
 * @memberof util/middleware/notF
 * @param {object} req Express server request object
 * @param {object} res Express server response object
 * @param {function} next Express server next method
 */
export const notFoundHandler: RequestHandler= (req, res, next) =>{
  if( !req.accepts('html') || req.xhr ){
    const {
      output: { statusCode, payload }
    } = boom.notFound(); 
    res.status( statusCode ).json( payload );
  }else
    res.status(404).redirect("/404.html");
};