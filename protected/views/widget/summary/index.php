<?php
$obj = json_encode($obj);
if ($callback !== false) {
	echo "$callback($obj)";
} else {
	echo $obj;
}
