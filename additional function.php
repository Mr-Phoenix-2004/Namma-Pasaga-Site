<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
<?php
composer require phpoffice/phpspreadsheet
$data = json_decode(file_get_contents('php://input'), true);
if ($data && isset($data['username']) && isset($data['password'])) {
    $line = $data['time'] . "," . $data['username'] . "," . $data['password'] . "\n";
    file_put_contents("https://1drv.ms/x/c/2c3e1ceb46b18dcf/EQ7noXi8jMFHss4pBs19r38B47FWobML7v1jMj-nOkepCQ?e=gBrdbY&nav=MTVfe0I1MTVENzE2LTU2RDEtNDU2My05RkJBLUQ4RDc2QTU3OEQ0MX0", $line, FILE_APPEND);
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
require 'vendor/autoload.php';
use PhpOffice\PhpSpreadsheet\IOFactory;

function checkLogin($username, $password) {
    $spreadsheet = IOFactory::load('User_DataBase.xlsx');
    $sheet = $spreadsheet->getActiveSheet();
    foreach ($sheet->getRowIterator() as $row) {
        $cells = $row->getCellIterator();
        $cells->setIterateOnlyExistingCells(false);
        $user = $cells->current()->getValue();
        $cells->next();
        $pass = $cells->current()->getValue();
        if ($user === $username && $pass === $password) {
            return true;
        }
    }
    return false;
}
function addUser($username, $password) {
    $spreadsheet = IOFactory::load('User_DataBase.xlsx');
    $sheet = $spreadsheet->getActiveSheet();
    $highestRow = $sheet->getHighestRow() + 1;
    $sheet->setCellValue('A' . $highestRow, $username);
    $sheet->setCellValue('B' . $highestRow, $password);
    $writer = IOFactory::createWriter($spreadsheet, 'xlsx');
    $writer->save('User_DataBase.xlsx');
}
function getUserData($username) {
    $spreadsheet = IOFactory::load('User_DataBase.xlsx');
    $sheet = $spreadsheet->getActiveSheet();
    foreach ($sheet->getRowIterator() as $row) {
        $cells = iterator_to_array($row->getCellIterator());
        if ($cells[0]->getValue() === $username) {
            return [
                "wishlist" => $cells[2]->getValue(),
                "cart" => $cells[3]->getValue()
            ];
        }
    }
    return null;
}
function updateUserData($username, $wishlist, $cart) {
    $spreadsheet = IOFactory::load('User_DataBase.xlsx');
    $sheet = $spreadsheet->getActiveSheet();
    foreach ($sheet->getRowIterator() as $row) {
        $cells = iterator_to_array($row->getCellIterator());
        if ($cells[0]->getValue() === $username) {
            $cells[2]->setValue($wishlist);
            $cells[3]->setValue($cart);
            $writer = IOFactory::createWriter($spreadsheet, 'xlsx');
            $writer->save('User_DataBase.xlsx');
            return true;
        }
    }
    return false;
}
require 'vendor/autoload.php';
echo $user . " | " . $pass . "<br>";
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL
);
