const { Event, Client }= require('../../model/main');

/** 
 * CRUD operation to change values into user collection
 * @memberof service/user
 **/
class ResStore{
  /** constructor not used */
  constructor(){};

  async createReservations( eventID: string , sites: number[] , userID: string ){
    const { list }= await Event.findById( eventID ).select('list');
    sites.forEach( site => list.push([ Number(site) , userID]) );
    await Event.findByIdAndUpdate( eventID , { list } );
  }

  async saveClientHistory( userID: string, eventID: string, sites: number[] ){
    const { history }= await Client.findById( userID ).select('history');
    sites.forEach( site => history.push([ Number(site) , eventID]) );
    await Client.findByIdAndUpdate( userID , { history } );
  }

};

export { ResStore };