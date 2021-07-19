import './style.css';
import QRCodeStyling from 'qr-code-styling';
import m from 'dayjs';
m.extend( require('dayjs/plugin/localizedFormat') );

const { fetchSend , qrBodyOps }= require('../../js/helper');

const d= document;

const genCards= ( spaceID= "" , templateID="", list=[] ) =>{

  const $space= d.querySelector(spaceID);
  const $fragment= d.createDocumentFragment();
  const $template= d.getElementById(templateID).content;

  list.forEach( ([ sites, , meeting ], ind) =>{
    $template.querySelector('.card-header strong').textContent= meeting.title;
    $template.querySelector('.card-body p:nth-child(1) strong').textContent= m( meeting.day ).format('LL');
    $template.querySelector('.card-body p:nth-child(2) strong').textContent= m(`${meeting.day}T${meeting.hour}`).format('LT');
    $template.querySelector('.card-body p:nth-child(3) strong').textContent= sites.toString();
    $template.querySelector('.qr-space').dataset.order= ind;

    $fragment.appendChild( d.importNode( $template , true ) );
  });
  $space.appendChild($fragment);

  list.forEach( ([sites,eid], ind) =>{
    const $qrSpace= $space.querySelector(`.qr-space[data-order='${ind}']`);
    const qrCode = new QRCodeStyling( qrBodyOps( 150, 150 , JSON.stringify({ eid, sites }) ) );
    qrCode.append( $qrSpace );
  });

  if( 0 >= list.length ){
    const text= `<span class="fs-3 text-center">YOU HAVE NO RESERVATIONS YET</span><p class="not-servation"><i class="bi bi-emoji-frown-fill"></i></p>`;
    $space.innerHTML= text;
  }
};

const main= async () =>{
  const { data }= await fetchSend(`/client/getOne`);
  const { history, events }= data;
  
  const list= history.map( ([sites,eid]) => {
    return [
      sites,
      eid,
      events[eid]
    ]
  });

  genCards("#sec_body25 > div","tmp_card", list );
};

main();