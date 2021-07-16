/** @namespace route/user */

const { Router }= require('express');
const router= Router();

router.get('/', async (req,res,next)=>{
  try {
    res.json({ data: true , mess: "" });
  } catch (error) {   next(error);    };
});

module.exports= router;