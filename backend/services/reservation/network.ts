/** @namespace route/reserv */

import { Router } from 'express';
const router= Router();

import { generateElements, getElements } from './index';
import { validHandler as valid } from '../../utils/middlewares/validHandler';
import { reservationSchema } from '../../utils/schema/validSchema';

/**
 * Save a reservation into database, use middleware to check validation form
 *
 * @name addSome
 * @path {PUT} /api/recervation/addSome
 * @body {object} reservation Include all reservation fields  
 * @response {object} data
 * @response {string} mess contain status message
 * @memberof route/reserv
 */
router.put('/addSome', valid(reservationSchema) , generateElements );

/**
 * Get reservation information, Meeting data and user who request reservation
 *
 * @name getOne
 * @path {PUT} /api/recervation/getOne
 * @body {object} reservation Include all reservation fields
 * @response {object} data
 * @response {string} mess contain status message
 * @memberof route/reserv
 */
router.post('/getOne', valid(reservationSchema) , getElements );

module.exports= router;