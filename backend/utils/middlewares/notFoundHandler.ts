import { RequestHandler } from 'express';
import boom from '@hapi/boom';

/**
 * 
 * @param {object} req server object request
 * @param {object} res server object response
 * @param {function} next server function next 
 */
export const notFoundHandler: RequestHandler= (req, res, next) =>{
  if( !req.accepts('html') || req.xhr ){
    const {
      output: { statusCode, payload }
    } = boom.notFound(); 
    res.status( statusCode ).json( payload );
  }else
    res.status(404).redirect("/404");
};