/** @namespace service/reserv */

import { RequestHandler } from 'express';
import { ResStore } from './store';

/**
 * Call methods to modify values into collection client and meetings
 * @const {class} ResStore
 * @memberof service/reserv
 */
const store= new ResStore();

/**
 * Create a reservation editing elements both databases
 * @function generateElements
 * @memberof service/reserv
 * @param req Express server request object
 * @param res Express server response object
 * @param next Express server next method
 */
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