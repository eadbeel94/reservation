
const { modalEventShow }= require('../../js/helper.js');


const d= document;
const $frm_event= d.getElementById('frm_event');


$frm_event.onsubmit= (ev) =>{
  ev.preventDefault();

  const config= {
    title: ev.target[0].value,
    day: ev.target[1].value,
    hour: ev.target[2].value,
    row: ev.target[3].value,
    col: ev.target[4].value,
  };

  modalEventShow("modals","tmp_modal",config,2,()=>{

  });
}