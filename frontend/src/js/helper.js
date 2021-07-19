/** @namespace 00-helper */

/** 
 * The object document in an single variable
 * @constant {Object} d
 * @memberof 00-helper 
 */
const d= document;

/** 
 * Check if project are in development or production mode
 * @constant {Booleann} prod 
 * @memberof 00-helper 
 */
const prod= process.env.NODE_ENV !== 'development';

/** 
 * Set main URL all fetch
 * @constant {String} IP 
 * @memberof 00-helper 
 */
//const IP= !prod ? "http://localhost:5000" : "" + "/api/shop";  //const IP= "http://localhost:5001/driveshop5/us-central1/shop";
const IP= (!prod ? "http://localhost:3000" : "") + "/api";

/** 
 * Call Modal and Tooltip class from boostrap 
 * @const {Class} Modal
 * @const {Class} Tooltip
 * @memberof 00-helper 
 */
const { Modal }= require('bootstrap/dist/js/bootstrap.bundle');

/* ------------------------------------------------------------------------------------------------------------------------ */
/** @namespace 00-helper/getError  */

/**
 * Create a text message using error object
 * @function getError
 * @memberof 00-helper
 * @param {Error} error value give for trycatch
 * @returns {String} show message in text format
 */
const getError= ( error ) => {
  /**
   * String that storage error message
   * @var {String} message
   * @memberof 00-helper/getError
   */
  let message= "";
  if( typeof error === 'object' && error !== null ){
    message+= error.hasOwnProperty('message') ? error.message : JSON.stringify( error );
  }else 
    message+= String(error);

  message= message.replace('Error: ','-> ');
  return message;
};

/* ------------------------------------------------------------------------------------------------------------------------ */

/**
 * Send information to server using fetch fcn 
 * @function fetchSend
 * @param {string} url endopoint server where send query
 * @param {string} type "GET", "POST" , "PUT" OR "DELETE"
 * @param {object} send group information send to server
 * @memberof view/helper
 * @returns {Promise<{ stat: boolean, data: any, mess: string, noauth: boolean }>} give status, data, a messsage and status auth
 */
const fetchSend= async( url="" , type="" , send )=>{
  //const IP= process.env.NODE_ENV !== 'production' ? `http://localhost:3001/api` : `/api`

  /** 
   * End state after process endopoint response
   * @type {boolean}
   * @memberof front/helper
   */
  let stat= false;
  /** 
   * If user not logged succesfully, this value will be false
   * @type {boolean}
   * @memberof front/helper
   */
  let noauth;
  /** 
   * Group information got from server
   * @type {object}
   * @memberof front/helper
   */
  let data= {};
  /** 
   * status detail message
   * @type {string}
   * @memberof front/helper
   */
  let mess= "";
  try {
    /** 
     * fetch configuration object
     * @const {string} config
     * @memberof front/helper
     */
    const config= { method: type || "GET" };
    config.headers= { 'X-Requested-With': 'XMLHttpRequest' };
    send && ( config.body= JSON.stringify(send) );
    send && ( config.headers= { ...config.headers, 'Content-Type': 'application/json' }  );
    
    const res= await fetch( `${IP}${url}`, config );
    const json= await res.json();

    if( res.status === 511 ){ 
      noauth= true;
      throw { status: res.status ,  message: `${ json.stack ? json.stack.split('\n')[0] : json.error }`  } 
    };

    if( !res.ok ) throw { status: res.status ,  message: `${ json.stack ? json.stack.split('\n')[0] : json.error }`  };

    data= json.data;
    mess= json.mess;
    stat= true;
  } catch (err) { 
    stat= false;
    mess= getError(err);
  };
  return { stat , data , mess , noauth };
};

/* ------------------------------------------------------------------------------------------------------------------------ */
/** @namespace 00-helper/modalShow  */

/**
 * Create a Html Bootstrap-Modal and show in screen
 * @function modalShow
 * @memberof 00-helper 
 * @param {String} spaceID tag's query selector where filled with this Modal
 * @param {String} templateID tag id where get HTML Modal body
 * @param {String} body modal body with HTML tags and text
 * @param {Number} btns how many buttons will be into modal
 * @param {Function} cb Callback function that execute when user press confirm button
 * @returns {{modalHide: Function}} return hide method into object modalHide
 */
