/** @namespace util/middleware/auth */

const passport= require('passport');
const boom= require('@hapi/boom');

const { NOT_AUTH }= require('../../utils/config.js');

/**
 * Middleware that use passport local strategy to check user credential
 * @function authHandler
 * @memberof util/middleware/auth
 * @param {object} req server req object
 * @param {object} res server res object
 * @param {function} next server next object
 * @returns {function} return next() method 
 */
function authHandler(req,res,next){
  return passport.authenticate('local', 
    (err, user, info) => {
      if (err)
        return next(err); 

      if (!user) 
        return next(info.message);

      return req.logIn( user, err => {
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
function checkLogged(req, res, next) {
  if(req.isAuthenticated() || NOT_AUTH ) return next();
  
  const error = boom.badRequest('User Authentication Required');
  error.output.statusCode = 511;
  error.reformat();
  error.output.payload.custom = 'User Authentication Required';
  return next(error);
};

module.exports= { authHandler , checkLogged };