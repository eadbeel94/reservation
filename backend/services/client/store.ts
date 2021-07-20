import { Types } from 'mongoose';
import { Client , Event } from '../../model/main';

/** 
 * CRUD operation to change values into user collection
 **/
class CliStore{
  /** constructor not used */
  constructor(){};

  /**
   * Save new user
   * @param {string} fullname all name user
   * @param {string} email contact user information
   * @param {string} username account name
   * @param {string} password credential encrypted information
   * @param {number} date server time when user was created
   */
  async createUser( fullname: string, email: string, username: string, password: string, date: number ) {
    const newUser= new Client({fullname, email, username, password, date});
    await newUser.save();
  };

  /**
   * Get One Client using a client id
   * @param {string} id Client identificator 
   * @returns {object} if exist get Client
   */ 
  async getOneClient(id: string, [...params]){
    return await Client.findById(id).select(...params);
  };

  /**
   * Get Events using severa event identificators
   * @param {Array<string>} ids Array event ids
   * @returns {object} if exist get Events
   */ 
  async getSomeEvents( ids: string[] ){
    const eids= ids.map( ( eid ) => Types.ObjectId(eid) );
    return await Event.find({ '_id': { $in: eids } }).select('-list -row -col');
  };

};

export { CliStore };