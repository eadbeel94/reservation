import './style.css';

const { fetchSend, modalShow }= require('../../js/helper.js');
const d= document;

const main= () =>{
  const $frm_user= d.querySelector('#sec_body23 form');

  $frm_user.onsubmit= async (ev)=>{
    ev.preventDefault();

    const send= {
      fullname: ev.target[0].value,
      email:    ev.target[1].value,
      username: ev.target[2].value,
      password: ev.target[3].value,
      confirm:  ev.target[4].value,
    };

    const { stat, mess }= await fetchSend('/client/addOne', "POST", send);
    modalShow("modals", "tmp_modal", mess, 1);

    stat && $frm_user.reset();
    if(!stat){
      ev.target[3].value= "";
      ev.target[4].value= "";
    }
  };
};

main();