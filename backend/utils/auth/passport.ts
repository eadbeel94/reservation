/** @namespace util/auth */

import bcrypt from 'bcrypt';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Client } from '../../model/main';

interface userInterface { 
  _id: string, 
  id: string,
  username: string, 
  fullname: string,
  password: string
};

/**
 * Create strategy to evaluate user credential
 * @callback passport->LocalStrategy
 * @memberof util/auth
 */
passport.use(new LocalStrategy(
  async ( username:string, password:string, done: CallableFunction ) => { //Get username and password from authetification client form
    let client: userInterface | any;
    const newUser: string = username.toUpperCase();
    if(username)
      client = await Client.findOne({ username: newUser || '' });         //Check if user exist into database

    if(!client)
      return done(null, false, { message: `User not found` });            //Error message if user doesn't exist
    else{
      const match = await bcrypt.compare(password, client.password);      //If user exist then check password
      if(!match)  
        return done(null, false, { message: 'Password not correct' });    //If password doesn't  correct, then show error message
      else        
        return done(null, client, { message: `Welcome ${ String(client.fullname).toUpperCase() }` });   //If is correct, then show ok message
    }
  }
));

/**
 * Passport user serialization
 * @callback passport->serializeUser
 * @memberof util/auth
 */
passport.serializeUser(( userdata: userInterface | any , done: CallableFunction ) => {
  const info= {
    id: userdata._id || '',
    username: userdata.username || '',
    fullname: userdata.fullname
  }
  done(null, info);
});

/**
 * Passport user des-serialization
 * @callback passport->des-serializeUser
 * @memberof util/auth
 */
passport.deserializeUser(( data:userInterface, done:CallableFunction ) => {
  Client.findById({ '_id': data.id }, ( err: Error|any, user: userInterface ) => {
    done(err, user);
  });
});