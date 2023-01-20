//inicializa los tooltips de bootstrap
function initTooltips() {
   $('[data-toggle="tooltip"]').tooltip()
}

//dadas las estadisticas de un objeto arma un tooltip para ser mostrado en las tarjetas
function armarTooltip(tooltip_info) {
   var string_tooltip = "";
   var tb = "<u>Treasure Boost (Max. lvl)</u><br>";
   var mb = "<u>Master Bonus</u><br>";
   var tab = "<span class='tab'></span>";
   var tb_code = "treasure_ab";
   var mb_code = "treasure_master_ab";

   for (let k = 0; k < 10; k++) {
      // treasure boost
      if (tooltip_info[tb_code + (k + 1)] != undefined) {
         nombre = tooltip_info[tb_code + (k + 1)][0];
         valor = tooltip_info[tb_code + (k + 1)][1];
         if (valor < 1) {    //si se trata de un porcentaje
            valor = Math.round(valor * 100) + "%";
         }
         tb += "- " + nombre + ":" + tab + valor + "<br>";
         // tb += "<p style='text-align:left;'>" + nombre +tab+ "<span style='float:right;'>" + valor + "</span></p>";
         // tb += "<p style='display: flex; justify-content: space-between; white-space:nowrap;'>" + "<span>"+ nombre +"</span>"+ "<span>" + valor + "</span></p>";
      }
      // master boost
      if (tooltip_info[mb_code + (k + 1)] != undefined) {
         nombre = tooltip_info[mb_code + (k + 1)][0];
         valor = tooltip_info[mb_code + (k + 1)][1];
         if (valor < 1) {
            valor = Math.round(valor * 100) + "%";
         }
         mb += "- " + nombre + ":" + tab + valor + "<br>";
      }
   }
   string_tooltip = tb + mb;
   return string_tooltip;
}

//carga una imagen en el target especificado
// ejemplo de uso:  loadImage("/sprites/icon_10502015.png", 80, 80, "#test_img");
function loadImage(path, width, height, target, back) {
   //si el tooltip es para el background y frame
   if (back == "under" | back == "over") {
      $('<img src="' + path + '"' + 'class="' + back + '">').on('load', function () {
         $(this).width(width).height(height).appendTo(target);
      })
   }
}

//carga el background y el frame de un item
function loadFrameAndBackground(grade, width, height, target) {
   var grade_string = grade_to_string(grade);
   var path_frame = "sprites/item_frame_" + grade_string + ".png";
   var path_background = "sprites/item_bg_" + grade_string + ".png";
   loadImage(path_frame, width, height, target, "over");
   loadImage(path_background, width, height, target, "under");
}

//asigna el grado de un item a su nombre
function grade_to_string(grade) {
   if (grade == 1) {
      return "normal";
   } else if (grade == 2) {
      return "magic";
   } else if (grade == 3) {
      return "epic";
   } else if (grade == 4) {
      return "legendary";
   }
}






