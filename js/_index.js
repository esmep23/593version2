var direccion = "http://pocket.ec/dev/beach_593/";
var _playas = new Array();
var _actividades = new Array();
var _servicios = new Array();
var _detallePlaya = new Array();
var favoritos;
var map;
var onSearch = false; //toggle
var value = localStorage.getItem('token');
var beaches = new Array();
var lon;
var lat;

var beaches = new Array();


$( document ).ready(function() {
   
  //sizeWindows();
  perfilUsuario();

  if (localStorage.getItem("favoritos") === null) {
    localStorage.setItem( 'favoritos', "0" );
  }

  if ($$('body').hasClass('with-panel-left-cover')) {
     // console.log('Left Panel is opened')
  }

  myApp.onPageInit('registro', function (page) {
    
    for (var i = 14; i < 100; i++) {
      $('#anio').append('<option value="'+i+'">'+i+'</option>');
    } 

  });

  myApp.onPageInit('playas', function (page) {

     myApp.openPanel('left'); //abro menu
    setTimeout(function(){ 
      playasOFFLine();

      $('div.navbar').css('display','block');
    }, 1000);
   
  });

  myApp.onPageBeforeInit('misplayas', function (page) {
    misPlayas();
  });


  

  myApp.onPageInit('registro', function (page) {
    $('div.navbar').css('display','none');
  });

  myApp.onPageInit('mapa', function (page) {
    $('#map').css('width','100%');
    $('#map').css('height', screen.height -250);
  });

 
  //getMobileOperatingSystem();
 
 
  if(navigator.onLine){

    console.log('Online');
    getPlayas();
    cargoActividades();
    
  }





  if(value){
    //alert('TENGO');    
     mainView.router.load({pageName: 'playas', animatePages: false});
      
  }else{
    //alert('NO TENGO');  
     mainView.router.load({pageName: 'registro', animatePages: false});
  }



 
}); // document ready
/*
  function toggle_visibility_search(argument) {
      onRate = !onRate;
      alert(onRate);
      if(onRate){
          alert();
      }else{
         alert();
      } 
  }
*/
function toggle_visibility(argument) {
    //alert(argument);
    var e = document.getElementById('.playa-'+argument+' i');
    
    if($('.playa-'+argument+' i').hasClass('activo') ){
        
        $('.playa-'+argument+' i').removeClass('activo');

        //var array = JSON.parse(localStorage.getItem( 'favoritos') );
        var array = JSON.parse(localStorage.getItem( 'favoritos') );
        var a = array.indexOf(String(argument) );
        //array.splice(1, a);
        delete array[ a ];
        localStorage.setItem('favoritos', JSON.stringify(array));

        console.log('-----------------------------------------------------------------------------------------------------------');

     

        localStorage.setItem('favoritos', JSON.stringify(array));

    }else{
        
        $('.playa-'+argument+' i').addClass('activo');

        rate(argument);
    }


    misPlayas();
    cargoFavoritos();
}

