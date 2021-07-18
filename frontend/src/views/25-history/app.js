import './style.css';

const { fetchSend }= require('../../js/helper');

const d= document;

const genCards= ( spaceID= "" , templateID="", list=[] ) =>{

  const $space= d.querySelector(spaceID);
  const $fragment= d.createDocumentFragment();
  const $template= d.getElementById(templateID).content;

  list.forEach( el =>{
    $fragment.appendChild( d.importNode( $template , true ) );
  });
  $space.appendChild($fragment);
};

const main= () =>{
  //const { data }= await fetchSend(`/client/getAll`);
  //genCards("#sec_body25 > div","tmp_card", data );
};

main();