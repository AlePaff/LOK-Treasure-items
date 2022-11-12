
function loadImage(path, width, height, target, tooltip) {
   $('<img src="'+ path +'"' + 'title="' + tooltip + '">').on('load', function() {
     $(this).width(width).height(height).appendTo(target);
   });
}
// ejemplo de uso 
// loadImage("/sprites/icon_10502015.png", 80, 80, "#test_img");


function grade_to_string(grade){
   if(grade == 1){
      return "normal";
   }else if(grade == 2){
      return "magic";
   }else if(grade == 3){
      return "epic";
   }else if(grade == 4){
      return "legendary";
   }
}

// leer_json();
// async function leer_json(){      //async significa que la función es asíncrona (no se ejecuta de forma secuencial)
//    const response = await fetch("data.json");   //await significa que espera a que la petición fetch() termine, y fetch es una petición a un servidor (en este caso a un archivo json)
//    const datos = await response.json();      //aca espera a que la petición json() termine (la cual es del tipo Promise)


// fetch('data.json')      //fetch es una petición a un servidor (en este caso a un archivo json)
//    .then(response => response.json())     //response es del tipo json, por lo que se usa el método json() para convertirlo en un objeto de javascript
//    .then(datos => {                  //datos es el objeto de javascript ya parseado

// $(document).ready(function(){
   
// });



