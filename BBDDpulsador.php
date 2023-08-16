<?php


function conexionBD(){
    $usuario = "root";
    $contrasena = "J.barreda98";
    try{
        $conexion = new PDO('mysql:host=localhost;dbname=pulsador', $usuario, $contrasena);
        return $conexion;
    }catch (PDOException $e){
        echo "Conexión no realizada con éxito: " . $e->getMessage();   
    }
}

function insert($conect, $table, $value){
    try{
        $conect->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $sentencia = "INSERT INTO $table (usuario, cantidad) VALUES (:usuario, 0)";
        $putValues = $conect->prepare($sentencia);
        $putValues->bindParam(":usuario", $value);
        if ($putValues->execute()){
            return true;
        }
    }catch(PDOException $e){
        return false;
    }
}

function select($conect, $table, $value){
    try {
        $conect->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $sentencia = "SELECT usuario FROM $table WHERE usuario = :usuario";
        $preparando = $conect->prepare($sentencia);
        $preparando->bindParam(":usuario", $value);
        $preparando->execute();
        $usuarioExistente = $preparando->fetchColumn();
        if($usuarioExistente > 0){
            return true;
        }else{
            return false;
        }
    }catch(PDOException $e){
        echo "No se ha podido realizar la selección";
    }
}

function selectPulsaciones($conect, $table, $value){
    $numeroPulsciones = 0;
    try{
        $conect->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $sentencia = "SELECT cantidad FROM $table WHERE usuario = :user";
        $preparar = $conect->prepare($sentencia);
        $preparar->bindParam(":user", $value);
        $preparar->execute();
        while($row = $preparar->fetch(PDO::FETCH_ASSOC)){
            $numeroPulsciones = $row['cantidad'];
        }
        return $numeroPulsciones;
    }catch(PDOException $e){
        return $e;
    }
}

function insertPulsaciones($conect, $table, $valuePulsaciones, $user){
    try{
        $conect->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $sentencia = "UPDATE $table SET cantidad = :valuePulsaciones WHERE usuario = :user";
        $consulta = $conect->prepare($sentencia);
        $consulta->bindParam(":valuePulsaciones", $valuePulsaciones);
        $consulta->bindParam(":user", $user);
        $consulta->execute();
        return true;
    }catch(PDOException $e){
        $mensaje = "Errorcillo: " . $e;
        return $mensaje;
    }
}
?>