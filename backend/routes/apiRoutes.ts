/** @namespace route/api */

import { Express } from 'express';
import { readdirSync } from 'fs';
import { join } from 'path';
 
/**
 * Get all files with name network.ts from services folder
 * @const {array} routerList
 * @memberof route/api
 */
const routerList= readdirSync( join(__dirname , '../services') )
                    .map( (el:string)=> [ el , `../services/${el}/network` ] );

/**
 * include all routes into services folder and adapt to server
 * @function routerLink
 * @param {Express} server Express server instance
 * @memberof route/api
 */
export const routerLink= ( server: Express ) =>{
  routerList.forEach( (route: string[])=>{
    server.use( `/api/${route[0]}` , require( route[1] ) );
  });
};