function toggle_visibility_inside(argument) {
    //alert(argument);
    var e = document.getElementById('#infoPlayas .contenido article .rated .stars i');
    
    
    if($('#infoPlayas .contenido article .rated .stars i').hasClass('activo') ){
        
        $('#infoPlayas .contenido article .rated .stars i').removeClass('activo');

        //var array = JSON.parse(localStorage.getItem( 'favoritos') );
        var array = JSON.parse(localStorage.getItem( 'favoritos') );
        var a = array.indexOf(String(argument) );
        //array.splice(1, a);
        delete array[ a ];
        localStorage.setItem('favoritos', JSON.stringify(array));

        console.log('-----------------------------------------------------------------------------------------------------------');

       

        localStorage.setItem('favoritos', JSON.stringify(array));
        


    }else{
        
        $('#infoPlayas .contenido article .rated .stars i').addClass('activo');
       
        rate(argument);
        
         
        

    }

      playasOFFLine();
      misPlayas();
    
}

  function sizeWindows(){
    // $('#busqueda .contenido').css('height', screen.height-(screen.height/1.8));
  }

  /* detect */
  function getMobileOperatingSystem() {
    var userAgent = navigator.userAgent || navigator.vendor || window.opera;

    if( userAgent.match( /iPad/i ) || userAgent.match( /iPhone/i ) || userAgent.match( /iPod/i ) )
    {
      //return 'iOS';
      var css_link = $("<link>", {
        rel: "stylesheet",
        type: "text/css",
        href: "dist/css/framework7.ios.min.css"
      });
      css_link.appendTo('head');

      var css_cssespecifico = $("<link>", {
        rel: "stylesheet",
        type: "text/css",
        href: "css/css.ios.css"
      });
      css_cssespecifico.appendTo('head');

    }
    else if( userAgent.match( /Android/i ) )
    {

      //return 'Android';
      var css_link = $("<link>", {
        rel: "stylesheet",
        type: "text/css",
        href: "dist/css/framework7.material.min.css"
      });
      css_link.appendTo('head');

      var css_cssespecifico = $("<link>", {
        rel: "stylesheet",
        type: "text/css",
        href: "css/css.material.css"
      });
      css_cssespecifico.appendTo('head');
      
    }
    else
    {
      //return 'unknown';
      var css_link = $("<link>", {
        rel: "stylesheet",
        type: "text/css",
        //href: "dist/css/framework7.material.min.css"
        href: "dist/css/framework7.ios.min.css"
      });
      css_link.appendTo('head');


      var css_cssespecifico = $("<link>", {
        rel: "stylesheet",
        type: "text/css",
        //href: "css/css.material.css"
        href: "css/css.ios.css"
      });
      css_cssespecifico.appendTo('head');
      
    }
  }
  /*detect*/

  function getPlayas() {
    //console.log('getPlayas');
    $('#busqueda .list-block').append('<ul></ul>');
    $.ajax({
      url: direccion+'actions/593_getInfo.php',
      type: "POST",
      cache: false,
      dataType: "json",
      success: function(response){  
        
        if(response!=null && response!='' && response!='[]'){ 
          $.each(response,function(key,value){ 

            var valueToPush = { };
           
            valueToPush.id_playa = value.id_playa;
            valueToPush.nombre = value.nombre;
            valueToPush.slug = value.slug;
            valueToPush.pais = value.pais;
            valueToPush.nombrePais = value.nombre_pais;
            valueToPush.ciudad = value.ciudad;
            valueToPush.nombreCiudad = value.nombre_ciudad;
            valueToPush.provincia  = value.provincia ;
            valueToPush.nombreProvincia = value.nombre_provincia;
            valueToPush.calle = value.calle;
            valueToPush.mapa = value.mapa;
            valueToPush.status = value.status;
            valueToPush.descripcion = value.descripcion;
            valueToPush.foto = value.foto;

            _playas.push(valueToPush);
            localStorage.setItem("_playas", JSON.stringify(_playas));

            });
        }              
      },
      complete : function(data){
        
        //console.log(data);
        
      },
      error : function(error){     
          //alert(error);
      }
    });     
  }

  function cargoActividades(){
    console.log('cargoActividades');
    
    $.ajax({
      url: direccion+'actions/593_getActividades_1.php',
      type: "POST",
      cache: false,
      dataType: "json",
      success: function(response){  
        if(response!=null && response!='' && response!='[]'){ 
            $.each(response,function(key,value){ 
                var valueToPush = { };

                valueToPush.playa = value.playa;
                valueToPush.actividades = value.actividades;
                valueToPush.nombreActividad = value.nombreActividad;
                valueToPush.icono = value.icono;
                valueToPush.tipo = value.tipo;
                
                _actividades.push(valueToPush);
                //localStorage.setItem("_actividades", JSON.stringify(_actividades));
                localStorage.setItem("_actividades", _actividades);
                console.log(_actividades);
            });
        }              
      },
      complete : function(data){
        
        //console.log(data);
      },
      error : function(error){     
          console.log(error);
      }
    });
  }

