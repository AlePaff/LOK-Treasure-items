
leer_json();
async function leer_json(){
   const response = await fetch("data.json");
   const datos = await response.json();

   console.log("ahora mismo hay "+ datos.master.length + " tesoros");

   tesoros_l = [];
   for(let i = 0; i < datos.master.length; i++){
      dict = {
         nombre: datos.master[i].name,
         code_master: datos.master[i].code,
         index_item: datos.item.findIndex(x => x.master == datos.master[i].code),
         index_master: i,
         index_medal_shop: datos.medal_shop.findIndex(x => x.name == datos.master[i].name),
         index_gain_route: datos.gain_route.findIndex(x => x.name == datos.master[i].name),
      }
      tesoros_l.push(dict);
   
      // console.log(dict.nombre, dict.index_item, dict.index_master, dict.index_medal_shop, dict.index_gain_route);
   }

   //cargar y mostrar en pantalla la imagen en "src=/sprites/icon_10502015.png" usando jquery sin usar html
   // $("#imagen").attr("src", "/sprites/icon_10502015.png");


   
}


function loadImage(path, width, height, target) {
   $('<img src="'+ path +'">').on('load', function() {
     $(this).width(width).height(height).appendTo(target);
   });
}

loadImage("/sprites/icon_10502015.png", 80, 80, "#test_img");
loadImage("/sprites/icon_10504012.png", 80, 80, "#test_img");



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

 