const modalShow= ( spaceID="" , templateID="" , body="" , btns=1 , cb ) =>{ 
  
  /**
   * DOM EL where fill all HTML data
   * @const {HTMLElement} $sec
   * @memberof 00-helper/modalShow 
   */
  const $sec= d.getElementById(spaceID);
  /**
   * DOM EL that process all HTML data in memory
   * @const {DocumentFragment} $fragment
   * @memberof 00-helper/modalShow 
   */
  const $fragment= d.createDocumentFragment();
  /**
   * DOM EL template where get all HTML data
   * @const {HTMLElement} $template
   * @memberof 00-helper/modalShow 
   */
  const $template= d.getElementById(templateID).content;

  $template.querySelector('.modal-body').innerHTML= body;
  $template.querySelector( '.oneb' ).classList.add('d-none');
  $template.querySelector( '.twob' ).classList.add('d-none');
  $template.querySelector( btns == 2 ? '.twob' : '.oneb' ).classList.remove('d-none');

  $fragment.appendChild( d.importNode( $template , true ) );
  $sec.innerHTML= "";
  d.querySelectorAll('.modal-backdrop').forEach( el => el.outerHTML= "" );
  $sec.appendChild($fragment);
  /**
   * Object that include method show and hide modal
   * @const {Object} modal
   * @memberof 00-helper/modalShow 
   */
  const modal= new Modal(`#${spaceID} .modal`);
  modal.show();

  if(btns == 2){
    /**
     * If user press confirm button then exeute "cb" and modal will hide
     * @callback $btn_confirm-onclick 
     * @memberof 00-helper/modalShow 
     */
    $sec.querySelector('.btn-success').onclick= ()=>{
      cb(); modal.hide();
    };
  }
  return { modalHide: ()=>modal.hide() };
};

/* ------------------------------------------------------------------------------------------------------------------------ */
/** @namespace 00-helper/spinnerShow  */

/**
 * Create a Html Bootstrap-Modal with spinner figure and show in screen
 * @function spinnerShow
 * @memberof 00-helper 
 * @param {Object} classModal Bootstrap Modal class
 * @param {String} spaceID tag's query selector where filled with this Modal
 * @param {String} templateID tag id where get HTML Modal body
 * @returns {{modalHide: Function}} return hide method into object modalHide
 */
const spinnerShow= ( classModal , spaceID="" , templateID="" ) => {

  /**
   * DOM EL where fill all HTML data
   * @const {HTMLElement} $sec
   * @memberof 00-helper/spinnerShow
   */
   const $sec= d.getElementById(spaceID);
   /**
    * DOM EL that process all HTML data in memory
    * @const {DocumentFragment} $fragment
    * @memberof 00-helper/spinnerShow
    */
   const $fragment= d.createDocumentFragment();
   /**
    * DOM EL template where get all HTML data
    * @const {HTMLElement} $template
    * @memberof 00-helper/spinnerShow
    */
   const $template= d.getElementById(templateID).content;

  $fragment.appendChild( d.importNode( $template , true ) );
  $sec.appendChild($fragment);

  /**
   * Object that include method show and hide modal
   * @const {Object} modal
   * @memberof 00-helper/spinnerShow
   */
  const modal= new classModal(`#${spaceID} .modal`);
  modal.show();
  return { modalHide: ()=>modal.hide() };
};

/* ------------------------------------------------------------------------------------------------------------------------ */

