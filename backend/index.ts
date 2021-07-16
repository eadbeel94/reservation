import express from 'express';
import { join } from 'path';
import cors from 'cors';

//--------------------------- Config options ---------------------------
const app= express();

if( process.env.NODE_ENV !== 'production' ) require('dotenv').config({ path: './.dev.env' });
require('./model/connection.js');

const { PORT }= require('./utils/config.js');

app.set('PORT' , PORT );

//--------------------------- Global middlewares ---------------------------
app.use( cors() );
app.use( express.json() );
app.use( express.urlencoded({ extended: true }) );

//--------------------------- Routes ---------------------------
require('./routes/apiRoutes')(app);

//--------------------------- Static files ---------------------------
//app.use( express.static( join(__dirname, '../build') ) );

//--------------------------- Errors ---------------------------


//--------------------------- Initialize server ---------------------------
app.listen( app.get('PORT') , ()=> console.log(`Server listen on ${ app.get('PORT') }`) );