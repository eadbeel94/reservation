/** @namespace route/api */

const { readdirSync }= require('fs');
const { join }= require('path');

const routerList= readdirSync( join(__dirname , '../services') )
                    .map( el=> [ el , `../services/${el}/network.js` ] );

function routerLink( server ){
  routerList.forEach( route=>{
    server.use( `/api/${route[0]}` , require( route[1] ) );
  });
};

module.exports= routerLink;