/** @namespace service/client */

import { CliStore } from './store';
import { RequestHandler } from 'express';
import bcrypt from 'bcrypt';
import m from 'dayjs';

/**
 * Call methods to modify values into collection user
 * @const {class} CliStore
 * @memberof service/client
 */
const store= new CliStore();

interface userInterface { 
  email: string,
  fullname: string, 
  username: string,
  password: string
};

/**
 * Get all user data and encrypt password, then save info into database
 * @function createElement
 * @memberof service/client
 * @param req Express server request object
 * @param res Express server response object
 * @param next Express server next method
 */
export const createElement: RequestHandler= async (req,res,next) =>{
  try {
    const { fullname: full, email, username: user, password: pass }: userInterface= req.body;

    const username= user.toUpperCase();
    const salt = await bcrypt.genSalt(10);  
    const password = await bcrypt.hash(pass, salt);
    const date = m().unix();
  
    await store.createUser( full, email, username, password, date );
    res.json({ data: true , mess: "Add one element successfully" });
  } catch (error) {   next(error);    };
};

/**
 * After user login send a message status
 * @function authUser
 * @memberof service/client
 * @param req Express server request object
 * @param res Express server response object
 * @param next Express server next method
 */
export const authUser: RequestHandler= async(req, res, next) =>{
  try {
    const { amessage }: string|any = req.session;
    
    res.json({ data: true , mess: amessage });
  } catch (error) {   next(error)   };
};

/**
 * Execute method logout to end client session
 * @function logoutUser
 * @memberof service/client
 * @param req Express server request object
 * @param res Express server response object
 * @param next Express server next method
 */
export const logoutUser: RequestHandler= async (req, res, next) => {
  try {
    req.logout();    
    res.json({ data: true , mess: "Session closed successfully" });
  } catch (error) {   next(error)   };
};

/**
 * Get meeting from ID client
 * @function getOneElement
 * @memberof service/meeting
 * @param req Express server request object
 * @param res Express server response object
 * @param next Express server next method
 */
 export const getOneElement: RequestHandler= async (req, res, next) =>{
  try {
    const { passport }: object|any = req.session;

    if( !passport || !passport.hasOwnProperty('user') ) throw new Error('User not logged');

    const id= passport.user.id;
    const { history: histA }= await store.getOneClient(id,['history']);
    
    let histB= histA.map( ([ place, eid ]: string[]) => eid);
    histB= [...new Set(histB)];

    const eventsA= await store.getSomeEvents(histB);
    const eventsB: { [foo: string]: object }= {};

    eventsA.forEach( (event:any) => {
      eventsB[event._id]= {
        title: event.title,
        day: event.day,
        hour: event.hour
      }
    });

    const data= { history: histA, events: eventsB };
    res.json({ data , mess: `Get Client with id ${ id } successfully` });
  } catch (error) {   next(error);    };
};