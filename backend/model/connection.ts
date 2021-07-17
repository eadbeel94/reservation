/** @namespace model/connect */

import { connect, ConnectOptions } from 'mongoose';
import { DB_URL } from '../utils/config';

/**
 * Stablish conection with database
 * @function connection
 * @param {string} uri database address
 * @memberof model/connect
 */
const connection= ( uri: string= "" ): void => {

  const options: ConnectOptions= {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  };
  
  connect( uri , options )
    .then( db => db && console.log('DB connected') )
    .catch( err => console.log( err.message || String(err) ) );
};

connection( DB_URL );