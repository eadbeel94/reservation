/** @namespace service/user */

import { CliStore } from './store';
import { RequestHandler } from 'express';
import bcrypt from 'bcrypt';
import m from 'dayjs';

/**
 * Call methods to modify values into collection user
 * @const {class} CliStore
 * @memberof service/user
 */
const store= new CliStore();

interface userInterface { 
  email: string,
  fullname: string, 
  username: string,
  password: string
};

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

export const authUser: RequestHandler= async(req, res, next) =>{
  try {
    const { amessage }:any= req.session;
    
    res.json({ data: true , mess: amessage });
  } catch (error) {   next(error)   };
};

export const logoutUser: RequestHandler= async (req, res, next) => {
  try {
    req.logout();    
    res.json({ data: true , mess: "Session closed successfully" });
  } catch (error) {   next(error)   };
};