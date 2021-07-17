/** @namespace service/user */

import { RequestHandler } from 'express';
import { EventStore } from './store';

/**
 * Call methods to modify values into collection user
 * @const {class} EventStore
 * @memberof service/user
 */
const store= new EventStore();

export const getAllElements: RequestHandler=  async (req, res, next) => {
  try {
    const data= await store.getAllEvents(); 
    res.json({ data , mess: "Get All Meetings successfully" });
  } catch (error) {   next(error)   };
};

export const getOneElement: RequestHandler=   async (req, res, next)=>{
  try {
    const { eid: id }= req.params;

    const data= await store.getOneEvent(id);
    res.json({ data , mess: `Get Meeting with id ${ id } successfully` });
  } catch (error) {   next(error);    };
};

export const createElement: RequestHandler=   async (req, res, next)=>{
  try {
    const { title, day, hour, row, col }= req.body;
    await store.createOneEvent( title, day, hour, row, col );

    res.json({ data: true , mess: "Meeting created successfully" });
  } catch (error) {   next(error);    };
};

export const editElement: RequestHandler=     async (req, res, next)=>{
  try {
    const { eid }= req.params;
    const { title, day, hour, row, col }= req.body;

    await store.editOneEvent( eid, title, day, hour, row, col );
    res.json({ data: true , mess: `Meeting with id ${ eid } modified successfully` });
  } catch (error) {   next(error);    };
};

export const delElement: RequestHandler=      async (req, res, next)=>{
  try {
    const { eid }= req.params;

    await store.deleteOneEvent( eid );
    res.json({ data: true , mess: "Meeting with id ${ id } deleted successfully" });
  } catch (error) {   next(error);    };
};