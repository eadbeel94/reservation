/** @namespace util/middleware/valid */

/**
 * Middleware that valid values received from client using joi mehtods
 * @function validHandler
 * @memberof util/middleware/valid
 * @param {object} schema joi object schema
 * @param {object} check type of element from request
 * @returns {function} return next() method
 */
function validHandler( schema, check= "body" ) {
  return function (req, res, next) {
    const { error }= schema.validate(req[check])
    error ? next(new Error(error)) : next();
  };
};

module.exports= validHandler;