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
const IP= 'http://localhost:3003/api';

/** 
 * Call Modal and Tooltip class from boostrap 
 * @const {Class} Modal
 * @const {Class} Tooltip
 * @memberof 00-helper 
 */
const { Modal, Tooltip }= require('bootstrap/dist/js/bootstrap.bundle');

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
 * @returns {Promise<{ stat: boolean, data: any, message: string, noauth: boolean }>} give status, data, a messsage and status auth
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
    console.log('fetchSend ->',`${IP}${url}`)
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
/** @namespace 00-helper/fillNavbar  */

/**
 * Process fill navbar values as all words for autocomplete's search values, client information login
 * @function fillNavbar
 * @memberof 00-helper
 * @param {Object} userInfo Firebase object user information like uid and displayName
 * @param {String} inpSearchID tag id for searcher and use autocomplete values
 * @param {String} btnSearchID tag id for search button
 * @param {String} btnWishID tag id for wish button
 * @param {String} btnCartID tag id for cart button
 * @param {String} btnLoginID tag id for login button
 * @param {String} btnLogoutID tag id for logout button
 * @param {String} lblAccountID tag id for label's user account name
 * @param {String} lblWishID tag id for label counter list wish
 * @param {String} lblCartID tag id for label counter list cart
 * @returns null
 */
const fillNavbar= async (
  userInfo,
  inpSearchID,
  btnSearchID,
  btnWishID,
  btnCartID,
  btnLoginID,
  btnLogoutID,
  lblAccountID,
  lblWishID,
  lblCartID
)=>{
  /**
   * DOM EL search input text
   * @const {HTMLElement} $inp_search
   * @memberof 00-helper/fillNavbar
   */
  const $inp_search= d.getElementById(inpSearchID);
  /**
   * DOM EL Button search
   * @const {HTMLElement} $inp_search
   * @memberof 00-helper/fillNavbar
   */
  const $btn_search= d.getElementById(btnSearchID);
  /**
   * DOM EL Button search
   * @const {HTMLElement} $inp_search
   * @memberof 00-helper/fillNavbar
   */
  const $btn_wish= d.getElementById(btnWishID);
  /**
   * DOM EL Button search
   * @const {HTMLElement} $inp_search
   * @memberof 00-helper/fillNavbar
   */
  const $btn_cart= d.getElementById(btnCartID);
  /**
   * DOM EL Button search
   * @const {HTMLElement} $inp_search
   * @memberof 00-helper/fillNavbar
   */
  const $btn_login= d.getElementById(btnLoginID);
  /**
   * DOM EL Button search
   * @const {HTMLElement} $inp_search
   * @memberof 00-helper/fillNavbar
   */
  const $btn_logout= d.getElementById(btnLogoutID);
  /**
   * DOM EL label that show user name
   * @const {HTMLElement} $inp_search
   * @memberof 00-helper/fillNavbar
   */
  const $lbl_account = d.getElementById(lblAccountID); 
    /**
   * DOM EL label that show counter wish list
   * @const {HTMLElement} $lbl_wish
   * @memberof 00-helper/fillNavbar
   */
  const $lbl_wish= d.getElementById(lblWishID);
      /**
   * DOM EL label that show counter cart list
   * @const {HTMLElement} $lbl_wish
   * @memberof 00-helper/fillNavbar
   */
  const $lbl_cart= d.getElementById(lblCartID);

  $btn_login.disabled = userInfo;
  $btn_logout.disabled = !userInfo; 
  $lbl_account.textContent= "Cuenta";
  $lbl_wish.textContent= 0;
  $lbl_cart.textContent= 0;

  ([].slice.call(d.querySelectorAll('[data-bs-toggle="tooltip"]'))).map( el => new Tooltip(el) );

  if( userInfo ){
    $lbl_account.textContent= (userInfo.displayName.split(" "))[0];
    $btn_login.disabled= true;
    $btn_logout.disabled= false;
    try {

      const { stat, mess, data }= await fetchSend(`/cart/get-cli-counters?id=${ userInfo.uid }&accepted=${ localStorage.getItem('accepted') }`);
      if( !stat ) throw new Error(mess);

      /**
       * @const {Number} cart quantity product into user cart list
       * @const {Number} wish quantity product into user wish list
       * @memberof 00-helper/fillNavbar
       */
      const { cart , wish }= data;
      
      $lbl_wish.textContent= wish;
      $lbl_cart.textContent= cart;
    } catch (err) { modalShow( "modals" , "tmp_modal" , getError(err) ); console.log( 100 , err ) };
    /**
     * If user press wish button then redirect wish page
     * @callback $btn_wish-onclick 
     * @memberof 00-helper/fillNavbar
     */
    $btn_wish.onclick= ()=> window.open(`${ prod ? "/projects/eshop94" : "" }/pages/wish`,'_self');
    /**
     * If user press cart button then redirect cart page
     * @callback $btn_cart-onclick 
     * @memberof 00-helper/fillNavbar
     */
    $btn_cart.onclick= ()=> window.open(`${ prod ? "/projects/eshop94" : "" }/pages/cart`,'_self');
  }else{
    /**
     * If user press wish or cart button but he not logged, then show this modal message
     * @function commonModal
     * @memberof 00-helper/fillNavbar
     * @returns null
     */
    const commonModal= ()=> modalShow( "modals" , "tmp_modal" , "Para continuar inicie sesion en google" );
    $btn_wish.onclick= commonModal;
    $btn_cart.onclick= commonModal;
  }
  $btn_search.onclick= () => $inp_search.value.length > 3 && window.open(`${ prod ? "/projects/eshop94" : "" }/pages/articles/?fr=s&cr=${ encodeURIComponent($inp_search.value.toUpperCase().trim()) }`,'_self');
  $inp_search.onkeyup= (ev) => ev.key === 'Enter' && ev.target.value.length > 3 && window.open(`${ prod ? "/projects/eshop94" : "" }/pages/articles/?fr=s&cr=${ encodeURIComponent(ev.target.value.toUpperCase().trim()) }`,'_self');
};

