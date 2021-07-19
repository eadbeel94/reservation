import './style.css';

const {
  modalEventShow,
  getError,
  modalShow,
  fetchSend 
}= require('../../js/helper.js');

const d= document;

const genCards= ( spaceID="" , templateID="" , list=[] )=>{

  const $space= d.querySelector(spaceID);
  const $fragment= d.createDocumentFragment();
  const $template= d.getElementById(templateID).content;

  list.forEach( el =>{
    $template.querySelector('blockquote').dataset.id= el._id;

    $template.querySelector('.card-header input').value= el.title;
    $template.querySelector('.card-body div:nth-child(1) input').value= el.day;
    $template.querySelector('.card-body div:nth-child(3) input').value= el.hour;
    $template.querySelector('.card-body div:nth-child(2) input').value= el.row;
    $template.querySelector('.card-body div:nth-child(4) input').value= el.col;

    $template.querySelector('.btn:nth-child(1)').dataset.id= el._id;
    $template.querySelector('.btn:nth-child(1) i').dataset.id= el._id;
    $template.querySelector('.btn:nth-child(2)').dataset.id= el._id;
    $template.querySelector('.btn:nth-child(2) i').dataset.id= el._id;

    $fragment.appendChild( d.importNode( $template , true ) );
  });
  $space.appendChild($fragment);
};

const watchCards= ( spaceID="" )=>{ 

  const $space= d.querySelector(spaceID);
  $space.onclick= async({ target }) =>{
    if( target.matches('[data-id]') ){
      try {
        if( target.matches('[data-type=edit]') ){
          const $inputs= $space.querySelectorAll(`blockquote[data-id='${target.dataset.id}'] input`);
          
          const config= { 
            title: $inputs[0].value,
            day: $inputs[1].value,
            hour: $inputs[3].value,
            col: $inputs[2].value,
            row: $inputs[4].value,
          };

          modalEventShow("modals", "tmp_modal2", config, 2, async() =>{
            const { stat }= await fetchSend(`/meeting/editOne/${target.dataset.id}`,"PUT",config);
            stat && setTimeout(() => location.reload(), 1000);
          });
        };
        if( target.matches('[data-type=del]') ){
          modalShow("modals", "tmp_modal", "Do you wanna delete this event?", 2, async() =>{
            $space.querySelector(`blockquote[data-id='${target.dataset.id}']`).innerHTML= "";
            const { stat }= await fetchSend(`/meeting/delOne/${target.dataset.id}`,"DELETE");
            stat && setTimeout(() => location.reload(), 1000);
          });
        };
      } catch (err) { modalShow( "modals" , "tmp_modal" , getError(err) ); console.log( 200 , err ) };
    };
  };
};

const watchFormEvent= ( spaceID="" )=>{

  const $frm_event= d.getElementById(spaceID);

  $frm_event.onsubmit= (ev) =>{
    ev.preventDefault();
  
    const config= {
      title: ev.target[0].value,
      day: ev.target[1].value,
      hour: ev.target[2].value,
      row: ev.target[3].value,
      col: ev.target[4].value,
    };
  
    modalEventShow("modals","tmp_modal2",config,2, async()=>{
      const { stat, mess }= await fetchSend("/meeting/addOne","POST",config);
      
      modalShow('modals','tmp_modal', mess, 1);
      stat && setTimeout(() => location.reload(), 1000);
    });
  };

};

const main= async() =>{
  const { data }= await fetchSend("/meeting/getAll");

  genCards('#sec_body12 .row','tmp_card',data);
  watchCards('#sec_body12 .row');
  watchFormEvent('frm_event');
};

main();