// ejecuta el codigo y la logica de isotope
function isotopeCode() {

   // filter functions
   var filterFns = {
      // ver funciones de filtrado en https://isotope.metafizzy.co/filtering.html#functions
   };

   var filters = {};


   // init Isotope
   var $grid = $('.grid').isotope({     //selecciona el elemento con clase grid y le aplica el plugin isotope
      itemSelector: '.element-item',      //selecciona los elementos con clase element-item
      layoutMode: 'fitRows',        //ordena en filas
      //sorts (ver mas en https://isotope.metafizzy.co/sorting.html#getsortdata)
      getSortData: {
         name: function (itemElem) {     //desabilita case sensitive
            var name = $(itemElem).find('.name').text();
            return name.toLowerCase();
         },
         grade: '.grade'
      },
      // filtros
      filter: function () {
         var isMatched = true;
         var $this = $(this);
         for (var prop in filters) {
            var filter = filters[prop];       //toma el elemento "prop" del array de filtros
            // use function if it matches
            filter = filterFns[filter] || filter;      //si el filtro es una función, se usa la función, sino se usa el filtro
            // test each filter

            if (filter) {      //si el filtro existe
               //   isMatched = isMatched && $(this).is( filter );      //si el elemento es igual al filtro, se devuelve true, sino false  
               isMatched = isMatched && ($(this).is(filter) || $this.find(filter).length > 0);     //o bien si alguno de los hijos matchea con el filtro (usando find)

               //si filters tiene como clave "resources" Y "resources_specific" entonces
               //fijate de los hijos, uno que cumpla ambas condiciones de los valores de cada clave
               //    Esto no puedo hacerlo solo con isotope desde el html talque ".gold .reserves", debe ser "(.gold|lumber|stone|food|any|resource), .reserves"
               //    y este aproach no funciona porque es poco flexible, no se puede hacer una logica condicional compleja
               //    y si quiero buscar solo reserves estoy limitado a alguno de los otros
               if ("resources" in filters && "resources_specific" in filters) {
                  var filtros_string = filters["resources"] + filters["resources_specific"];
                  isMatched = isMatched && ($this.find(filtros_string).length > 0);
               }
               if ("battle" in filters && "battle_specific" in filters) {
                  var filtros_string = filters["battle"] + filters["battle_specific"];
                  isMatched = isMatched && ($this.find(filtros_string).length > 0);
               }
            }
            // break if not matched
            if (!isMatched) {
               break;
            }
         }
         return isMatched;
      }
   });



   $('.filters').on('click', '.button', function () {    //cuando se hace click en un class = button de class = filters
      var $this = $(this);    //selecciona el elemento que se clickeó
      var $buttonGroup = $this.parents('.button-group');    //selecciona el elemento padre con clase button-group

      var filterGroup = $buttonGroup.attr('data-filter-group');      //selecciona el atributo data-filter-group del elemento padre
      filters[filterGroup] = $this.attr('data-filter');      //selecciona el atributo data-filter del elemento que se clickeó y lo guarda en filters
      //ej. filters = {resources: ".gold", grade: ".legendary"}

      $grid.isotope();     //aplica el filtro
   });




   // ========= Sorting =========
   // bind sort button click
   $('.sorts').on('click', 'button', function () {
      var sortByValue = $(this).attr('data-sort-by');
      $grid.isotope({
         sortBy: sortByValue,
         sortAscending: {
            name: true,
            grade: false
         }
      });
   });


   // ==================== Reset ====================
   var $defaultCheck = $('.filters').find('button[data-filter="*"]');   //botones que esten dentro de filters y tengan el atributo data-filter="*"
   var $buttons = $('.filters button');
   $('.button--reset').on('click', function () {
      // reset filters
      filters = {};
      $grid.isotope();
      // reset buttons
      $buttons.removeClass('is-checked');
      $defaultCheck.addClass('is-checked');
   });


   // ============= highlight tooltip =============   
   // var tooltip_original = "";
   // //toma cada filtro aplicado y remarca en el tooltip dicho filtro
   // $('.element-item').on("mouseenter", function () {

   //    // busca la descripción que tenga el boton seleccionado
   //    var item_tooltip = $(this).find('img[data-original-title]');
   //    var texto_tooltip = item_tooltip.attr('data-original-title');
   //    tooltip_original = texto_tooltip;     //para mantener una copia del texto original

   //    for (var prop in filters) {
   //       var filtro = filters[prop];
   //       if (filtro != '*') {      //ignorar cuando un boton está en "any"
   //          //obtiene el nombre que se muestra en el boton actualmente seleccionado
   //          var filter_name = $('.filters').find('button[data-filter="' + filtro + '"]').text();
   //          var re = new RegExp(filter_name, "gi");    //g=global, i=insensitive

   //          //reemplaza el nombre del boton en el tooltip por el mismo pero bold
   //          texto_tooltip = texto_tooltip.replace(re, "<b>" + filter_name + "</b>");
   //          item_tooltip.attr('data-original-title', texto_tooltip);
   //       }
   //    }
   // });
   // // resetear tooltip cuando salga el mouse del item
   // $('.element-item').on("mouseleave", function () {
   //    var item_tooltip = $(this).find('img[data-original-title]');
   //    item_tooltip.attr('data-original-title', tooltip_original);
   // });

   
   // ========= Update =========
   // change is-checked class on buttons
   $('.button-group').each(function (i, buttonGroup) {    //selecciona cada elemento con clase button-group
      var $buttonGroup = $(buttonGroup);
      $buttonGroup.on('click', 'button', function () {      //cuando se hace click en un elemento con clase button dentro de un elemento con clase button-group
         $buttonGroup.find('.is-checked').removeClass('is-checked');    //selecciona el elemento con clase is-checked y le quita la clase
         $(this).addClass('is-checked');      //le agrega la clase is-checked al elemento que se clickeó
      });
   });




}



