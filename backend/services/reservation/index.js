/** @namespace service/user */

const { ResStore }= require('./store.js');

/**
 * Call methods to modify values into collection user
 * @const {class} ResStore
 * @memberof service/user
 */
const store= new ResStore();

module.exports= {

  getAllElements: async() =>{
    return await store.getAllEvents();
  },

  getOneElement: async(id) =>{
    return await store.getOneEvent(id);
  },

  /**
   * Check if password is correct, then encrypt password and save into database
   * @function addOneElement
   * @memberof service/user
   * @param {object} cont include all user data information
   */
  createElement: async(...arg) =>{
    await store.createOneEvent(...arg);
  },

  editElement: async(...arg) =>{
    await store.editOneEvent(...arg);
  },

  delElement: async(id) =>{
    await store.deleteOneEvent(id);
  },

};