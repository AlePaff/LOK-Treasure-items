

function loadImage(path, width, height, target, tooltip) {
   $('<img src="'+ path +'"' + 'title="' + tooltip + '">').on('load', function() {
     $(this).width(width).height(height).appendTo(target);
   });
}

// loadImage("/sprites/icon_10502015.png", 80, 80, "#test_img");



leer_json();
async function leer_json(){
   const response = await fetch("data.json");
   const datos = await response.json();

   console.log("ahora mismo hay "+ datos.master.length + " tesoros");

   var container = document.getElementById("contenedor");

   tesoros_l = [];
   for(let i = 0; i < datos.master.length; i++){
      nombre = datos.master[i].name;
      code_master = datos.master[i].code;
      index_item = datos.item.findIndex(x => x.master == datos.master[i].code);
      index_master = i;
      index_medal_shop = datos.medal_shop.findIndex(x => x.name == datos.master[i].name);
      index_gain_route = datos.gain_route.findIndex(x => x.name == datos.master[i].name);
   
      console.log(nombre, index_item, index_master, index_medal_shop, index_gain_route);
      // if (index_item != -1)

      // create the elems needed
      var element = document.createElement("div");
      element.className = "element-item";
      element.className += " " + "metalloid";
      $(element).attr("data-category", "actinoid");

      loadImage("/sprites/"+ datos.item[index_item].asset +".png", 80, 80, element, datos.master[i].name);
      
      var grade = document.createElement("div");
      grade.className = "number";
      grade.innerHTML = datos.item[index_item].grade;
      element.appendChild(grade);
      
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

       // append player to container
       container.appendChild(element);

   }   
}





// external js: isotope.pkgd.js
$(document).ready(function() {

  


   // init Isotope
   var $grid = $('.grid').isotope({
      itemSelector: '.element-item',
      layoutMode: 'fitRows',
      getSortData: {
      name: '.name',
      symbol: '.symbol',
      number: '.number parseInt',
      category: '[data-category]',
      weight: function( itemElem ) {
         var weight = $( itemElem ).find('.weight').text();
         return parseFloat( weight.replace( /[\(\)]/g, '') );
      }
      }
   });
   
   // filter functions
   var filterFns = {
      // show if number is greater than 50
      numberGreaterThan50: function() {
      var number = $(this).find('.number').text();
      return parseInt( number, 10 ) > 50;
      },
      // show if name ends with -ium
      ium: function() {
      var name = $(this).find('.name').text();
      return name.match( /ium$/ );
      }
   };
   
   // bind filter button click
   $('#filters').on( 'click', 'button', function() {
      var filterValue = $( this ).attr('data-filter');
      // use filterFn if matches value
      filterValue = filterFns[ filterValue ] || filterValue;
      $grid.isotope({ filter: filterValue });
   });
   
   // bind sort button click
   $('#sorts').on( 'click', 'button', function() {
      var sortByValue = $(this).attr('data-sort-by');
      $grid.isotope({ sortBy: sortByValue });
   });
   
   // change is-checked class on buttons
   $('.button-group').each( function( i, buttonGroup ) {
      var $buttonGroup = $( buttonGroup );
      $buttonGroup.on( 'click', 'button', function() {
      $buttonGroup.find('.is-checked').removeClass('is-checked');
      $( this ).addClass('is-checked');
      });
   });
   
   
 
});

 
