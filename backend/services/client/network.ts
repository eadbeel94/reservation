/** @namespace route/user */

import { Router } from "express";
const router= Router();

import { createElement, authUser, logoutUser } from './index';
import { validHandler as valid } from '../../utils/middlewares/validHandler';
import { authHandler } from '../../utils/middlewares/authHandler';
import { userNewSchema } from '../../utils/schema/validSchema';

/**
 * Save a new user into database, use middleware validation form
 *
 * @name addOne
 * @path {POST} /api/users/addOne
 * @body {object} user Include all user fields  
 * @response {object} data
 * @response {string} mess contain status message
 * @memberof route/user
 */
 router.post( '/addOne' , valid(userNewSchema), createElement );
/**
 * Verify credential user, use middleware passport strategy custom
 *
 * @name auth
 * @path {POST} /api/users/auth
 * @auth This route requires Authentication. If authentication fails it redirect main page with error message
 * @response {object} data
 * @response {string} mess contain status message
 * @memberof route/user
 */
router.post("/auth" , authHandler, authUser );
/**
 * Execute session end
 *
 * @name logout
 * @path {GET} /api/users/logout
 * @response {object} data
 * @response {string} mess contain status message
 * @memberof route/user
 */
router.get("/logout" , logoutUser);

export= router;