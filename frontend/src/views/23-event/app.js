
const { fetchSend }= require('../../js/helper.js');

const d= document;



const main= async () =>{
  const urlp = new URLSearchParams(window.location.search);
  const { data }= await fetchSend(`/reservation/getOne/${ urlp.get('eid') }`);
  //console.log( data );

  const $space= d.querySelector('#sec_body23 blockquote');

  const $table= d.createElement('div');
  for (let i = 0; i < 3; i++) {
    const $row= d.createElement('div');
    $row.classList.add('d-flex');

    for (let j = 0; j < 2; j++) {
      const $i= d.createElement('i');
      $i.classList.add('bi','bi-archive');
      $row.appendChild($i);
    }
    $table.appendChild($row);
  };

  $space.appendChild($table);
};

main();