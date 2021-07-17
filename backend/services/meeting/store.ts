const { Event }= require('../../model/main');

/** 
 * CRUD operation to change values into meeting collection
 * @memberof service/meeting
 **/
class EventStore{
  /** constructor not used */
  constructor(){};

  /**
   * Get all meetings
   * @returns {array<object>} All meetings
   */ 
  async getAllEvents(){
    return await Event.find();
  };

  /**
   * Get One meeting using a meeting id
   * @param {string} id Meeting identificator 
   * @returns {object} if exist get meeting
   */ 
  async getOneEvent(id: string){
    return await Event.findById(id);
  };

  /**
   * Save new meeting
   * @param {string} title meeting name title
   * @param {string} day meeting target day
   * @param {string} hour meeting target hour
   * @param {number} col meeting column spaces
   * @param {number} row meeting rows spaces
   */
  async createOneEvent( title: string , day: string , hour: string , col: number , row: number ){
    const newEvent= new Event({ title , day , hour , col , row });
    await newEvent.save();
  };

  /**
   * Edit a meeting using meeting ID
   * @param {string} id meeeting identificator
   * @param {string} title meeting name title
   * @param {string} day meeting target day
   * @param {string} hour meeting target hour
   * @param {number} col meeting column spaces
   * @param {number} row meeting rows spaces
   */
  async editOneEvent(id: string, title: string , day: string , hour: string , col: number , row: number){
    await Event.findByIdAndUpdate( id , { title , day , hour , col , row } );
  };

  /**
   * Delete a meeting using meeting ID
   * @param {string} id meeeting identificator
   */
  async deleteOneEvent(id: string){
    await Event.findByIdAndDelete(id);
  };

};

export { EventStore };