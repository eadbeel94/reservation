/** @namespace model/connect */

const { connect }= require('mongoose');
const { DB_URI }= require('../utils/config.js');

/**
 * Stablish conection with database
 * @function connection
 * @param {string} uri database address
 * @memberof model/connect
 */
const connection= ( uri="" ) => {
  connect( uri , {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  })
  .then( db => db && console.log('DB connected') )
  .catch( err => console.log( err.message || String(err) ) );
};

connection( DB_URI );