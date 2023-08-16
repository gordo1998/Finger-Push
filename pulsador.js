var nombreUsuario = "";


//Creamos una variable con la que controlaremos si el usuario existe o quiere crearse un nuevo usuario. Estará
//en falso por defecto ya que cuando se acceda a la aplicación el usuario ha de especificar el crear nuevo usuario si no
//lo tiene
estado = false;
//Si no ha habido 

//Esta funcion cambia el valor de estado a verdadero. A partir de aquí el dato de usuario será tratado en la base de datos
//como que quiere consultar e ingresar un nuevo usuario
$("#crear-user").click(function(){
    estado = true;
});

//Esta funcion se ejecutará cuando el usuario clique al botón de enviar
$("#enviar").click(ajaxUsuario);

function ajaxUsuario(){
    //En primera instancia cogemos el valor del input
    nombreUsuario = $("#escribir").val();
    //El valor tiene que ser distinto a vacío para que se puedan tratar los datos
    if(nombreUsuario == ""){
        $("#mensaje-error").text("El nombre de usuario no puede estar vacío");
    }else{
        //Si el valor de la variable estado es verdadero
        console.log(estado);
        if (estado){
            $.ajax({
                type: "POST",
                url: "logica.php",
                dataType: "json",
                data: {"usuario": nombreUsuario, "h" : 0, "estado" : estado},
                success: function(resJSONUno){
                    if (resJSONUno.segunda != ""){
                        $("#mensaje-error").text(resJSONUno.segunda);
                    }else{
                        startGame();
                    }
                },
                error: function(xhr, status, error){
                    console.log("Error en la solicitud de AJAX: ", error);
                }
            });
        }else{
            //Si el valor de la variable es falso
            $.ajax({
                type: "POST",
                url: "logica.php",
                dataType: "json",
                data: {"usuario": nombreUsuario, "h" : 0, "estado" : estado},
                success: function(resJSON){
                    console.log(resJSON.respuesta);
                    if (resJSON.respuesta != ""){
                        $("#mensaje-error").text(resJSON.respuesta);
                    }else{
                        startGame();
                    }
                },
                error: function(xhr, status, error){
                    console.log("Error en la solicitud AJAX: ", error);
                }
            });
        }
        
    }
}

function startGame(){
    $("#numero-pulsaciones").text("0");
    $("#start").text("Start");
    $("#pulsador").text("Pulsa");
    $("#contenido").text("10");
    $("body").css("backgroundColor", "#4cc9f0");
    $("#poner-user").css({"display" : "none"});
    $("#juego").css({"display" : "flex", "marginTop" : "70px"});
    puntuacionInicio();
}

//Las pulsaciones empiezan en 0
var pulsaciones = 0;
//Servirá para determinar si el contador esta activo o no
var estadoContador = false;
var puntuacionFinal;

//Esta función de aquí pertenece al juego principal, lo que viene siendo el pulsador
$("#start").click(empezar);
function empezar(){
    if (!estadoContador){
        //Le damos sonido al boton de empezar
        var pulsarStart = document.getElementById("boton-empezar");
        pulsarStart.play();

        estadoContador = true;
        pulsaciones = 0;
        $("#numero-pulsaciones").text(pulsaciones);
        $("#pulsador").click(clics);
        //El contador empieza en el entero 10
        var contador = 10;
        //Creamos el cronómetro interno y creamos las ordenes a obedecer dentro de ese plazo
        var contadorAtras = setInterval(function(){
            //Por cada segundo restaremos el numero contador que se imprimirá en la pantalla
            contador--;
            $("#contenido").text(contador);
        
            if (contador <= 0){
                //limpiamos el contador
                clearInterval(contadorAtras);
                //se deshabilita el click en el boton
                $("#pulsador").off("click");
                estadoContador = false;
                puntuacionFinal = pulsaciones;
                ajax();
            }
        }, 1000);
    }


    
}
//Esta funcion imprime la cantidad de pulsaciones por pantalla
function clics(){
    var pulsarBoton = document.getElementById("boton-pulsar");
    pulsarBoton.pause();
    pulsarBoton.currentTime = 0;
    pulsarBoton.play();
    pulsaciones++;
    $("#numero-pulsaciones").text(pulsaciones);
    
}
//Esta función manda envia las pulsaciones al PHP para gestionar la información
function ajax(){
    $.ajax({
        type: "POST",
        url: "logica.php",
        data: {"pulsaciones": puntuacionFinal, "h" : 1, "usuario" : nombreUsuario},
        dataType: "json",
        success: function(resJSONTWO){
            $("#record-puntos > div:first-child").text(resJSONTWO.respuestaPulsaciones);
            if (puntuacionFinal == resJSONTWO.respuestaPulsaciones){
                $("body").css({"backgroundImage" : "url('giff/confetti-25.gif')"});
                var nuevoRecord = document.getElementById("nuevo-record");
                nuevoRecord.play();
                setTimeout(function(){
                    $("body").css("backgroundImage", "none");
                }, 3000)
                
            }
        },
        error: function(xhr, status, error){
            console.log("Error en la solicitud de pulsar AJAX: ", error);
        }
    });
}

function puntuacionInicio(){
    $.ajax({
        type: "POST",
        url: "logica.php",
        dataType: "json",
        data: {"h" : 2, "usuario" : nombreUsuario},
        success: function (resjson){
            $("#record-puntos > div:first-child").text(resjson.puntuacionInicial);
        },
        error: function (xhr, status, error){
            console.log("Error en la peticion AJAX: ", error);
        }
    });
}