const modalEventShow= ( spaceID="" , templateID="" , config={} , btns=1 , cb ) =>{ 
  
  /**
   * DOM EL where fill all HTML data
   * @const {HTMLElement} $sec
   * @memberof 00-helper/modalShow 
   */
  const $sec= d.getElementById(spaceID);
  /**
   * DOM EL that process all HTML data in memory
   * @const {DocumentFragment} $fragment
   * @memberof 00-helper/modalShow 
   */
  const $fragment= d.createDocumentFragment();
  /**
   * DOM EL template where get all HTML data
   * @const {HTMLElement} $template
   * @memberof 00-helper/modalShow 
   */
  const $template= d.getElementById(templateID).content;

  $template.querySelector('.modal-body .row div:nth-child(2) strong').textContent= config.title;
  $template.querySelector('.modal-body .row div:nth-child(3) strong').textContent= config.day;
  $template.querySelector('.modal-body .row div:nth-child(4) strong').textContent= config.hour;
  $template.querySelector('.modal-body blockquote').innerHTML= "";

  const $table= d.createElement('div');
  for (let i = 0; i < config.col; i++) {
    const $row= d.createElement('div');
    $row.classList.add('d-flex');

    for (let j = 0; j < config.row; j++) {
      const $i= d.createElement('i');
      $i.classList.add('bi','bi-archive');
      $row.appendChild($i);
    }
    $table.appendChild($row);
  };

  $template.querySelector('.modal-body blockquote').appendChild($table);
  $template.querySelector( btns == 2 ? '.twob' : '.oneb' ).classList.remove('d-none');

  $fragment.appendChild( d.importNode( $template , true ) );
  $sec.innerHTML= "";
  d.querySelectorAll('.modal-backdrop').forEach( el => el.outerHTML= "" );
  $sec.appendChild($fragment);
  /**
   * Object that include method show and hide modal
   * @const {Object} modal
   * @memberof 00-helper/modalShow 
   */
  const modal= new Modal(`#${spaceID} .modal`);
  modal.show();

  if(btns == 2){
    /**
     * If user press confirm button then exeute "cb" and modal will hide
     * @callback $btn_confirm-onclick 
     * @memberof 00-helper/modalShow 
     */
    $sec.querySelector('.btn-success').onclick= ()=>{
      cb(); modal.hide();
    };
  }
  return { modalHide: ()=>modal.hide() };
};

/* ------------------------------------------------------------------------------------------------------------------------ */

const qrBodyOps= ( w=100, h=100, data="" )=>{
  return {
    "width": w,
    "height": h,
    "data": data,
    "margin": 5,
    "qrOptions": {
      "typeNumber": "0",
      "mode": "Byte",
      "errorCorrectionLevel": "Q"
    },
    "imageOptions": {
      "hideBackgroundDots": true,
      "imageSize": 0.4,
      "margin": 0
    },
    "dotsOptions": {
      "type": "classy",
      "color": "#000000"
    },
    "backgroundOptions": {
      "color": "#ffffff"
    },
    //"image": "/img/logo.png",
    "dotsOptionsHelper": {
      "colorType": {
        "single": true,
        "gradient": false
      },
      "gradient": {
        "linear": true,
        "radial": false,
        "color1": "#6a1a4c",
        "color2": "#6a1a4c",
        "rotation": "0"
      }
    },
    "cornersSquareOptions": {
      "type": "square",
      "color": "#000000"
    },
    "cornersSquareOptionsHelper": {
      "colorType": {
        "single": true,
        "gradient": false
      },
      "gradient": {
        "linear": true,
        "radial": false,
        "color1": "#000000",
        "color2": "#000000",
        "rotation": "0"
      }
    },
    "cornersDotOptions": {
      "type": "",
      "color": "#000000"
    },
    "cornersDotOptionsHelper": {
      "colorType": {
        "single": true,
        "gradient": false
      },
      "gradient": {
        "linear": true,
        "radial": false,
        "color1": "#000000",
        "color2": "#000000",
        "rotation": "0"
      }
    },
    "backgroundOptionsHelper": {
      "colorType": {
        "single": true,
        "gradient": false
      },
      "gradient": {
        "linear": true,
        "radial": false,
        "color1": "#ffffff",
        "color2": "#ffffff",
        "rotation": "0"
      }
    }
  }
};

/* ------------------------------------------------------------------------------------------------------------------------ */

const btnsCss= [
  [
    'btn-primary',
    'btn-secondary',
    'btn-success',
    'btn-info',
    'btn-warning',
    'btn-danger',
    'btn-light',
    'btn-dark',
    'btn-outline-primary',
    'btn-outline-secondary',
    'btn-outline-success',
    'btn-outline-info',
    'btn-outline-warning',
    'btn-outline-danger',
    'btn-outline-light',
    'btn-outline-dark',
  ],[
    'btn-primary',
    'btn-secondary',
    'btn-success',
    'btn-info',
    'btn-warning',
    'btn-danger',
    'btn-light',
    'btn-dark'
  ],[
    'btn-outline-primary',
    'btn-outline-secondary',
    'btn-outline-success',
    'btn-outline-info',
    'btn-outline-warning',
    'btn-outline-danger',
    'btn-outline-light',
    'btn-outline-dark'
  ]
];

module.exports= { modalShow, spinnerShow, getError, fetchSend , modalEventShow , qrBodyOps , btnsCss };