// ========= Cargar datos =========
let json = {};
var ability_translation = {};


// === Lectura del json y creación de los elementos ===
const promise1 = $.getJSON("ability_translation.json", function (traducciones) {
   ability_translation = traducciones;
});

const promise2 = $.getJSON("data.json", function (datos) {
   json = datos;

   // console.log("ahora mismo hay "+ datos.master.length + " tesoros");

   var container = document.getElementById("contenedor");

   tesoros_l = [];
   for (let i = 0; i < datos.master.length; i++) {
      //caracteristicas de los items (nombre item, etc)
      nombre = datos.master[i].name;
      code_master = datos.master[i].code;
      index_item = datos.item.findIndex(x => x.master == datos.master[i].code);
      index_master = i;
      index_medal_shop = datos.medal_shop.findIndex(x => x.name == datos.master[i].name);
      index_gain_route = datos.gain_route.findIndex(x => x.name == datos.master[i].name);
      // console.log(nombre, index_item, index_master, index_medal_shop, index_gain_route);

      treasure_boost_and_master_bonus = {};
      tooltip_info = {};      //prefiero tener info repetida que codigo desprolijo

      //habilidades comunes
      for (let j = 0; j < 5; j++) {
         var hab_number = datos.item[index_item]["ability_" + (j + 1)];
         if (hab_number != 0) {
            var hab_index_pskill = datos.pskill.findIndex(x => x.code == hab_number);
            var hab_code = datos.pskill[hab_index_pskill].ability;
            var hab_index_lang = ability_translation.findIndex(x => x.Description == "ability_" + hab_code);
            var hab_name = ability_translation[hab_index_lang]["English"];
            var hab_value_max = datos.pskill[hab_index_pskill].level_value_5;
            treasure_boost_and_master_bonus["treasure_ab" + (j + 1)] = [hab_name.toLowerCase(), hab_value_max];
            tooltip_info["treasure_ab" + (j + 1)] = [hab_name, hab_value_max];
         }
      }

      tiene_debuff = false;
      tiene_buff = false;
      //habilidades master
      for (let j = 0; j < 5; j++) {
         hab_number = datos.master[i]["ability_" + (j + 1)];
         if (hab_number > 10000) {      //si la habilidad es item especial (ej. Instant harvest 1)
            hab_j_lvl = datos.master[i]["ability_value_" + (j + 1)];     //lvl 1, 2 o 3
            var index_ab_special = datos.askill.findIndex(x => x.code == hab_number && x.level == hab_j_lvl);
            var name_special = datos.askill[index_ab_special].name;     //Instant harvest 1
            var abilityValue = datos.askill[index_ab_special].ability_value_1;      //1
            treasure_boost_and_master_bonus["treasure_ab" + (j + 6)] = [name_special.toLowerCase(), abilityValue];
            tooltip_info["treasure_master_ab" + (j + 6)] = [name_special, abilityValue];

            if (abilityValue < 0)
               tiene_debuff = true;
            else
               tiene_buff = true;

         }
         else if (hab_number != 0) {
            var name_hab = "ability_" + hab_number;
            var hab_index_lang = ability_translation.findIndex(x => x.Description == name_hab);
            var hab_name = ability_translation[hab_index_lang]["English"];
            var hab_value = datos.master[i]["ability_value_" + (j + 1)];
            treasure_boost_and_master_bonus["treasure_ab" + (j + 6)] = [hab_name.toLowerCase(), hab_value];
            tooltip_info["treasure_master_ab" + (j + 6)] = [hab_name, hab_value];
         }
      }


      // === print all treasure boost and master bonus for debug purposes ===
      // for(let j = 0; j < 10; j++){
      //    if(treasure_boost_and_master_bonus["treasure_ab"+(j+1)] != undefined){
      //       console.log(treasure_boost_and_master_bonus["treasure_ab"+(j+1)][0]);
      //    }
      // }
      // console.log("========");


      // === Cambio de nombres, filtros y parseo ===
      for (let j = 0; j < 10; j++) {
         var trea = treasure_boost_and_master_bonus["treasure_ab" + (j + 1)];
         if (trea != undefined) {
            //convierte "gathering speed" en "gathering_speed" (lo mismo con "lumber gathering speed" en "lumber_gathering_speed")
            if (trea[0].includes("gathering speed")) { trea[0] = trea[0].replace("gathering speed", "gathering_speed"); }
            if (trea[0].includes("training speed")) { trea[0] = trea[0].replace("training speed", "training_speed"); }
            if (trea[0].includes("training rate")) { trea[0] = trea[0].replace("training rate", "training_rate"); }
            if (trea[0].includes("training cost")) { trea[0] = trea[0].replace("training cost", "training_cost"); }
            if (trea[0].includes("research speed")) { trea[0] = trea[0].replace("research speed", "research_speed"); }
            if (trea[0].includes("healing speed")) { trea[0] = trea[0].replace("healing speed", "healing_speed"); }
            if (trea[0].includes("action point")) { trea[0] = trea[0].replace("action point", "action_point"); }
            if (trea[0].includes("mortality reduction")) { trea[0] = trea[0].replace("mortality reduction", "mortality_reduction"); }

            // if(trea[0].includes("hospital capacity")){trea[0] = trea[0].replace("hospital capacity", "hospital_capacity");}
            if (trea[0].includes("construction speed")) { trea[0] = trea[0].replace("construction speed", "construction_speed"); }
         }
      }





      // ==== create the elems needed ====
      var element = document.createElement("div");
      element.className = "element-item";
      element.className += " " + grade_to_string(datos.item[index_item].grade);
      element.className += (tiene_debuff ? " debuff" : "") + (tiene_buff ? " buff" : "");

      var language = "English";

      // crea la imagen del item
      var img = document.createElement("img");
      img.src = "sprites/" + datos.item[index_item].asset + ".png";
      img.width = 80;
      img.height = 80;
      img.setAttribute("data-toggle", "tooltip");
      img.setAttribute("data-html", true);
      nombre_item = "<h5>" + datos.master[i].name.charAt(0).toUpperCase() + datos.master[i].name.slice(1) + "</h5>";     //capitaliza la primer letra
      img.setAttribute("title", nombre_item + armarTooltip(tooltip_info));
      element.appendChild(img);

      // crea el frame del item
      loadFrameAndBackground(datos.item[index_item].grade, 100, 100, element);

      // grado (normal, magico, epico, legendario)
      var grade = document.createElement("div");
      grade.className = "grade";
      grade.innerHTML = datos.item[index_item].grade;
      element.appendChild(grade);

      //nombre del tesoro (depende de la logica de isotope, en un futuro añadirlo para cada idioma)
      var name = document.createElement("div");
      name.className = "name";
      name.innerHTML = datos.master[i].name;
      element.appendChild(name);

      //habilidades de los tesoros, comunes y master
      for (let j = 0; j < 10; j++) {
         var ability = document.createElement("div");
         if (treasure_boost_and_master_bonus["treasure_ab" + (j + 1)] != undefined) {
            ability.className = treasure_boost_and_master_bonus["treasure_ab" + (j + 1)][0];

            ability.innerHTML = treasure_boost_and_master_bonus["treasure_ab" + (j + 1)][1];
            element.appendChild(ability);
         }
      }

      // append data to container
      container.appendChild(element);
   }

   // =========== tooltip de los botones =============
   descripcion_botones(".training_rate", "Indica cuantas tropas se pueden entrenar como maximo en el cuartel");
   descripcion_botones(".training_cost", "No disponible en ninguno de los items");
   descripcion_botones(".mortality_reduction", "No disponible en ninguno de los items");
   descripcion_botones(".hospital_capacity", "No disponible en ninguno de los items");
   descripcion_botones(".buff", "aplica para el propio reino, se pueden ver en la esquina inferior derecha del juego, presionando el icono del rayo 🗲");
   descripcion_botones(".debuff", "aplica para el enemigo, hay que hacer click en un castillo enemigo y luego en el rayo naranja 🗲 que aparece debajo");

   // una vez cargados los datos del json, se ejecuta el código de isotope
});


function descripcion_botones(selector, descripcion) {
   var boton = $("#buttons-container").find('button[data-filter="' + selector + '"]');
   boton.attr("data-delay", '{"show":"2000", "hide":"50"}');
   boton.attr("title", descripcion);
   boton.attr("data-toggle", "tooltip");
}

Promise.all([promise1, promise2]).then((values) => {
   isotopeCode();
   initTooltips();
});