/* ----------------------------------------------------------------------------------------------- */
/* CARGO DATOS PARA APP */
/* ----------------------------------------------------------------------------------------------- */

function playasOFFLine(){
  console.log('playasOFFLine');
  //[0] - id_playa
  //[1] - nombre
  //[2] - slug
  //[3] - pais
  //[4] - nombrePais
  //[5] - ciudad
  //[6] - nombreCiudad
  //[7] - provincia
  //[8] - nombreProvincia
  //[9] - calle
  //[10] - mapa
  //[11] - status
  //[12] - descripcion
  //[13] - foto
  
      _playas = JSON.parse(localStorage.getItem( '_playas'));
      for ( playa in _playas) {
        
        $('#busqueda .list-block ul').append('<li class="item-content" onclick="cargoDetalle('+_playas[playa].id_playa+');"><div class="item-inner"><div class="item-title">'+_playas[playa].slug+'</div><span class="item-title apago">'+_playas[playa].nombreCiudad+'</span><span class="item-title apago">'+_playas[playa].nombreProvincia+'</span></div></li>');
        
        if(_playas[playa].mapa){
              var valueToPush = { };

              valueToPush[0] = _playas[playa].id_playa;

              var mm = _playas[playa].mapa;
              var m = mm.split(",");

              valueToPush[1] =m[0];
              valueToPush[2] =m[1];
              valueToPush[3] = "2";
              
                      
             beaches.push(valueToPush);
             //console.log(beaches);
        }

        if(_playas[playa].foto){
           $('#playas .contenido').append('<div class="row playa playa-'+_playas[playa].id_playa+'" ><div class="col-50" onclick="cargoDetalle('+_playas[playa].id_playa+');"><figcaption>'+_playas[playa].slug+'</figcaption><img src="'+_playas[playa].foto+'" class="fotodestino" /></div><div class="col-50"><h5>Actividades</h5><div class="mActividades"></div><h5>Servicios</h5><div class="mServicios"></div></div><div class="rateStar"><div class="favoriteStar" onclick="toggle_visibility('+_playas[playa].id_playa+')" ><i class="fa fa-star fa-lg"></i></div></div></div>');
        }else{
           $('#playas .contenido').append('<div class="row playa playa-'+_playas[playa].id_playa+'" ><div class="col-50" onclick="cargoDetalle('+_playas[playa].id_playa+');"><figcaption>'+_playas[playa].slug+'</figcaption><img src="img/comodin.png" class="fotodestino" /></div><div class="col-50"><h5>Actividades</h5><div class="mActividades"></div><h5>Servicios</h5><div class="mServicios"></div></div><div class="rateStar"><div class="favoriteStar" onclick="toggle_visibility('+_playas[playa].id_playa+')" ><i class="fa fa-star fa-lg"></i></div></div></div>');
        }

        for ( actividad in _actividades) {
            
                if (_actividades[actividad].playa == _playas[playa].id_playa ){

                  
                  if ( _actividades[actividad].tipo == '1'){
                    
                    $('#playas .contenido .playa-'+_actividades[actividad].playa+' .mActividades').append('<div class="item item-actividades"><i class="fa '+  _actividades[actividad].icono  +'"></i></div>');
                  
                  }else{
                    //console.log('#playas .contenido .playa-'+_actividades[actividad].playa+' .mActividades');
                    $('#playas .contenido .playa-'+_actividades[actividad].playa+' .mServicios').append('<div class="item item-actividades"><i class="fa '+  _actividades[actividad].icono  +'"></i></div>');
                  
                  }
                  
            
                }
  
        }

      
        //default iconos.

          $('#playas .contenido .playa-'+_playas[playa].id_playa +' .mActividades').append('<div class="item item-actividades"><i class="fa icon-hospital"></i></div>');
          $('#playas .contenido .playa-'+_playas[playa].id_playa +' .mActividades').append('<div class="item item-actividades"><i class="fa icon-chiringo"></i></div>');
          $('#playas .contenido .playa-'+_playas[playa].id_playa +' .mActividades').append('<div class="item item-actividades"><i class="fa icon-tiendas"></i></div>');
          
          $('#playas .contenido .playa-'+_playas[playa].id_playa +' .mServicios').append('<div class="item item-actividades"><i class="fa icon-Kitesurf"></i></div>');
          $('#playas .contenido .playa-'+_playas[playa].id_playa +' .mServicios').append('<div class="item item-actividades"><i class="fa icon-avistamiento-aves"></i></div>');
          $('#playas .contenido .playa-'+_playas[playa].id_playa +' .mServicios').append('<div class="item item-actividades"><i class="fa icon-cabalgatas"></i></div>');
          

        }

        cargoFavoritos(); 
    
}