/* ------------------------------------------------------------------------------------------------------------------------ */
/** @namespace 00-helper/genDropTypes  */

/**
 * Fill dropdown with an option for each article type
 * @function genDropTypes
 * @memberof 00-helper
 * @param {String} dropID Dropdown space tag id
 * @param {Array<Object>} list Array list with object that include category information
 * @returns null
 */
const genDropTypes= ( dropID="" , list=[] )=>{

  const $dropdown= d.querySelectorAll(`#${dropID} .dropdown-menu`);
  const $fragment= d.createDocumentFragment();
  list.forEach( el=>{
    const $li= d.createElement('li');
    $li.innerHTML= `<li><a class="dropdown-item" href="${ prod ? "/projects/eshop94" : "" }/pages/articles/?fr=t&cr=${ el.type }">${ el.name }</a></li>`;
    $fragment.appendChild($li);
  });
  $dropdown[2].appendChild($fragment);
};

/* ------------------------------------------------------------------------------------------------------------------------ */
/** @namespace 00-helper/genSearchBox  */

/**
 * Create an list group that include autocomplete information for searcher
 * @function genSearchBox
 * @memberof 00-helper
 * @param {String} spaceID Space tag id where show autocomplete rows
 * @param {String} inputID Searcher tag id
 * @param {Array<String>} list Element's list whit all prducts name
 * @returns null 
 */
const genSearchBox= ( spaceID="" , inputID="" , list=[] )=>{

  /**
   * DOM EL where fill all HTML data
   * @const {HTMLElement} $space
   * @memberof 00-helper/genSearchBox
   */
  const $space= d.querySelector(spaceID);
  /**
   * DOM EL that process all HTML data in memory
   * @const {DocumentFragment} $fragment
   * @memberof 00-helper/genSearchBox
   */
  const $fragment= d.createDocumentFragment();
  /**
   * DOM EL search input text
   * @const {HTMLElement} $inputSearch
   * @memberof 00-helper/genSearchBox
   */
  const $inputSearch= d.getElementById(inputID);
  $inputSearch.addEventListener('keydown', ev =>{
    /**
     * From complete word list filter in array the matches words
     * @const {Array} matchs
     * @memberof 00-helper/genSearchBox
     */
    const matchs= list.filter( el=> el.indexOf( ev.target.value.toUpperCase() ) > -1 );
    $space.innerHTML= "";
    if( 0 >= matchs.length || 4 > ev.target.value.length )
      $space.style.display= "none";
    else{
      $space.style.display= "unset";
      matchs.forEach( el=> {
        const $a= d.createElement('a'); 
        $a.innerHTML= `<i class="bi bi-search pr-2"></i> ${ el }`;
        $a.setAttribute('href',`${ prod ? "/projects/eshop94" : "" }/pages/articles/?fr=s&cr=${ encodeURIComponent(el.toUpperCase().trim()) }`);
        $a.classList.add('btn');
        $a.classList.add('btn-outline-light');
        $fragment.appendChild($a)
      });
      $space.appendChild($fragment);
    };
  });
};

/* ------------------------------------------------------------------------------------------------------------------------ */
/** @namespace 00-helper/genCards  */

/**
 * Create an Bootrap card that content product information
 * @function genCards
 * @memberof 00-helper
 * @param {String} spaceID Space tag id where append an card for each product into list
 * @param {String} templateID tag id where get HTML Card body
 * @param {Array<Object>} list Element's list whit all products
 * @returns null
 */