// external js: isotope.pkgd.js
$(document).ready(function() {      //se fija cuando el documento está listo para ejecutar el código
// $() es un selector de elementos de jquery, es como document.getElementById() pero más potente
// luego de ready se ejecuta una función anónima (una función que no tiene nombre, se ejecuta cuando se llama)

function isotopeCode(){   
   
   // filter functions
   var filterFns = {
      // show if grade is greater than 50
      // numberGreaterThan50: function() {
      // var grade = $(this).find('.grade').text();
      // return parseInt( grade, 10 ) > 50;
      // },
      // show if name ends with -ium
      ium: function() {
      var name = $(this).find('.name').text();
      return name.match( /ium$/ );
      }


      // legendary: function() {
      //    var grade = $(this).find('.grade').text();
      //    return parseInt(grade, 10) == 4;
      // }
   };   

   var filters = {};


  // init Isotope
  var $grid = $('.grid').isotope({     //selecciona el elemento con clase grid y le aplica el plugin isotope
   itemSelector: '.element-item',      //selecciona los elementos con clase element-item
   layoutMode: 'fitRows',        //ordena en filas
   getSortData: {
   name: function( itemElem ) {     //desabilita case sensitive
      var name = $( itemElem ).find('.name').text();
      return name.toLowerCase();
   },
   grade: '.grade', // parseInt',
   symbol: '.symbol',
   category: '[data-category]',
   weight: function( itemElem ) {
      var weight = $( itemElem ).find('.weight').text();
      return parseFloat( weight.replace( /[\(\)]/g, '') );
   }
   },
   filter: function() {      
    var isMatched = true;
    var $this = $(this);      
   
    for ( var prop in filters ) {
      var filter = filters[ prop ];
      // use function if it matches
      filter = filterFns[ filter ] || filter;      //si el filtro es una función, se usa la función, sino se usa el filtro
      // test each filter
      if ( filter ) {
        isMatched = isMatched && $(this).is( filter );
      }
      // break if not matched
      if ( !isMatched ) {
        break;
      }
    }
    return isMatched;
  }
});




$('#filters').on( 'click', '.button', function() {    //cuando se hace click en un elemento con clase button dentro de un elemento con id filters
   console.log("click");
   var $this = $(this);
   // get group key
   var $buttonGroup = $this.parents('.button-group');    //selecciona el elemento padre con clase button-group
   var filterGroup = $buttonGroup.attr('data-filter-group');      //selecciona el atributo data-filter-group del elemento padre
   // set filter for group
   filters[ filterGroup ] = $this.attr('data-filter');      //selecciona el atributo data-filter del elemento que se clickeó
   // arrange, and use filter fn
   $grid.isotope();     //aplica el filtro
 });
  
  

   // ========= Sorting =========
   // bind sort button click
   $('#sorts').on( 'click', 'button', function() {
      var sortByValue = $(this).attr('data-sort-by');
      $grid.isotope({
         sortBy: sortByValue,
         sortAscending: {
            name: true,
            grade: false
         }
      });
   });



   // ========= Update =========
   
   // change is-checked class on buttons
   $('.button-group').each( function( i, buttonGroup ) {    //selecciona cada elemento con clase button-group
      var $buttonGroup = $( buttonGroup );      
      $buttonGroup.on( 'click', 'button', function() {      //cuando se hace click en un elemento con clase button dentro de un elemento con clase button-group
      $buttonGroup.find('.is-checked').removeClass('is-checked');    //selecciona el elemento con clase is-checked y le quita la clase
      $( this ).addClass('is-checked');      //le agrega la clase is-checked al elemento que se clickeó
      });
   });
   
}


let json = {};
var ability_translation = {};

// === Lectura del json y creación de los elementos ===
$.getJSON("ability_translation.json", function(traducciones) {
   ability_translation = traducciones;
});

$.getJSON("data.json", function(datos){
   json = datos;

// console.log("ahora mismo hay "+ datos.master.length + " tesoros");

var container = document.getElementById("contenedor");

tesoros_l = [];
for(let i = 0; i < datos.master.length; i++){
   nombre = datos.master[i].name;
   code_master = datos.master[i].code;
   index_item = datos.item.findIndex(x => x.master == datos.master[i].code);
   index_master = i;
   index_medal_shop = datos.medal_shop.findIndex(x => x.name == datos.master[i].name);
   index_gain_route = datos.gain_route.findIndex(x => x.name == datos.master[i].name);

   // console.log(nombre, index_item, index_master, index_medal_shop, index_gain_route);

   //traducir codigo de habilidad comun a string

   // "ability_2": 22044,
   // "ability_type_2": 3,
   // "ability_value_2": 1,
   // "ability_3": 22045,
   // "ability_type_3": 3,
   // "ability_value_3": 1,
   // "ability_4": 0,
   // "ability_type_4": 0,
   // "ability_value_4": 0,
   // "ability_5": 0,
   // "ability_type_5": 0,

   
   var language = "English";


   // treasure_boost = {
   //    ab1_name : "cav speed"
   //    ab1_lvl : 1
   //    lvl_value_5: 0.08 
   // }

   //habilidades master
   for(let j = 0; j < 5; j++){
      hab_number = datos.master[i]["ability_"+(j+1)];
      if(hab_number > 10000){      //si la habilidad es item especial (ej. Instant harvest 1)
         hab_j_lvl = datos.master[i]["ability_value_"+(j+1)];
         var index_ab_special = datos.askill.findIndex(x => x.code == hab_number && x.level == hab_j_lvl);
         var name_special = datos.askill[index_ab_special].name;
         // console.log(name_special)
      }
      else if(hab_number != 0){
         var name_hab = "ability_" + hab_number;
         // var hab_j_lvl_c = datos.master[i]["ability_value_"+(j+1)];
         var hab_index_lang = ability_translation.findIndex(x => x.Description == name_hab);
         var hab_name = ability_translation[hab_index_lang][language];
         // console.log(hab_name);
      }
   }

   //    var hab_code_1 = datos.item[index_item].ability_1;
   // var hab_code_2 = datos.item[index_item].ability_2;
   // var hab_code_3 = datos.item[index_item].ability_3;
   // var hab_code_4 = datos.item[index_item].ability_4;
   // var hab_code_5 = datos.item[index_item].ability_5;
      


   //get english name
   // var hab_index_1 = datos.pskill.findIndex(x => x.code == hab_code_1);
   // var name1 = "ability_" + datos.pskill[hab_index_1].ability;
   // var hab_index_1_en = ability_translation.findIndex(x => x.Description == name1);
   // var hab_name_1 = ability_translation[hab_index_1_en][language];
   
   
   




   // create the elems needed
   var element = document.createElement("div");
   element.className = "element-item";  
   element.className += " " + grade_to_string(datos.item[index_item].grade);
   // $(element).attr("data-category", "actinoid");

   loadImage("/sprites/"+ datos.item[index_item].asset +".png", 80, 80, element, datos.master[i].name);
   
   // grado (normal, magico, epico, legendario)
   var grade = document.createElement("div");
   grade.className = "grade";
   grade.innerHTML = datos.item[index_item].grade;
   element.appendChild(grade);
   
   //nombre del tesoro
   var name = document.createElement("h2");
   name.className = "name";
   name.innerHTML = datos.master[i].name;
   element.appendChild(name);


    var weight = document.createElement("p");
    weight.className = "weight";
    weight.innerHTML = 33;
   element.appendChild(weight);

   var symbol = document.createElement("p");
   symbol.className = "symbol";
   symbol.innerHTML = index_item;
   element.appendChild(symbol);

    // append data to container
    container.appendChild(element);

}

// una vez cargados los datos del json, se ejecuta el código de isotope
}).then(() => isotopeCode());
});

