// Marc Gray's PHP script (untested by us)
// use at your discretion
<?php
$page = file_get_contents('http://www.zytrax.com/tech/web/mobile_ids.html');
preg_match_all('/<(p) class="g-c-[ns]"[^>]*>(.*?)<\/p>/s', $page, $m); 

$agents = array();
foreach($m[2] as $agent) {
  $split = explode("\n", trim($agent));
  foreach($split as $item) {
    $agents[] = trim($item);
  }
}
// $agents now holds every user agent string, one per array index, trimmed
foreach($agents as $agent) {
 echo($agent."\n");
}

?>