const genCards= ( spaceID="" , templateID="" , list=[] )=>{

  /**
   * DOM EL where fill all HTML data
   * @const {HTMLElement} $space
   * @memberof 00-helper/genCards
   */
  const $space= d.querySelector(spaceID);
  /**
   * DOM EL that process all HTML data in memory
   * @const {DocumentFragment} $fragment
   * @memberof 00-helper/genCards
   */
  const $fragment= d.createDocumentFragment();
  /**
   * DOM EL template where get all HTML data
   * @const {HTMLElement} $template
   * @memberof 00-helper/genCards
   */
  const $template= d.getElementById(templateID).content;
  list.forEach( el=>{
    /**
    * Variable that check if property clas include word AVAILABLE
    * @const {Boolean} enable
    * @memberof 00-helper/genCards
    */
    const enable= el.clas.toUpperCase() == "DISPONIBLE" && el.qty > 0;

    $template.querySelector('img').setAttribute('src',el.purl)
    $template.querySelector('.card-title').textContent = `$${el.cost},00`;
    $template.querySelector('a').innerHTML= el.mname + `<i class="bi bi-arrow-up-right-square ps-2"></i>`;
    $template.querySelector('a').setAttribute('href',`${ prod ? "/projects/eshop94" : "" }/pages/product/?pid=${ el.id }`);
    $template.querySelector('.version').textContent= el.ver;
    $template.querySelector('.btn:nth-child(1)').dataset.id= el.id;
    $template.querySelector('.btn:nth-child(1)').dataset.type= "wish";
    $template.querySelector('.btn:nth-child(1) i').dataset.id= el.id;
    $template.querySelector('.btn:nth-child(1) i').dataset.type= "wish";
    $template.querySelector('.btn:nth-child(2)').disabled= !enable;
    $template.querySelector('.btn:nth-child(2)').dataset.id= enable ? el.id : "";
    $template.querySelector('.btn:nth-child(2)').dataset.type= enable ? "cart" : "";
    $template.querySelector('.btn:nth-child(2) i').dataset.id= enable ? el.id : "";
    $template.querySelector('.btn:nth-child(2) i').dataset.type= enable ? "cart" : "";
    $template.querySelector('.position-absolute').textContent= el.clas;

    $fragment.appendChild( d.importNode( $template , true ) )
  })
  $space.appendChild($fragment);
};

/* ------------------------------------------------------------------------------------------------------------------------ */
/** @namespace 00-helper/watchCards  */

/**
 * Watch any click enter by client into cards zone
 * @function watchCards
 * @memberof 00-helper
 * @param {String} spaceID Space tag id where are all cards
 * @param {String} uid User unique id
 * @param {String} lblWishID Label tag id counter product wish list
 * @param {String} lblCartID label tag id counter product cart list
 * @returns null
 */
const watchCards= ( spaceID="" , uid , lblWishID="" , lblCartID=""  )=>{ 

  /**
   * DOM EL where check any click made for client
   * @const {HTMLElement} $space
   * @memberof 00-helper/watchCards
   */
  const $space= d.querySelector(spaceID);

  /**
   * If user press any button card, then add to respective list, or wish list or cart list
   * @callback $space-onclick 
   * @memberof 00-helper/watchCards
   */
  $space.onclick= async (ev)=>{
    if( ev.target.matches('[data-id]') ){
      if( !uid ){
        modalShow( "modals" , "tmp_modal" , "Necesitas iniciar sesion para poder continuar" );
      }else{
        try {
          const send= { 
            "id": uid, 
            "prod": ev.target.dataset.id, 
            "type": ev.target.dataset.type  
          };

          const { stat, mess, data }= await fetchSend(`/cart/add-once-cli-cart`,'POST',send);
          if( !stat ) throw new Error(mess);
  
          data.hasOwnProperty('cart') && (d.getElementById(lblCartID).textContent= data['cart']);
          data.hasOwnProperty('wish') && (d.getElementById(lblWishID).textContent= data['wish']);
          
        } catch (err) { modalShow( "modals" , "tmp_modal" , getError(err) ); console.log( 200 , err ) };
      }

    }
  }
};

/* ------------------------------------------------------------------------------------------------------------------------ */
/** @namespace 00-helper/modalCookie  */

/**
 * Create a Html Bootstrap-Modal with message that include cookies use and provacy and policity
 * @function modalCookie
 * @memberof 00-helper
 * @param {String} modalId Space id where fill this information
 * @returns null
 */
const modalCookie= ( modalId="" )=>{
  /**
   * DOM EL where fill all HTML modal data
   * @const {HTMLElement} $mod_Cookie
   * @memberof 00-helper/modalCookie
   */
  const $mod_Cookie= d.querySelector(modalId);
  /**
   * Variable that will fill accpted word from localstorage
   * @const {String} accepted
   * @memberof 00-helper/modalCookie
   */
  const accepted= localStorage.getItem('accepted');
  !accepted && new Modal( $mod_Cookie, { backdrop: "static" } ).show();
  $mod_Cookie.addEventListener('hide.bs.modal', () => localStorage.setItem('accepted',true) );
};

/* ------------------------------------------------------------------------------------------------------------------------ */
/* @namespace 00-helper/getMXN  */

/**
 * Generate "X.YZ" notation give for integer  
 * @function getMXN
 * @memberof 00-helper
 * @param {Number} num Product cost number
 * @returns {String} convert number
 */
const getMXN= ( num= 0 ) =>{
  return num.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 });
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

module.exports= { modalShow, spinnerShow, getError, fillNavbar, genDropTypes, genSearchBox, genCards, watchCards, modalCookie, getMXN, prod, IP, fetchSend , modalEventShow };