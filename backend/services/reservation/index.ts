/** @namespace service/reserv */

import { RequestHandler } from 'express';
import { ResStore } from './store';

/**
 * Call methods to modify values into collection client and meetings
 * @const {class} ResStore
 * @memberof service/reserv
 */
const store= new ResStore();

const comparer= ( list=[] ) => {
  let comparer= true;
  for (let i = 1; i < list.length; i++) 
    comparer= comparer && ( list[i-1][1] == list[i][1] );
  
  return comparer;
};

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

    if( !passport || !passport.hasOwnProperty('user') ) throw new Error('User not logged');

    await store.createReservations( eventID, sites, passport.user.id );
    await store.saveClientHistory( passport.user.id, eventID, sites );
    res.json({ data: true , mess: "Reservation created successfully" });
  } catch (error) {   next(error);    };
};

export const getElements: RequestHandler= async (req,res,next)=>{
  try {
    const { eid: eventID, sites: qrSites }= req.body;

    const { list, hour, day, title }= await store.getOneEvent(eventID);
    const valids= list.filter( ([ siteServer, ]:string[])=> {
      let found= false;
      for (let i = 0; i < qrSites.length; i++){
        found= qrSites[i] == siteServer;
        if(found) break;
      };
      return found;
    });

    if( !comparer(valids) ) throw new Error('User nos match with scan code');
    const userID= valids[0][1];
    const { fullname }= await store.getOneUser(userID);
    const data= { 
      title,
      hour,
      day,
      fullname,
      places: valids.map( ([ place ]:string[]) => place )
    };
    
    res.json({ data , mess: "Get reservation successfully" });
  } catch (error) {   next(error);    };
};