function cargoDetalle(argument){


    _playas = JSON.parse(localStorage.getItem( '_playas'));
    mainView.router.load({pageName: 'infoPlayas'});

    for ( playa in _playas) {
      if (_playas[playa].id_playa == argument ){
        //$('#infoPlayas .resultado > div').empty();
        $('#obPlaya > div').empty();
        $('#nameMapa > div').empty();
        //$('#infoPlayas .contenido').empty();
        $('#infoPlayas .informacion-lugar').empty();
        $('#infoPlayas .contenido .mActividades').empty();
        $('#infoPlayas .contenido .mServicios').empty();
        $('#infoPlayas .rated .stars i').removeClass('activo');

        
        $('#infoPlayas .rated').empty();



        //$('#infoPlayas .resultado > div').append(_playas[playa].slug);
        $('#obPlaya > div').append(_playas[playa].slug);
        $('#nameMapa > div').append(_playas[playa].slug);
        $('#infoPlayas .contenido').append('<div id="goMapa" onclick="cargoMapa('+_playas[playa].mapa+')"><span class="fa fa-map-marker fa-4x"></span></div>');
        $('#infoPlayas .informacion-lugar').append(_playas[playa].descripcion);

        var oldItems = localStorage.getItem('favoritos');
        var presto = oldItems.indexOf(argument);
        
        $('#infoPlayas .contenido article figure').empty();
        if(_playas[playa].foto){
            $('#infoPlayas .contenido article figure').append('<img src="'+_playas[playa].foto+'" />');
        }else{
            $('#infoPlayas .contenido article figure').append('<img src="img/comodin.png" />');
        }
        if (presto == -1){
          //oldItems.push(argument);
          $('#infoPlayas .rated').append('<div class="stars" onclick="toggle_visibility_inside('+_playas[playa].id_playa+')"><i class="fa fa-star"></i></div>');
          //$('#infoPlayas .rated .stars').attr('onclick',);
          //$('#infoPlayas .rated .stars i').removeClass('activo');
        }else{
          //$('#infoPlayas .rated .stars i').addClass('activo');
          $('#infoPlayas .rated').append('<div class="stars" onclick="toggle_visibility_inside('+_playas[playa].id_playa+')"><i class="fa fa-star activo"></i></div>');
        
        }

                for ( actividad in _actividades) {

            
                    //console.log(argument);
                    if (_actividades[actividad].playa == _playas[playa].id_playa ){

                      //console.log(_actividades[actividad].tipo);
                      if ( _actividades[actividad].tipo == '1'){
                        //console.log('#infoPlayas .contenido .mActividades');
                        $('#infoPlayas .contenido .mActividades').append('<div class="item item-actividades"><i class="fa '+  _actividades[actividad].icono  +'"></i></div>');
                      
                      }else{
                        //console.log('#infoPlayas .contenido .mServicios');
                        $('#infoPlayas .contenido .mServicios').append('<div class="item item-actividades"><i class="fa '+  _actividades[actividad].icono  +'"></i></div>');
                      
                      }
                      
                    } 
                    
                }


                        //default iconos.

          $('#infoPlayas .contenido .mActividades').append('<div class="item item-actividades"><i class="fa icon-hospital"></i></div>');
          $('#infoPlayas .contenido .mActividades').append('<div class="item item-actividades"><i class="fa icon-chiringo"></i></div>');
          $('#infoPlayas .contenido .mActividades').append('<div class="item item-actividades"><i class="fa icon-tiendas"></i></div>');
          //console.log(_playas[playa].id_playa);
          $('#infoPlayas .contenido .mServicios').append('<div class="item item-actividades"><i class="fa icon-Kitesurf"></i></div>');
          $('#infoPlayas .contenido .mServicios').append('<div class="item item-actividades"><i class="fa icon-avistamiento-aves"></i></div>');
          $('#infoPlayas .contenido .mServicios').append('<div class="item item-actividades"><i class="fa icon-cabalgatas"></i></div>');
          


      }
    } 


}

