const { Event }= require('../../model/main');

/** 
 * CRUD operation to change values into user collection
 * @memberof service/user
 **/
class EventStore{
  /** constructor not used */
  constructor(){};

  async getAllEvents(){
    return await Event.find();
  }

  async getOneEvent(id: string){
    return await Event.findById(id);
  }

  /**
   * Save new user
   * @param {object} group object with all user's fields
   */
  async createOneEvent( title: string , day: string , hour: string , col: number , row: number ){
    const newEvent= new Event({ title , day , hour , col , row });
    await newEvent.save();
  };

  async editOneEvent(id: string, title: string , day: string , hour: string , col: number , row: number){
    await Event.findByIdAndUpdate( id , { title , day , hour , col , row } );
  };

  async deleteOneEvent(id: string){
    await Event.findByIdAndDelete(id);
  };

};

export { EventStore };