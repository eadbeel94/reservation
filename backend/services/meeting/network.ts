/** @namespace route/meeting */

import { Router } from 'express';
const router= Router();

import { 
  getAllElements, 
  getOneElement,
  createElement,
  editElement,
  delElement
} from './index';
import { validHandler as valid } from '../../utils/middlewares/validHandler';
import { meetingSchemaID, meetingSchema } from '../../utils/schema/validSchema';

/**
 * Get all Meetings
 *
 * @name getAll
 * @path {GET} /api/meeting/getAll
 * @response {Array<object>} data contain group of meeting
 * @response {string} mess contain status message
 * @memberof route/meeting
 */
router.get('/getAll', getAllElements );

/**
 * Get all Meeting using a Meeting ID, use middleware to check validation id
 *
 * @name getOne
 * @path {GET} /api/meeting/getOne
 * @params {string} :eid meeting Identificator
 * @response {object} data contain meeting information
 * @response {string} mess contain status message
 * @memberof route/meeting
 */
router.get('/getOne/:eid', valid( meetingSchemaID , 'params' ), getOneElement );

/**
 * Save a Meeting into database, use middleware to check validation form
 *
 * @name addOne
 * @path {POST} /api/meeting/addOne
 * @body {object} meeting Include all meeting fields  
 * @response {object} data 
 * @response {string} mess contain status message
 * @memberof route/meeting
 */
router.post('/addOne', valid( meetingSchema ), createElement );

/**
 * Edit a Meeting into database, use middleware to check validation form
 *
 * @name editOne
 * @path {PUT} /api/meeting/editOne
 * @params {string} :eid meeting Identificator
 * @body {object} meeting Include all meeting fields  
 * @response {object} data
 * @response {string} mess contain status message
 * @memberof route/meeting
 */
router.put('/editOne/:eid', valid( meetingSchemaID , 'params' ), valid( meetingSchema ), editElement );

/**
 * Delete a meeting into database, use middleware to check validation id
 *
 * @name delOne
 * @path {DELETE} /api/meeting/delOne
 * @params {string} :eid meeting Identificator
 * @response {object} data
 * @response {string} mess contain status message
 * @memberof route/meeting
 */
router.delete('/delOne/:eid', valid( meetingSchemaID , 'params' ), delElement );

module.exports= router;