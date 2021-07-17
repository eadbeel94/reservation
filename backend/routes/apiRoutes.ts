/** @namespace route/api */

import { Express } from 'express';
import { readdirSync } from 'fs';
import { join } from 'path';
 
const routerList= readdirSync( join(__dirname , '../services') )
                    .map( (el:string)=> [ el , `../services/${el}/network` ] );

export const routerLink= ( server: Express ) =>{
  routerList.forEach( (route: string[])=>{
    server.use( `/api/${route[0]}` , require( route[1] ) );
  });
};