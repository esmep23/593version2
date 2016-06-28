var direccion = "http://pocket.ec/dev/beach_593/";
var _playas = new Array();
var _actividades = new Array();
var _servicios = new Array();
var _detallePlaya = new Array();
var _provincias  = new Array();
var _actividadesyServicios  = new Array();
var favoritos;
var map;
var onSearch = false; //toggle
var value = localStorage.getItem('token');
var beaches = new Array();
var lon;
var lat;
var found;



$( document ).ready(function() {

  //sizeWindows();
  playasOFFLine();
  perfilUsuario();
  
  provincia();
  actividadesYservicios();
  

  if (localStorage.getItem("favoritos") === null) {
    localStorage.setItem( 'favoritos', "0" );
  }


mainView.hideNavbar();

/*
  if($('.page-on-center').attr('id') == 'home'){
    mainView.hideNavbar();
  }else{
     mainView.showNavbar();
  }
*/

  myApp.onPageInit('registro', function (page) {
    mainView.hideNavbar();
    for (var i = 14; i < 100; i++) {
      $('#anio').append('<option value="'+i+'">'+i+'</option>');
    } 

  });
  


  
/*
  myApp.onPageInit('playas', function (page) {

    //myApp.openPanel('left'); //abro menu
    setTimeout(function(){ 
      playasOFFLine();

    }, 1000);
   
  });


  myApp.onPageBeforeInit('index', function (page) {
      
      $( "#home_provincias" ).change(function() {
         $('#buscador').val('');
      });

      $( "#home_actividades" ).change(function() {
         $('#buscador').val('');
      });

      $( "#home_servicios" ).change(function() {
         $('#buscador').val('');
      });

      

  });

*/
  myApp.onPageBeforeAnimation('busqueda', function (page) {
    mainView.showNavbar();
  });

  myApp.onPageBeforeAnimation('misplayas', function (page) {
    misPlayas();
    mainView.showNavbar();
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
    //mainView.router.load({pageName: 'playas', animatePages: false});
    mainView.router.load({pageName: 'home', animatePages: false});
      
  }else{
    //alert('NO TENGO');  
     mainView.router.load({pageName: 'registro', animatePages: false});
  }


  $( "#home_provincias" ).change(function() {
     $('#buscador').val('');
  });

  $( "#home_actividades" ).change(function() {
     $('#buscador').val('');
  });

  $( "#home_servicios" ).change(function() {
     $('#buscador').val('');
  });


  $("input[id=buscador]").click(function(){    
      $( "#home_provincias" ).val('0');
      $( "#home_actividades" ).val('0');
      $( "#home_servicios" ).val('0');
  });

  window.addEventListener("keypress", function(event){
      if (event.keyCode == 13){
          event.preventDefault();
      }
  }, false);

  

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

        //console.log('-----------------------------------------------------------------------------------------------------------');

     

        //localStorage.setItem('favoritos', JSON.stringify(array));

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

        //console.log('-----------------------------------------------------------------------------------------------------------');

       

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
    console.log('getPlayas');
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
       

            //console.log('=============================================');
            //console.log(typeof _playas);
            //console.log(_playas);
            //console.log(valueToPush);
            _playas.push(valueToPush);
            localStorage.setItem("_playas", JSON.stringify(_playas));
            //console.log(3);

            });
        }              
      },
      complete : function(data){
        
        console.log(data);
        
      },
      error : function(error){     
        alert(error);
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
                localStorage.setItem("_actividades", JSON.stringify(_actividades));
                //localStorage.setItem("_actividades", _actividades);
                //console.log(_actividades);
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
      //_playas.push(JSON.parse(localStorage.getItem( '_playas')));
      
      for ( playa in _playas) {
        
        //$('#busqueda .list-block ul').append('<li class="item-content" onclick="cargoDetalle('+_playas[0]+');"><div class="item-inner"><div class="item-title">'+_playas[playa].slug+'</div><span class="item-title apago">'+_playas[playa].nombreCiudad+'</span><span class="item-title apago">'+_playas[playa].nombreProvincia+'</span></div></li>');
        
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

        //cargoFavoritos(); 
    
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
        mainView.router.load({pageName: 'home', animatePages: false});
    
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

function provincia(){
  //console.log('cargoProvincia');
    
    $.ajax({
      url: direccion+'actions/593_getProvincias.php',
      type: "POST",
      cache: false,
      dataType: "json",
      success: function(response){  
        if(response!=null && response!='' && response!='[]'){ 
            $.each(response,function(key,value){ 
                
                id = value.id;
                provincia = value.provincia;

                
                $('#home_provincias').append('<option value="'+id+'">'+provincia+'</option>');
                
            });
        }              
      },
      complete : function(data){
        console.log(data);
      },
      error : function(error){     
        console.log(error);
      }
    });
}



  function actividadesYservicios(){
    console.log('cargoactividadesYservicios');
    
    $.ajax({
      url: direccion+'actions/593_getActividades_2.php',
      type: "POST",
      cache: false,
      dataType: "json",
      success: function(response){  
        if(response!=null && response!='' && response!='[]'){ 
            $.each(response,function(key,value){ 
                
                id = value.id;
                nombre = value.nombre;
                tipo = value.tipo;

                if(tipo == '1'){
                  $('#home_actividades').append('<option value="'+id+'">'+nombre+'</option>');
                }else{
                  $('#home_servicios').append('<option value="'+id+'">'+nombre+'</option>');
                }
                
               
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

function busqueda(){
  
  //$('#buscador').val();
  var nMBuscar = $('#buscador').val();
  if(nMBuscar != ''){
      //busqueda coincidencia de texto en nombre

      var nameBeach = new Array();
      var idBeach = new Array();
      var miBusqueda = new Array();
    
      for ( playa in _playas) {
        nameBeach.push(_playas[playa].nombre);
        idBeach.push(_playas[playa].id_playa);
        
      }

        var i = 0
        nameBeach.forEach(function(entry) {
           
           var x = entry.toLowerCase().indexOf(nMBuscar.toLowerCase());
           
           if(x != -1 ){
            //alert(entry +' - '+ nameBeach[i] +' - '+ idBeach[i]);
            miBusqueda.push(idBeach[i]);
           }

           i++

        });

        if (miBusqueda === undefined || miBusqueda.length == 0) {
          
          myApp.alert('Lo sentimos, vuelve a intentarlo. No encontramos coincidencia.', '593-Playas');
          $('#buscador').val("");
        

        }else{
          cargoBusqueda(miBusqueda);
        }
        
              

  }else{

    var prov = 0;
    var act = 0;
    var serv = 0;
    var cuant = 0;

      //busqueda con filtro
      $( "#home_provincias" ).val();
      $( "#home_actividades" ).val();
      $( "#home_servicios" ).val();

      if($( "#home_provincias" ).val() != 0) {
        prov = prov + 1;
        //alert( $( "#home_provincias" ).val() );
        cuant = cuant + 1; 
      }

      if($( "#home_actividades" ).val() != 0) {
        act = act + 1;
        //alert( $( "#home_actividades" ).val() );
        cuant = cuant + 1; 
      }

      if($( "#home_servicios" ).val() != 0) {
        serv = serv + 1;
        //alert( $( "#home_servicios" ).val() );
        cuant = cuant + 1; 
      }
      


      if( (act == 0) && (serv == 0) ){
        // hago provincia

        var miBusquedaProvincia = new Array();

          for ( playa in _playas) {
            //filtro 1
            if( _playas[playa].provincia == $( "#home_provincias" ).val() ){
                miBusquedaProvincia.push(_playas[playa].id_playa);
            }
          }
        
        if (miBusquedaProvincia === undefined || miBusquedaProvincia.length == 0) {
           if(cuant != 0){
              myApp.alert('Lo sentimos, vuelve a intentarlo. No encontramos coincidencia.', '593-Playas');
              cuant = 0;
              return
            }


        }else{
            cargoBusqueda(miBusquedaProvincia);
            
        }


      }

      if( (prov == 0) && (serv == 0) ){
        // hago actividad

            var miBusquedaActividades = new Array();

            for ( actividad in _actividades) {
              //filtro 2
              if( ( _actividades[actividad].actividades == $( "#home_actividades" ).val() ) && (_actividades[actividad].tipo == '1' ) ){
                  miBusquedaActividades.push(_actividades[actividad].playa);
                  //alert('filtroA '+);
              }

            }
            
            if (miBusquedaActividades === undefined || miBusquedaActividades.length == 0) {

               if(cuant != 0){
               myApp.alert('Lo sentimos, vuelve a intentarlo. No encontramos coincidencia.', '593-Playas');
                cuant = 0;
                return
              }

            }else{
                cargoBusqueda(miBusquedaActividades);
                
            }

      }

      if( (prov == 0) && (act == 0) ){
        // hago servicio

        for ( actividad in _actividades) {
            
            //filtro 3
            if( ( _actividades[actividad].actividades == $( "#home_servicios" ).val() ) && (_actividades[actividad].tipo == '2' ) ){
                miBusquedaActividades.push(_actividades[actividad].playa);
            }

          }
      }


      if(cuant == 3){
        //hago toodod
          var miBusquedaActividades = new Array();
          var miBusquedaProvincia = new Array();

          for ( playa in _playas) {
            //filtro 1
            if( _playas[playa].provincia == $( "#home_provincias" ).val() ){
                miBusquedaProvincia.push(_playas[playa].id_playa);
            }
          }
         
         //console.log(miBusquedaProvincia);
         //console.log('----------------------------------------------------------------------------------');

          for ( actividad in _actividades) {
            //filtro 2
            if( ( _actividades[actividad].actividades == $( "#home_actividades" ).val() ) && (_actividades[actividad].tipo == '1' ) ){
                miBusquedaActividades.push(_actividades[actividad].playa);
                //alert('filtroA '+);
            }
            //filtro 3
            if( ( _actividades[actividad].actividades == $( "#home_servicios" ).val() ) && (_actividades[actividad].tipo == '2' ) ){
                miBusquedaActividades.push(_actividades[actividad].playa);
            }

          }
         
         //console.log(miBusquedaActividades);

          var ceroActividades = find_duplicates(miBusquedaActividades);
          //console.log(ceroActividades);
          ceroActividades.toString();
          miBusquedaProvincia.toString();

          var miBusqueda = ceroActividades.concat(miBusquedaProvincia);
          console.log(miBusqueda);

          found = find_duplicates(miBusqueda);
          console.log(found);
          

          if (found === undefined || found.length == 0) {

            if(cuant != 0){
               myApp.alert('Lo sentimos, vuelve a intentarlo. No encontramos coincidencia.', '593-Playas');
              cuant = 0;
              return
            }

          }else{
            cargoBusqueda(found);
          }
      }


      if(cuant == 0){

         myApp.alert('Seleccione un metodo de busqueda por favor', '593-Playas');

        return
      }
      console.log(cuant);
      cuant = 0;
      
  } // else
}

function find_duplicates(arr) {
//ejemplo - find_duplicates(['one',2,3,4,4,4,5,6,7,7,7,'pig','one']); // -> ['one',4,7] in no particular orde
  var len=arr.length,
      out=[],
      counts={};

  for (var i=0;i<len;i++) {
    var item = arr[i];
    var count = counts[item];
    counts[item] = counts[item] >= 1 ? counts[item] + 1 : 1;
  }

  for (var item in counts) {
    if(counts[item] > 1)
      out.push(item);
  }

  return out;
}


function cargoBusqueda(_argument){
  //alert(_argument);
  $('#busqueda .contenido').empty();
  if (_argument === undefined || _argument.length == 0) {
    // empty

    myApp.alert('Seleccione un metodo de busqueda por favor', '593-Playas');
    return

  } else {
    _argument.forEach(function(_entry) {

      for ( playa in _playas) {

        if (_playas[playa].id_playa == _entry ){
           

            if(_playas[playa].foto){
               $('#busqueda .contenido').append('<div class="row playa playa-'+_playas[playa].id_playa+'" ><div class="col-50" onclick="cargoDetalle('+_playas[playa].id_playa+');"><figcaption>'+_playas[playa].slug+'</figcaption><img src="'+_playas[playa].foto+'" class="fotodestino" /></div><div class="col-50"><h5>Actividades</h5><div class="mActividades"></div><h5>Servicios</h5><div class="mServicios"></div></div><div class="rateStar"><div class="favoriteStar" onclick="toggle_visibility('+_playas[playa].id_playa+')" ><i class="fa fa-star fa-lg"></i></div></div></div>');
            }else{
               $('#busqueda .contenido').append('<div class="row playa playa-'+_playas[playa].id_playa+'" ><div class="col-50" onclick="cargoDetalle('+_playas[playa].id_playa+');"><figcaption>'+_playas[playa].slug+'</figcaption><img src="img/comodin.png" class="fotodestino" /></div><div class="col-50"><h5>Actividades</h5><div class="mActividades"></div><h5>Servicios</h5><div class="mServicios"></div></div><div class="rateStar"><div class="favoriteStar" onclick="toggle_visibility('+_playas[playa].id_playa+')" ><i class="fa fa-star fa-lg"></i></div></div></div>');
            }

            for ( actividad in _actividades) {
                
                    if (_actividades[actividad].playa == _playas[playa].id_playa ){

                      
                      if ( _actividades[actividad].tipo == '1'){
                        
                        $('#busqueda .contenido .playa-'+_actividades[actividad].playa+' .mActividades').append('<div class="item item-actividades"><i class="fa '+  _actividades[actividad].icono  +'"></i></div>');
                      
                      }else{
                        $('#busqueda .contenido .playa-'+_actividades[actividad].playa+' .mServicios').append('<div class="item item-actividades"><i class="fa '+  _actividades[actividad].icono  +'"></i></div>');
                      
                      }
                      
                
                    }
      
            }

          
        }
      } //for

    });

      mainView.router.load({pageName: 'busqueda', animatePages: false});

  } //else

}
//

function regresaHome(){

  mainView.hideNavbar();
  mainView.router.load({pageName: 'home', animatePages: false});



}  