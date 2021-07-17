/** @namespace util/middleware/valid */

import { RequestHandler, Request } from 'express';

/**
 * Middleware that valid values received from client using joi mehtods
 * @function validHandler
 * @memberof util/middleware/valid
 * @param {object} schema joi object schema
 * @param {object} check type of element from request
 * @returns {function} return next() method
 */
export const validHandler: Function|any= ( schema: object | any, check: string= "body" ) => {
  const validator: RequestHandler= ( req: Request|any, res, next) =>{
    const { error }: { error: string | any }= schema.validate(req[check]);
    error ? next(new Error(error)) : next();
  }
  return validator;
};