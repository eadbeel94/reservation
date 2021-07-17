/** @namespace util/middleware/auth */

import { RequestHandler, Request } from 'express';
import passport from 'passport';
import boom from '@hapi/boom';

interface userInterface { 
  _id: string, 
  id: string,
  username: string, 
  fullname: string,
  password: string
};

/**
 * Middleware that use passport local strategy to check user credential
 * @function authHandler
 * @memberof util/middleware/auth
 * @param {object} req server req object
 * @param {object} res server res object
 * @param {function} next server next object
 * @returns {function} return next() method 
 */
export const authHandler: RequestHandler = ( req: Request|any, res, next ) =>{
  return passport.authenticate('local', (err: Error|any, user: userInterface, info: object|any) => {
      if (err)
        return next(err); 

      if (!user) 
        return next(info.message);

      return req.logIn( user, (err: Error|any) => {
        if (err) 
          return next(err); 
        
        req.session.amessage= info.message;
        req.session.save();
        return next();
      });
    }
  )(req,res,next)
};

/**
 * Middleware that evualuate auth status
 * @function
 * @memberof util/middleware/auth
 * @param {object} req server req object
 * @param {object} res server res object
 * @param {function} next server next object
 * @returns {function} return next method 
 */
 export const checkLogged: RequestHandler= (req, res, next) => {
  if( req.isAuthenticated() ) return next();
  
  const error = boom.badRequest('User Authentication Required');
  error.output.statusCode = 511;
  error.reformat();
  error.output.payload.custom = 'User Authentication Required';
  return next(error);
};