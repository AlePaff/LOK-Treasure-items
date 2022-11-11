
function loadImage(path, width, height, target, tooltip) {
   $('<img src="'+ path +'"' + 'title="' + tooltip + '">').on('load', function() {
     $(this).width(width).height(height).appendTo(target);
   });
}

// ejemplo de uso 
// loadImage("/sprites/icon_10502015.png", 80, 80, "#test_img");


// leer_json();
// async function leer_json(){      //async significa que la función es asíncrona (no se ejecuta de forma secuencial)
//    const response = await fetch("data.json");   //await significa que espera a que la petición fetch() termine, y fetch es una petición a un servidor (en este caso a un archivo json)
//    const datos = await response.json();      //aca espera a que la petición json() termine (la cual es del tipo Promise)


// fetch('data.json')      //fetch es una petición a un servidor (en este caso a un archivo json)
//    .then(response => response.json())     //response es del tipo json, por lo que se usa el método json() para convertirlo en un objeto de javascript
//    .then(datos => {                  //datos es el objeto de javascript ya parseado

// $(document).ready(function(){
   
// });


let json = {};

// external js: isotope.pkgd.js
$(document).ready(function() {      //se fija cuando el documento está listo para ejecutar el código
// $() es un selector de elementos de jquery, es como document.getElementById() pero más potente
// luego de ready se ejecuta una función anónima (una función que no tiene nombre, se ejecuta cuando se llama)

function isotopeCode(){
   console.log("ready!");

   // init Isotope
   var $grid = $('.grid').isotope({
      itemSelector: '.element-item',
      layoutMode: 'fitRows',
      getSortData: {
      name: function( itemElem ) {     //disable case sensitive
         var name = $( itemElem ).find('.name').text();
         return name.toLowerCase();
      },
      grade: '.grade parseInt',
      symbol: '.symbol',
      category: '[data-category]',
      weight: function( itemElem ) {
         var weight = $( itemElem ).find('.weight').text();
         return parseFloat( weight.replace( /[\(\)]/g, '') );
      }
      }
   });
   
   // filter functions
   var filterFns = {
      // show if grade is greater than 50
      numberGreaterThan50: function() {
      var grade = $(this).find('.grade').text();
      return parseInt( grade, 10 ) > 50;
      },
      // show if name ends with -ium
      ium: function() {
      var name = $(this).find('.name').text();
      return name.match( /ium$/ );
      },

      // gradeLegendary: function() {
      //    var grade = $(this).find('.grade').text();
      //    return parseInt(grade, 10) == 4;
      // },
      gradeEpic: function() {
         var grade = $(this).find('.grade').text();
         return parseInt(grade, 10) == 3;
      },

      legendary: function() {
         var grade = $(this).find('.grade').text();
         return parseInt(grade, 10) == 4;
      }
   };   
   // bind filter button click
   $('#filters').on( 'click', 'button', function() {
      var filterValue = $( this ).attr('data-filter');
      // use filterFn if matches value
      filterValue = filterFns[ filterValue ] || filterValue;
      $grid.isotope({ filter: filterValue });
   });
   

   // bind filter on select change
   $('.filters-select').on( 'change', function() {
      // get filter value from option value
      var filterValue = this.value;
      // use filterFn if matches value
      filterValue = filterFns[ filterValue ] || filterValue;
      $grid.isotope({ filter: filterValue });
   });



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
   
   // change is-checked class on buttons
   $('.button-group').each( function( i, buttonGroup ) {
      var $buttonGroup = $( buttonGroup );
      $buttonGroup.on( 'click', 'button', function() {
      $buttonGroup.find('.is-checked').removeClass('is-checked');
      $( this ).addClass('is-checked');
      });
   });
   
}









// === Lectura del json y creación de los elementos ===
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
   // if (index_item != -1)

   // create the elems needed
   var element = document.createElement("div");
   element.className = "element-item";
   element.className += " " + "metalloid";
   $(element).attr("data-category", "actinoid");

   loadImage("/sprites/"+ datos.item[index_item].asset +".png", 80, 80, element, datos.master[i].name);
   
   //grado (normal, magico, epico, legendario)
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
