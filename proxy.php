<?php
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");

    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
        header('HTTP/1.1 200 OK');
        exit;
    }

    $urls = ["https://api.genius.com/search?q=".urlencode($_GET['name']), "https://api.genius.com/search?q=".urlencode($_GET['name'])];
    $artists = $_GET["artists"];
    foreach($artists as $artist)
        $urls[0] .= urlencode(" $artist");
    $accessToken = "secret";
    $responses = [];

    for($i = 0; $i < 2; $i++){
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $urls[$i]);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            "Authorization: Bearer $accessToken"
        ]);

        $response = curl_exec($ch);
        curl_close($ch);

        if (curl_getinfo($ch, CURLINFO_HTTP_CODE) == 200)
            $responses[$i] = json_decode($response);
    }
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(["precise" => $responses[0], "broad" => $responses[1]]);
?>
