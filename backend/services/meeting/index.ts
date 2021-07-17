/** @namespace service/meeting */

import { RequestHandler } from 'express';
import { EventStore } from './store';

/**
 * Call methods to modify values into collection meeting
 * @const {class} EventStore
 * @memberof service/meeting
 */
const store= new EventStore();

/**
 * Get all meetings
 * @function getAllElements
 * @memberof service/meeting
 * @param req Express server request object
 * @param res Express server response object
 * @param next Express server next method
 */
export const getAllElements: RequestHandler=  async (req, res, next) =>{
  try {
    const data= await store.getAllEvents(); 
    res.json({ data , mess: "Get All Meetings successfully" });
  } catch (error) {   next(error)   };
};

/**
 * Get just only one meeting
 * @function getOneElement
 * @memberof service/meeting
 * @param req Express server request object
 * @param res Express server response object
 * @param next Express server next method
 */
export const getOneElement: RequestHandler=   async (req, res, next) =>{
  try {
    const { eid: id }= req.params;

    const data= await store.getOneEvent(id);
    res.json({ data , mess: `Get Meeting with id ${ id } successfully` });
  } catch (error) {   next(error);    };
};

/**
 * Create one meeting
 * @function createElement
 * @memberof service/meeting
 * @param req Express server request object
 * @param res Express server response object
 * @param next Express server next method
 */
export const createElement: RequestHandler=   async (req, res, next) =>{
  try {
    const { title, day, hour, row, col }= req.body;
    await store.createOneEvent( title, day, hour, row, col );

    res.json({ data: true , mess: "Meeting created successfully" });
  } catch (error) {   next(error);    };
};

/**
 * Edite one meeting
 * @function editElement
 * @memberof service/meeting
 * @param req Express server request object
 * @param res Express server response object
 * @param next Express server next method
 */
export const editElement: RequestHandler=     async (req, res, next) =>{
  try {
    const { eid }= req.params;
    const { title, day, hour, row, col }= req.body;

    await store.editOneEvent( eid, title, day, hour, row, col );
    res.json({ data: true , mess: `Meeting with id ${ eid } modified successfully` });
  } catch (error) {   next(error);    };
};

/**
 * Delete one meeting
 * @function delElement
 * @memberof service/meeting
 * @param req Express server request object
 * @param res Express server response object
 * @param next Express server next method
 */
export const delElement: RequestHandler=      async (req, res, next) =>{
  try {
    const { eid }= req.params;

    await store.deleteOneEvent( eid );
    res.json({ data: true , mess: "Meeting with id ${ id } deleted successfully" });
  } catch (error) {   next(error);    };
};