/** @namespace route/user */

const { Router }= require('express');
const router= Router();

//const valid= require('../../utils/middlewares/validHandler.js');
//const { authHandler } = require('../../utils/middlewares/authHandler.js');
const { 
  getAllElements, 
  getOneElement,
  createElement,
  editElement,
  delElement
}= require('./index.js');
//const { userNewSchema }= require('../../utils/schema/validSchema.js');

router.get('/getAll' /*, valid( userNewSchema ) ,*/, async (req,res,next)=>{
  try {
    const data= await getAllElements();
    res.json({ data , mess: "Get All Events successfully" });
  } catch (error) {   next(error);    };
});

router.get('/getOne/:eid' /*, valid( userNewSchema ) ,*/, async (req,res,next)=>{
  try {
    const { eid: id }= req.params;

    const data= await getOneElement(id);
    res.json({ data , mess: "Get All Events successfully" });
  } catch (error) {   next(error);    };
});

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
router.post('/addOne' /*, valid( userNewSchema ) ,*/, async (req,res,next)=>{
  try {
    const { title, day, hour, row, col }= req.body;
    await createElement( title, day, hour, row, col );

    res.json({ data: true , mess: "Create Event successfully" });
  } catch (error) {   next(error);    };
});

router.put('/editOne/:id' /*, valid( userNewSchema ) ,*/, async (req,res,next)=>{
  try {
    const { id }= req.params;
    const { title, day, hour, row, col }= req.body;

    await editElement( id, title, day, hour, row, col );
    res.json({ data: true , mess: "Edit Event successfully" });
  } catch (error) {   next(error);    };
});

router.delete('/delOne/:id' /*, valid( userNewSchema ) ,*/, async (req,res,next)=>{
  try {
    const { id }= req.params;

    await delElement( id );
    res.json({ data: true , mess: "Delete Event successfully" });
  } catch (error) {   next(error);    };
});

module.exports= router;