const { Client }= require('../../model/main');

/** 
 * CRUD operation to change values into user collection
 * @memberof service/user
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
  }

};

export { CliStore };