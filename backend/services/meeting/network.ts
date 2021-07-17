/** @namespace route/user */

import { 
  getAllElements, 
  getOneElement,
  createElement,
  editElement,
  delElement
} from './index';
import { Router } from 'express';
const router= Router();

import { validHandler as valid } from '../../utils/middlewares/validHandler';
import { meetingSchemaID, meetingSchema } from '../../utils/schema/validSchema';

router.get('/getAll', getAllElements );

router.get('/getOne/:eid', valid( meetingSchemaID , 'params' ), getOneElement );

router.post('/addOne', valid( meetingSchema ), createElement );

router.put('/editOne/:eid', valid( meetingSchemaID , 'params' ), valid( meetingSchema ), editElement );

router.delete('/delOne/:eid', valid( meetingSchemaID , 'params' ), delElement );

module.exports= router;