function guardoDatos(){
  nick = $('#nick').val();
  email = $('#email').val();
  pais = $('#pais').val();
  anio = $('#anio').val();
  
  var datos ={
      'nick': nick,
      'email': email,
      'pais': pais,
      'anio': anio,
      'foto': localStorage.getItem( '_imagenPerfil')
    }
    $.ajax({
      url: direccion+'actions/guardoRegistro.php',
      type: "POST",
      cache: true,
      dataType: "json",
      data: datos,
      success: function(response){  
        //alert(response); 
        mainView.router.load({pageName: 'playas', animatePages: false});
    
        var obj = response;
        
        localStorage.setItem('token', obj);
        localStorage.setItem('nickname', nick);

        perfilUsuario();

      },
      error : function(error){     
          //alert(error);
      }

    }); 
}

/*********************************************************************************************/
/*********************************************************************************************/

 

    $("input[type=file]").change(function(){
      var file = $("input[type=file]")[0].files[0];            
      $("#preview").empty();
      //$("button#chooseFile").css('display','none');
      $(".takePick input").css('display','none');
      $(".takePick").css('background','none');
      displayAsImage3(file, "preview");
      


    });

 function displayAsImage3(file, containerid) {
    if (typeof FileReader !== "undefined") {
      var container = document.getElementById(containerid),
          img = document.createElement("img"),
          reader;
      container.appendChild(img);

      reader = new FileReader();
      reader.onload = (function (theImg) {
        return function (evt) {
          theImg.src = evt.target.result;
          localStorage.setItem("_imagenPerfil", evt.target.result);
          //console.log(evt.target.result);
        };
      }(img));
      reader.readAsDataURL(file);
    }
  }


// Usage


/*********************************************************************************************/
/*********************************************************************************************/


