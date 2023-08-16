<?php

include("BBDDpulsador.php");

$conect = conexionBD();
$respuesta = "";

if (isset($_POST["h"])){
    $h = $_POST["h"];
    if ($h == 0){
        $usuario = $_POST["usuario"];
        $estado = filter_var($_POST["estado"], FILTER_VALIDATE_BOOLEAN);
        $resultado = [];

        

        if($estado){
            //Aquí irá otro código
            if(select($conect, "puls", $usuario)){
                $respuesta = "El usuario ya existe!!";
            }else{
                if(insert($conect, "puls", $usuario)){
                    //nada
                    $respuesta = "";
                }else{
                    $respuesta = "Ha ocurrido un error, contacte con el Servidor!";
                }
            }
            $resultado['segunda'] = $respuesta;
            echo json_encode($resultado);
        }else {
            if(!select($conect, "puls", $usuario)){
                $respuesta = "El usuario no existe!!";
            }


            $resultado['respuesta'] = $respuesta;
            echo json_encode($resultado);

        }

    }else if ($h == 1){
        $pulsaciones = intval($_POST["pulsaciones"]);
        $user = $_POST['usuario'];

        if (selectPulsaciones($conect, "puls", $user) >= $pulsaciones){
            $respuesta = selectPulsaciones($conect, "puls", $user);
        }else{
            if(insertPulsaciones($conect, "puls", $pulsaciones, $user)){
                $respuesta = $pulsaciones;
            }else{
                $respuesta = insertPulsaciones($conect, "puls", $pulsaciones, $user);
            }
        }
        $resultado['respuestaPulsaciones'] = $respuesta;
        echo json_encode($resultado);
    }else if ($h == 2){
        $user = $_POST['usuario'];

        /*
        if (!selectPulsaciones($conect, "puls", $user)){
            $respuesta = "Halgo ha ido mal";
        }else{
        }
        */
        $respuesta = selectPulsaciones($conect, "puls", $user);


        $resultado['puntuacionInicial'] = $respuesta;
        echo json_encode($resultado);
    }

}



?>