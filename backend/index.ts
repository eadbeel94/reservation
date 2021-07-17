//--------------------------- Call libraries ---------------------------
import express from 'express';
import session from 'express-session';
import passport from 'passport';
import { join } from 'path';
import cors from 'cors';
//--------------------------- Call custom libraries ---------------------------
import { routerLink as routesHandler } from './routes/apiRoutes';
import { notFoundHandler } from './utils/middlewares/notFoundHandler';
import { logError, wrapError, cliErrorHandler, errorHandler } from './utils/middlewares/errorHandler';
//--------------------------- Config options ---------------------------
const app= express();             //Initialize server

if( process.env.NODE_ENV !== "production" ) require('dotenv').config();   //Call this library if was develop mode
import './model/connection';      //Call database connection
import './utils/auth/passport';   //Call passport methods

app.set('PORT' , process.env.PORT || 3000 );    //Set port value
//--------------------------- Global middlewares ---------------------------
app.use( cors() );                //Call cors to handle communication with diferent domain
app.use( express.json() );        //Common use when we work with apis
app.use( express.urlencoded({ extended: true }) );  //handle http request
app.use(session({                 //handle sessions with n quantity time
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
  cookie: { secure: false, maxAge: 1000 * 60 * 11 }   
}));
app.use(passport.initialize());   //Initialize passport middleware
app.use(passport.session());      //Initialize session middleware
//--------------------------- Routes ---------------------------
routesHandler(app);               //Call api routes for each services folder
//--------------------------- Static files ---------------------------
app.use( express.static( join(__dirname, process.env.NODE_ENV !== 'production' ? './dist/public/' : './public' ) ) );   //Handle static files
//--------------------------- Errors ---------------------------
app.use( notFoundHandler );       //Handle each error
app.use( logError );
app.use( wrapError );
app.use( cliErrorHandler );
app.use( errorHandler );
//--------------------------- Initialize server ---------------------------
app.listen( app.get('PORT') , ()=> console.log(`Server listen on ${ app.get('PORT') }`) );    //listen server initialize