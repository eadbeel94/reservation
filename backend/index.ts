import express from 'express';
import { join } from 'path';
import cors from 'cors';

//--------------------------- Config options ---------------------------
const app= express();

app.set('PORT' , process.env.PORT || '3001' );

//--------------------------- Global middlewares ---------------------------
app.use( cors() );
app.use( express.json() );
app.use( express.urlencoded({ extended: true }) );

//--------------------------- Routes ---------------------------
app.use( '/' , ( req, res ) => res.send('hello') );

//--------------------------- Static files ---------------------------
//app.use( express.static( join(__dirname, '../build') ) );

//--------------------------- Errors ---------------------------


//--------------------------- Initialize server ---------------------------
app.listen( app.get('PORT') , ()=> console.log(`Server listen on ${ app.get('PORT') }`) );