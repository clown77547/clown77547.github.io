<?php

$recepient = "Vbrrb3223@gmail.com";

$phone = trim($_POST["phone"]);
$message = "Телефон: $phone";

$pagetitle = "Заявка";
mail($recepient, $pagetitle, $message, "Content-type: text/plain; charset=\"utf-8\"\n From: $recepient");

?>  