const { Event, Client }= require('../../model/main');

/** 
 * CRUD operation to change values into client and meeting collection
 * @memberof service/reserv
 **/
class ResStore{
  /** constructor not used */
  constructor(){};

  /**
   * Create a reservation editing list array into one meeting using meeting ID
   * @param {string} eventID Meeting identificator
   * @param {Array<number>} sites Group chair required
   * @param {string} userID USer that request reservation
   */
  async createReservations( eventID: string , sites: number[] , userID: string ){
    const { list }= await Event.findById( eventID ).select('list');
    sites.forEach( site => list.push([ Number(site) , userID]) );
    await Event.findByIdAndUpdate( eventID , { list } );
  };

  /**
   * Modify user history editing history array using user ID
   * @param {string} userID User identificator
   * @param {string} eventID Meeting identificator
   * @param {Array<number>} sites Group chair required
   */
  async saveClientHistory( userID: string, eventID: string, sites: number[] ){
    const { history }= await Client.findById( userID ).select('history');
    history.push([ sites , eventID]);  //sites.forEach( site => history.push([ Number(site) , eventID]) );
    await Client.findByIdAndUpdate( userID , { history } );
  };

  async getOneEvent( eventID: string ){
    return await Event.findById( eventID ).select('list hour day title');
  };

  async getOneUser( userID: string ){
    return await Client.findById( userID ).select('fullname');
  };

};

export { ResStore };