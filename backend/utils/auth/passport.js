/** @namespace util/auth */

const bcrypt = require('bcrypt');                                     //Call bcrypt library
const passport = require('passport');                                 //Call passport library
const LocalStrategy = require('passport-local').Strategy;             //Use local strategy for authentification

const { User } = require('../../model/main.js');                              //Call just schema user

/**
 * Create strategy to evaluate user credential
 * @callback passport->LocalStrategy
 * @memberof util/auth
 */
passport.use(new LocalStrategy(
  async (username, password, done) => {                               //Get username and password from authetification client form

    let client;
    const newUser = username.toUpperCase();
    if(username)
      client = await User.findOne({ username: newUser || '' });                    //Check if user exist into database

    if(!client)
      return done(null, false, { message: `User not found` });     //Error message if user doesn't exist
    else{
      const match = await bcrypt.compare(password, client.password);  //If user exist then check password
      if(!match)
        return done(null, false, { message: 'Password not correct' });    //IF password doesn't  correct, then show error message
      else
        return done(null, client, { message: `Welcome ${ String(client.fullname).toUpperCase() }` });   //if is correct, then show ok message
    }
  }
));
/**
 * Passport user serialization
 * @callback passport->serializeUser
 * @memberof util/auth
 */
passport.serializeUser(( userdata , done) => {
  let info= {
    id: userdata._id || '',
    username: userdata.username || '',
    fullname: userdata.fullname
  }
  done(null, info );
});
/**
 * Passport user des-serialization
 * @callback passport->serializeUser
 * @memberof util/auth
 */
passport.deserializeUser((data, done) => {
  User.findById({ '_id': data.id }, (err, user) => {
    done(err, user);
  });
});