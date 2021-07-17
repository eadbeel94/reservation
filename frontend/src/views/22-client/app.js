import './style.css';

const { fetchSend, modalShow }= require('../../js/helper.js');
const d= document;

const main= async () =>{
  const $form= d.querySelector('#sec_body22 form');
  $form.onsubmit= async ev =>{
    ev.preventDefault();

    const send= {
      username: ev.target[0].value,
      password: ev.target[1].value,
    };
    const { mess, stat }= await fetchSend('/client/auth', 'POST', send);
    modalShow("modals", "tmp_modal", mess , 1);
    stat && setTimeout(() => window.open('/views/meeting','_self'), 1000);
  };
};

main();