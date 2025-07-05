<?php
<?php
$data = json_decode(file_get_contents('php://input'), true);
if ($data && isset($data['username']) && isset($data['password'])) {
    $line = $data['time'] . "," . $data['username'] . "," . $data['password'] . "\n";
    file_put_contents("C:\Users\PHOENIX\Desktop\Namma Pasaga Site\users_db.csv", $line, FILE_APPEND);
    echo "OK";
} else {
    http_response_code(400);
    echo "Invalid";
}
?>
fetch('additional function.php', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username, password, time: new Date().toISOString() })
});