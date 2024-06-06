<?php

$username = 'root';
$password = '';
$dbname = 'audax';
$host = '127.0.0.1:3360';

try {
    $connect = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);

    $prepare = $connect->prepare("SELECT * FROM historical ORDER BY timestamp DESC");
    $prepare->execute();
    $results = $prepare->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($results);
    $connect = null;

} catch (PDOException $ex) {
    $connect = null;
    echo json_encode(array("error" => "Error de conexión: " . $ex->getMessage()));
}

?>