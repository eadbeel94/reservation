/** @namespace service/user */

import { RequestHandler } from 'express';
import { ResStore } from './store';

/**
 * Call methods to modify values into collection user
 * @const {class} ResStore
 * @memberof service/user
 */
const store= new ResStore();

export const generateElements: RequestHandler= async (req,res,next)=>{
  try {
    const { eid: eventID, sites }= req.body;
    const { passport }: object|any = req.session;

    if( !passport.hasOwnProperty('user') ) throw new Error('User not logged');

    await store.createReservations( eventID, sites, passport.user.id );
    await store.saveClientHistory( passport.user.id, eventID, sites );
    res.json({ data: true , mess: "" });
  } catch (error) {   next(error);    };
};