function cargoMapa(argument1, argument2){
  //alert(argument1 +' - '+argument2);
  console.log(argument1+ '-' +argument2);
  mainView.router.load({pageName: 'mapa'});

     var content = document.getElementById("geolocation-test");

      if (navigator.geolocation)
      {
        navigator.geolocation.getCurrentPosition(function(objPosition)
        {
          lon = objPosition.coords.longitude;
          lat = objPosition.coords.latitude;

          console.log(lat +', '+lon);
          console.log(parseFloat(argument1)+', '+parseFloat(argument2));


            var directionsDisplay = new google.maps.DirectionsRenderer();
            var directionsService = new google.maps.DirectionsService();
          
          var request = {
               origin: lat +', '+lon,
               destination: parseFloat(argument1)+', '+parseFloat(argument2),
               travelMode: google.maps.DirectionsTravelMode["DRIVING"],
               unitSystem: google.maps.DirectionsUnitSystem["METRIC"],
               provideRouteAlternatives: true
           };

           var map = new google.maps.Map(document.getElementById('map'), {
              zoom: 12
            });

           directionsService.route(request, function(response, status) {
              if (status == google.maps.DirectionsStatus.OK) {
                  directionsDisplay.setMap(map);
                  directionsDisplay.setPanel($("#map_canvas").get(0));
                  directionsDisplay.setDirections(response);
              } else {
                  alert("No existen rutas entre ambos puntos");
              }
          });

           var userAgent = navigator.userAgent || navigator.vendor || window.opera;

            if( userAgent.match( /iPad/i ) || userAgent.match( /iPhone/i ) || userAgent.match( /iPod/i ) )
            {
              $('#map').css('height',screen.height);
            }
          

        
        }, function(objPositionError)
        {
          switch (objPositionError.code)
          {
            case objPositionError.PERMISSION_DENIED:
              content.innerHTML = "No se ha permitido el acceso a la posición del usuario.";
            break;
            case objPositionError.POSITION_UNAVAILABLE:
              content.innerHTML = "No se ha podido acceder a la información de su posición.";
            break;
            case objPositionError.TIMEOUT:
              content.innerHTML = "El servicio ha tardado demasiado tiempo en responder.";
            break;
            default:
              content.innerHTML = "Error desconocido.";
          }
        }, {
          maximumAge: 75000,
          timeout: 15000
        });
      }
      else
      {
        content.innerHTML = "Su navegador no soporta la API de geolocalización.";
      }
}


function misPlayas(){
  $('#misplayas .contenido').empty();
  var favRate = JSON.parse(localStorage.getItem( 'favoritos') );
   for (var x=0; x<=favRate.length-1; x++)  {  
      $('.playa-'+favRate[x]+' i').addClass('activo');

      for (var p=0; p<=_playas.length-1; p++)  { 
         if(_playas[p].id_playa == favRate[x]){
            if(_playas[p].foto){
              $('#misplayas .contenido').append('<div class="col-50 playa playa-'+_playas[p].id_playa+' " ><div onclick="cargoDetalle('+_playas[p].id_playa+');"><figcaption>'+_playas[p].slug+'</figcaption><img src="'+_playas[p].foto+'" class="fotodestino" /></figure></div></div>');
            }else{
              $('#misplayas .contenido').append('<div class="col-50 playa playa-'+_playas[p].id_playa+' " ><div onclick="cargoDetalle('+_playas[p].id_playa+');"><figcaption>'+_playas[p].slug+'</figcaption><img src="img/comodin.png" class="fotodestino" /></figure></div></div>');
            }
         }
        
      }
  }
}

function rate(argument){



  var oldItems = JSON.parse(localStorage.getItem('favoritos')) || [];
  var presto = oldItems.indexOf(argument);
  if (presto == 0){

  }else{
    oldItems.push(argument);
  }

  localStorage.setItem('favoritos', JSON.stringify(eliminateDuplicates(oldItems)));
  var favRate = JSON.parse(localStorage.getItem( 'favoritos') );
   for (x=0; x<=favRate.length-1; x++)  {  
      $('.playa-'+favRate[x]+' i').addClass('activo');
  }

}

function cargoFavoritos(){
  console.log('cargoFavoritos');
  var favRate = JSON.parse(localStorage.getItem( 'favoritos') );
   for (x=0; x<=favRate.length-1; x++)  {  
      $('.playa-'+favRate[x]+' i').addClass('activo');
  }
}

function eliminateDuplicates(arr) {
 var i,
     len=arr.length,
     out=[],
     obj={};

 for (i=0;i<len;i++) {
    obj[arr[i]]=0;
 }
 for (i in obj) {
    out.push(i);
 }
 return out;
}

function perfilUsuario(){

  //clean
  $('.perfil .imagen').empty();
  $('.perfil .nickname').empty();

  localStorage.getItem( '_imagenPerfil');
  localStorage.getItem( 'nickname');
        var perfil = localStorage.getItem( '_imagenPerfil');
        var usuario = localStorage.getItem( 'nickname');
        $('.perfil .imagen').append('<img src="'+ perfil +'" /> ');
        $('.perfil .nickname').append(usuario);
}