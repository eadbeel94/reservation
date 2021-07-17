/** @namespace route/user */

import { generateElements } from './index';
import { Router } from 'express';
const router= Router();

import { validHandler as valid } from '../../utils/middlewares/validHandler';
import { reservationSchema } from '../../utils/schema/validSchema';

router.put('/addSome', valid(reservationSchema) , generateElements);

module.exports= router;