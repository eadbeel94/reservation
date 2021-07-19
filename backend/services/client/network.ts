/** @namespace route/client */

import { Router } from "express";
const router= Router();

import { createElement, authUser, logoutUser, getOneElement } from './index';
import { validHandler as valid } from '../../utils/middlewares/validHandler';
import { authHandler } from '../../utils/middlewares/authHandler';
import { userNewSchema } from '../../utils/schema/validSchema';

/**
 * Save a new user into database, use middleware validation form
 *
 * @name addOne
 * @path {POST} /api/client/addOne
 * @body {object} user Include all user fields  
 * @response {object} data
 * @response {string} mess contain status message
 * @memberof route/client
 */
router.post("/addOne", valid(userNewSchema), createElement);

/**
 * Verify credential user, use middleware passport strategy custom
 *
 * @name auth
 * @path {POST} /api/client/auth
 * @auth This route requires Authentication. If authentication fails it redirect main page with error message
 * @response {object} data
 * @response {string} mess contain status message
 * @memberof route/client
 */
router.post("/auth", authHandler, authUser);

/**
 * Execute session end
 *
 * @name logout
 * @path {GET} /api/client/logout
 * @response {object} data
 * @response {string} mess contain status message
 * @memberof route/client
 */
router.get("/logout" , logoutUser);

/**
 * Get client based on client identificator
 *
 * @name logout
 * @path {GET} /api/client/getOne
 * @response {object} data all client information
 * @response {string} mess contain status message
 * @memberof route/client
 */
router.get("/getOne" , getOneElement);

export= router;