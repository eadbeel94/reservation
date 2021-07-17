const { Client }= require('../../model/main');

/** 
 * CRUD operation to change values into user collection
 * @memberof service/user
 **/
class CliStore{
  /** constructor not used */
  constructor(){};

  async createUser( fullname: string, email: string, username: string, password: string, date: number ) {
    const newUser= new Client({fullname, email, username, password, date});
    await newUser.save();
  }

};

export { CliStore };