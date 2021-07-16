const { Event }= require('../../model/main.js');

/** 
 * CRUD operation to change values into user collection
 * @memberof service/user
 **/
class ResStore{
  /** constructor not used */
  constructor(){};

  async getAllEvents(){
    return await Event.find();
  }

  async getOneEvent(id){
    return await Event.findById(id);
  }

  /**
   * Save new user
   * @param {object} group object with all user's fields
   */
  async createOneEvent( title , day , hour , col , row ){
    const newEvent= new Event({ title , day , hour , col , row });
    await newEvent.save();
  };

  async editOneEvent(id, title , day , hour , col , row){
    await Event.findByIdAndUpdate( id , { title , day , hour , col , row } );
  };

  async deleteOneEvent(id){
    await Event.findByIdAndDelete(id);
  };

};

module.exports= { ResStore };