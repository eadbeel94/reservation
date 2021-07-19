import './style.css';
import Swiper from 'swiper';
import SwiperCore, { Navigation, Pagination } from 'swiper/core';
import QRCodeStyling from 'qr-code-styling';
import m from 'dayjs';
m.extend( require('dayjs/plugin/localizedFormat') );

/*---------------------------------- Config ----------------------------------*/

const { fetchSend , modalShow , qrBodyOps, btnsCss }= require('../../js/helper.js');

const d= document;
let swiper;
let config= { eid: "" , sites: [] };

const initSwiper= () =>{
  SwiperCore.use([Navigation, Pagination]);
  swiper = new Swiper('.swiper-container', {
    allowTouchMove: false
  });
};

/*---------------------------------- page D ----------------------------------*/

const generateQR= ( spaceID= "" , data )=>{
  const $space= d.querySelector(spaceID);
  const qrCode = new QRCodeStyling( qrBodyOps( 200, 200 , JSON.stringify( data )) );
  qrCode.append( $space );
};

const pageD= () =>{
  generateQR('.pageD .finally', config)
  //const $btn_prev= d.querySelector('.pageD .btn-outline-secondary');
  //$btn_prev.onclick= () => swiper.slidePrev();
};

/*---------------------------------- page C ----------------------------------*/

const fillList= ( spaceID= "" , list= [] ) =>{
  //<li class="list-group-item fs-2">An item</li>
  const $space= d.querySelector(spaceID);
  $space.innerHTML= "";

  list.forEach( el => {
    const $li= d.createElement('li');
    $li.classList.add('list-group-item','fs-2');
    $li.textContent= el;

    $space.appendChild($li);
  });
};

const pageC= async() =>{
  fillList( ".pageC .resume ul" , config.sites );

  const $btn_prev= d.querySelector('.pageC button.btn-outline-secondary');
  $btn_prev.onclick= () => swiper.slidePrev();

  const $btn_finally= d.querySelector('.pageC button.btn-success');
  $btn_finally.onclick= () => {
    modalShow("modals", "tmp_modal", "Are you sure generate these reservations?", 2, async() =>{
      const { stat, mess }= await fetchSend('/reservation/addSome', 'PUT', config);
      if(stat){
        pageD();
        swiper.slideNext();
      }else{
        setTimeout(() => modalShow( "modals", "tmp_modal", mess, 1 ), 500);
      }
    });
  };
};

/*---------------------------------- page B ----------------------------------*/

const fillSites= ( spaceID= "" , row , col ) =>{
  const $space= d.querySelector( spaceID );
  $space.innerHTML= "";

  for (let i = 0; i < row; i++) {
    const $row= d.createElement('section');

    for (let j = 0; j < col; j++) {
      const $button= d.createElement('button');
      const $span= d.createElement('span');
      const $i= d.createElement('i');

      const number= ( i*col ) + ( j+1 );

      $button.classList.add('btn','btn-outline-dark');
      $button.dataset.id= number;
      $span.textContent= number;
      $span.dataset.id= number;
      $i.dataset.id= number;
      $i.classList.add('bi','bi-archive');

      $button.appendChild($span);
      $button.appendChild($i);
      $row.appendChild($button);
    }
    $space.appendChild($row);
  };
};

const fillDenied= ( spaceID= "" , list= [] ) =>{
  list.forEach( ([site]) => {
    const $button= d.querySelector(`${ spaceID } button[data-id='${site}']`).classList;
    $button.remove('btn-outline-dark');
    $button.add('btn-danger');
  })
}

const watchSites= ( spaceID= "" ) =>{
  const $space= d.querySelector( spaceID );

  $space.onclick= ({target})=>{
    if( target.matches('button') || target.matches('button *') ){
      const $button= $space.querySelector(`button[data-id='${ target.dataset.id }']`);
      if( $button.className.indexOf('btn-outline-dark') > -1 ){
        $button.classList.remove('btn-outline-dark');
        $button.classList.add('btn-success');
      }else if( $button.className.indexOf('btn-success') > -1 ){
        $button.classList.add('btn-outline-dark');
        $button.classList.remove('btn-success');
      }

      config.sites= [];
      $space.querySelectorAll('.btn-success').forEach( el => config.sites.push(el.dataset.id) )
    }
  }
};

const pageB= async( eventID= "" ) =>{
  const { data }= await fetchSend(`/meeting/getOne/${ eventID }`);
  fillSites('.pageB .sites',data.row,data.col);
  fillDenied('.pageB .sites', data.list);
  watchSites('.pageB .sites');

  const $btn_prev= d.querySelector('.pageB button.btn-outline-secondary');
  $btn_prev.onclick= () => swiper.slidePrev();

  const $btn_next= d.querySelector('.pageB button.btn-outline-primary');
  $btn_next.onclick= () => {
    config.sites.length > 0 && swiper.slideNext();
    config.sites.length > 0 && pageC();
  };
};

/*---------------------------------- page A ----------------------------------*/

const genBtnEvents= async( spaceID= "" , list= [] ) =>{
  const $sec_body= d.querySelector(spaceID);

  let buttons= 0;
  list.forEach( ({ _id, title, day, hour }, ind) => {
    const active= m().isBefore(`${day}T${hour}`);
    if( active ){
      const $button= d.createElement('button');
      const time= m(`${day}T${hour}`).format('lll');
      $button.classList.add('btn',btnsCss[0][ind],'btn-lg','fs-4');
      $button.innerHTML= `<p>${ title }</p> <p>${ time } </p>`;
      $button.onclick= async ()=> { 
        config.sites= [];
        config.eid= _id;
        await pageB( _id );
        swiper.slideNext() 
      };
      buttons++;
      $sec_body.appendChild($button);
    };
  });
  if(buttons > 0){
    $sec_body.querySelector('div').textContent= 'CHOOSE YOUR MEETING';
  }else{
    $sec_body.querySelector('div').textContent= 'NOT MEETING YET';
    const $i= d.createElement('i');
    $i.classList.add('bi','bi-emoji-frown');
    $sec_body.appendChild($i)
  }
};

const pageA= async() =>{
  const { data }= await fetchSend("/meeting/getAll");
  genBtnEvents('.pageA section' , data);
};

/*---------------------------------- Main ----------------------------------*/

const main= async () =>{
  await initSwiper();
  await pageA();
};

main();