import express from 'express';
import session from 'express-session';
import passport from 'passport';
import { join } from 'path';
import cors from 'cors';

import { PORT } from './utils/config';
import { routerLink as routesHandler } from './routes/apiRoutes';
import { notFoundHandler } from './utils/middlewares/notFoundHandler';
import { logError, wrapError, cliErrorHandler, errorHandler } from './utils/middlewares/errorHandler';
//--------------------------- Config options ---------------------------
const app= express();

if( process.env.NODE_ENV !== 'production' ) require('dotenv').config();
import './model/connection';
import './utils/auth/passport';

app.set('PORT' , PORT );
//--------------------------- Global middlewares ---------------------------
app.use( cors() );
app.use( express.json() );
app.use( express.urlencoded({ extended: true }) );
app.use(session({                                     //Inicialize session
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
  cookie: { secure: false, maxAge: 1000 * 60 * 11 }    //Keep session value for 2 minutes
}));
app.use(passport.initialize());                       //Inicialize passport
app.use(passport.session());                          //Inicialize session

//--------------------------- Routes ---------------------------
routesHandler(app);
//--------------------------- Static files ---------------------------
app.use( express.static( join(__dirname, '../frontend/www/') ) );
//--------------------------- Errors ---------------------------
app.use( notFoundHandler );
app.use( logError );
app.use( wrapError );
app.use( cliErrorHandler );
app.use( errorHandler );
//--------------------------- Initialize server ---------------------------
app.listen( app.get('PORT') , ()=> console.log(`Server listen on ${ app.get('PORT') }`) );