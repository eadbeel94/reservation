
const { fetchSend }= require('../../js/helper.js');

const d= document;

const genBtnEvents= async( spaceID= "" , list= [] ) =>{
  const $sec_body= d.querySelector(spaceID);

  list.forEach( group => {
    const $button= d.createElement('button');
    $button.classList.add('btn','btn-primary','btn-lg','fs-4');
    $button.textContent= `${ group.title } ( ${ group.day } - ${ group.hour } )`;
    $button.onclick= ()=> window.open(`/event?eid=${ group._id }`,'_self');
    $sec_body.appendChild($button);
  });
};

const main= async () =>{
  const { data }= await fetchSend("/reservation/getAll");
  genBtnEvents('#sec_body22 blockquote' , data);
};

main();