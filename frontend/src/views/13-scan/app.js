import './style.css';
import jsQR from "jsqr";
import m from 'dayjs';
m.extend( require('dayjs/plugin/localizedFormat') );

const { fetchSend }= require('../../js/helper');

const d= document;
const video = document.createElement("video");
const canvasElement = document.getElementById("qr-canvas");
const canvas = canvasElement.getContext("2d");
const $btn_scan= d.getElementById('btn-scan-qr');
let scanning = false;

const fillCard= ( spaceID="", info={} )=>{
  const $space= d.querySelector(spaceID);

  const $strongs= $space.querySelectorAll('strong');
  $strongs[0].textContent= info.title;
  $strongs[1].textContent= info.fullname;
  $strongs[2].textContent= m( info.day ).format('LL');
  $strongs[3].textContent= m(`${info.day}T${info.hour}`).format('LT');
  $strongs[4].textContent= info.places.toString();
};

const drawLine= (begin, end, color) => {
  canvas.beginPath();
  canvas.moveTo(begin.x, begin.y);
  canvas.lineTo(end.x, end.y);
  canvas.lineWidth = 4;
  canvas.strokeStyle = color;
  canvas.stroke();
};

async function tick() {
  if (video.readyState === video.HAVE_ENOUGH_DATA) {
    canvasElement.hidden = false;
    canvasElement.height = video.videoHeight;
    canvasElement.width = video.videoWidth;
    canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);

    const imageData= canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
    const code= jsQR(imageData.data, imageData.width, imageData.height, { inversionAttempts: "dontInvert" });
    if (code) {
      drawLine( code.location.topLeftCorner,     code.location.topRightCorner,    "#FF3B58");
      drawLine( code.location.topRightCorner,    code.location.bottomRightCorner, "#FF3B58");
      drawLine( code.location.bottomRightCorner, code.location.bottomLeftCorner,  "#FF3B58");
      drawLine( code.location.bottomLeftCorner,  code.location.topLeftCorner,     "#FF3B58");
    
      const { data }= await fetchSend(`/reservation/getOne`, 'POST', JSON.parse( code.data ) );
      fillCard( "#sec_body13 blockquote" , data );

      scanning= false;
    } else {

    }
  }
  scanning && requestAnimationFrame(tick);
};

const main= async ()=>{
  // Use facingMode: environment to attemt to get the front camera on phones
  $btn_scan.onclick = () => {
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "environment" } })
      .then( stream => {
        video.srcObject = stream;
        video.setAttribute("playsinline", true);
        video.play();
        requestAnimationFrame(tick);

        scanning = true;
      }).catch( err => console.log( 30, err ) );
  };
};

main();