<?php

$data = json_decode(file_get_contents('php://input'), true);

if (isset($data['search']) && isset($data['num'])) {

    $search = $data['search'];
    $numResults = $data['num'];

    $username = 'root';
    $password = '';
    $dbname = 'audax';
    $host = '127.0.0.1:3360';

    try {
        $connect = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);

        $sql = "INSERT INTO historical (search, numResults) VALUES (:search, :numResults)";
        $prepare = $connect->prepare($sql);
        
        $prepare->bindParam(':search', $search);
        $prepare->bindParam(':numResults', $numResults);
        
        $prepare->execute();
        echo json_encode(array(''));
        $connect = null;

    } catch (PDOException $ex) {
        $connect = null;
        echo json_encode(array("error" => "Error de conexión: " . $ex->getMessage()));

    }

} else {

    echo "Faltan valores por recibir";
}

?>