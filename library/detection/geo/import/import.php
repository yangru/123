<?php
mb_internal_encoding("UTF-8");
define('MYSQL_HOST', '192.168.10.4');
define('MYSQL_USER', 'root');
define('MYSQL_PASSWORD', '80eef62460');
define('MYSQL_DB', 'ip_test');

mysql_connect(MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD);
mysql_select_db(MYSQL_DB);
mysql_query('set names utf8');
$result = mysql_query('create index tmp_index0 on conf_location(country_code, region_code);');
$result = mysql_query('create index tmp_index1 on conf_location(country_name);');
$result = mysql_query('create index tmp_index2 on conf_location(country);');
$result = mysql_query('create index tmp_index3 on conf_location(region);');
$result = mysql_query('create index tmp_index4 on conf_location(city);');
$result = mysql_query('create index tmp_index5 on conf_location(country_code, region_name_cn);');
echo "begin!\n";

// country_name/country_name_cn
// 根据country_code_name.svn和country_code_cn填充country_name, country_name_cn 两列
require_once(dirname(__FILE__) . '/require/country_code_cn.php');
$lines = explode("\n", file_get_contents(dirname(__FILE__) . '/../data/country_code_name.csv'));
foreach ($lines as $line) {
	$line = trim($line);
	if (empty($line)) {
		continue;
	}
	$fields = explode(",", $line);
	$fields[0] = trim($fields[0], '"');
	$fields[1] = trim($fields[1], '"');
	$sql = sprintf("UPDATE conf_location SET country_name = '%s', country_name_cn = '%s' WHERE country_code = '%s'",
		mysql_real_escape_string($fields[1]),
		mysql_real_escape_string(isset($countryCode[$fields[0]]) ? $countryCode[$fields[0]] : $fields[1]),
		mysql_real_escape_string($fields[0]));
	$result = mysql_query($sql);
	if ($result === false) {
		$error = mysql_error();
		echo "ERROR[$sql][$error]\n";
	}
}
echo "import country_name/country_name_cn\n";

// region_name/region_name_cn
// 根据region_code_name.svn和region_code_cn填充region_name, region_name_cn 两列
require_once(dirname(__FILE__) . '/require/region_code_cn.php');
$lines = array_merge(
	explode("\n", file_get_contents(dirname(__FILE__) . '/../data/region_code_name.csv')),
	explode("\n", file_get_contents(dirname(__FILE__) . '/../data/region_code_name_iso.csv'))
);
foreach ($lines as $line) {
	$line = trim($line);
	if (empty($line)) {
		continue;
	}
	$fields = explode(",", $line);
	$fields[0] = trim($fields[0], '"');
	$fields[1] = trim($fields[1], '"');
	$fields[2] = trim($fields[2], '"');
	$sql = sprintf("UPDATE conf_location SET region_name = '%s', region_name_cn = '%s' WHERE country_code = '%s' AND region_code = '%s'",
		mysql_real_escape_string($fields[2]),
		mysql_real_escape_string(isset($regionCode["{$fields[0]}.{$fields[1]}"]) ? $regionCode["{$fields[0]}.{$fields[1]}"] : $fields[2]),
		mysql_real_escape_string($fields[0]),
		mysql_real_escape_string($fields[1])
	);
	$result = mysql_query($sql);
	if ($result === false) {
		$error = mysql_error();
		echo "ERROR[$sql][$error]\n";
	}
}
echo "import region_name/region_name_cn\n";

// country/region
// 根据现有的geo.code.php 填充country/region两列
$geo = require(dirname(__FILE__) . '/require/geo.code.php');
foreach ($geo as $id => $item) {
	$icon = $item['icon'];
	$sql = sprintf("UPDATE conf_location SET country = $id, icon = '$icon' WHERE country_name = '%s';",
		mysql_real_escape_string($item['name']));
	$result = mysql_query($sql);
	if ($result === false) {
		$error = mysql_error();
		echo "ERROR[$sql][$error]\n";
	}

	if (isset($item['child'])) {
		foreach ($item['child'] as $id0 => $item0) {
			$sql = sprintf("UPDATE conf_location SET country = $id, region = $id0 WHERE country_name = '%s' AND region_name='%s';",
				mysql_real_escape_string($item['name']),
				mysql_real_escape_string($item0['name'])
			);
			$result = mysql_query($sql);
			if ($result === false) {
				$error = mysql_error();
				echo "ERROR[$sql][$error]\n";
			}
		}
	}
}
echo "import country/region\n";

// country (new)
// 填充原来没有编号的country编码
$result = mysql_fetch_row(mysql_query('select max(country) from conf_location;'));
$max_country = intval($result[0]);
do {
	$sql = "select * from conf_location where country = 0 and country_code != '' limit 1";
	$result = mysql_query($sql);
	if ($result === false) {
		$error = mysql_error();
		echo "ERROR[$sql][$error]\n";
		break;
	}

	$row = mysql_fetch_assoc($result);
	if ($row === false) {
		break;
	}

	$max_country++;
	$sql = "UPDATE conf_location SET country = $max_country WHERE country_code = '{$row['country_code']}';";
	if (mysql_query($sql) === false) {
		$error = mysql_error();
		echo "ERROR[$sql][$error]\n";
	}
} while (1);
echo "finish country\n";

// region (new)
// 填充原来没有编号的region编码
$result = mysql_fetch_row(mysql_query('select max(region) from conf_location;'));
$max_region = intval($result[0]);
do {
	$sql = "select * from conf_location where country != 0 and region = 0 and country_code != '' and region_code != '' limit 1";
	$result = mysql_query($sql);
	if ($result === false) {
		$error = mysql_error();
		echo "ERROR[$sql][$error]\n";
		break;
	}

	$row = mysql_fetch_assoc($result);
	if ($row === false) {
		break;
	}

	$max_region++;
	$sql = "UPDATE conf_location SET region = $max_region WHERE country_code = '{$row['country_code']}' and region_code = '{$row['region_code']}';";
	if (mysql_query($sql) === false) {
		$error = mysql_error();
		echo "ERROR[$sql][$error]\n";
	}
} while (1);
echo "finish region\n";

// city/city_name_cn
// 由于原来的city/city_name_cn均为空, 因此可以直接填充
$sql = "UPDATE conf_location SET city = id, city_name_cn = city_name WHERE country != 0 and region != 0 and city_name != ''";
$result = mysql_query($sql);
if (mysql_query($sql) === false) {
	$error = mysql_error();
	echo "ERROR[$sql][$error]\n";
}
echo "finish city\n";

// city_name_cn(中国城市拼音转换)
$lines = explode("\n", file_get_contents(dirname(__FILE__) . '/../data/city_code_cn.csv'));
foreach ($lines as $line) {
	$line = trim($line);
	if (empty($line)) {
		continue;
	}
	$fields = explode(' ', $line);
	$sql = sprintf("UPDATE conf_location SET city_name_cn = '%s' WHERE country_code = 'CN' and UPPER(city_name) = '%s'",
		mysql_real_escape_string($fields[0]),
		mysql_real_escape_string($fields[1]));
	$result = mysql_query($sql);
	if ($result === false) {
		$error = mysql_error();
		echo "ERROR[$sql][$error]\n";
	}
}
echo "finish chinese city name\n";

$result = mysql_fetch_row(mysql_query('select max(city) from conf_location;'));
$max_city = intval($result[0]);

// 秒针数据导入
//$lines = explode("\n", file_get_contents(dirname(__FILE__) . '/../data/miaozhen.csv'));
$lines = file(dirname(__FILE__) . '/../data/miaozhen_20120806.csv');
foreach ($lines as $line) {
	$line = trim($line);
	if (empty($line)) {
		continue;
	}
	$fields = explode(',', $line);
	$start_ip = intval($fields[2]);
	$end_ip = intval($fields[3]);

	if ($fields[4] === '全球') continue;

	$country = mb_substr($fields[4], 0, 2) === '中国' || mb_substr($fields[4], 0, 3) === '大中华' ?
		'中国' : '';

	if ($country) {
		$region = mb_substr($fields[5], 0, 3) === '黑龙江' || mb_substr($fields[5], 0, 3) === '内蒙古' ?
			mb_substr($fields[5], 0, 3):
			mb_substr($fields[5], 0, 2);
		$city = '';
	} else {
		$region = mb_substr($fields[4], 0, 3) === '黑龙江' || mb_substr($fields[4], 0, 3) === '内蒙古' ?
			mb_substr($fields[4], 0, 3):
			mb_substr($fields[4], 0, 2);

		$len = mb_strlen($fields[5]);
		$city = $fields[5] === '未知' ?
			'':
			(mb_substr($fields[5], $len - 1, 1) === '市' ?
				mb_substr($fields[5], 0, $len - 1):
				(mb_substr($fields[5], $len - 2, 2) === '地区' ?
					mb_substr($fields[5], 0, $len - 2):
					mb_substr($fields[5], 0, 2)));
	}
	$sql = "select id from conf_location where country_code = 'CN' and region_name_cn = '$region' and city_name_cn = '$city'";
	$result = mysql_query($sql);
	if ($result === false) {
		$error = mysql_error();
		echo "ERROR[$sql][$error]\n";
	}
	if (($row = mysql_fetch_row($result)) === false) {
		// get sample record
		$sql = "select * from conf_location where country_code = 'CN' and region_name_cn = '$region' and city_name_cn = ''";
		$result = mysql_query($sql);
		$row = mysql_fetch_assoc($result);
		if ($row == false) {
			echo "unknow_record {$fields[4]}|{$fields[5]}, $country - $region - $city\n";
			continue;
		}

		// create new city record
		$max_city++;
		$sql = sprintf("INSERT INTO conf_location SET
			country = '%d', region = '%d', city = '%d',
			country_name = '%s', region_name = '%s', city_name = '%s',
			country_name_cn = '%s', region_name_cn = '%s', city_name_cn = '%s',
			country_code = '%s', region_code = '%s',
			icon = '%s', latitude = '%s', longitude = '%s'",
			$row['country'], $row['region'], $max_city,
			$row['country_name'], $row['region_name'], $city,
			$row['country_name_cn'], $row['region_name_cn'], $city,
			$row['country_code'], $row['region_code'],
			$row['icon'], $row['latitude'], $row['longitude']
		);
		echo "$sql\n";
		$result = mysql_query($sql);
		if ($result === false) {
			$error = mysql_error();
			echo "error[$sql][$error]\n";
			continue;
		}

		// get new city record
		$sql = "select id from conf_location where country_code = 'CN' and region_name_cn = '$region' and city_name_cn = '$city'";
		$result = mysql_query($sql);
		$row = mysql_fetch_row($result);
		if ($row == false) {
			echo "new city unknow_record $region - $city\n";
			continue;
		}
		$location_id = $row[0];
	} else {
		$location_id = $row[0];
	}

	$sql = "delete from conf_ip where $start_ip <= start_ip and start_ip <= $end_ip";
	$result = mysql_query($sql);
	if ($result === false) {
		$error = mysql_error();
		echo "ERROR[$sql][$error]\n";
	}
	$rows = mysql_affected_rows();

	$sql = "insert into conf_ip set start_ip = $start_ip, end_ip = $end_ip, location_id = $location_id";
	$result = mysql_query($sql);
	if ($result === false) {
		$error = mysql_error();
		echo "ERROR[$sql][$error]\n";
	}
}
echo "import miaozhen\n";

mysql_query('drop index tmp_index0 on conf_location;');
mysql_query('drop index tmp_index1 on conf_location;');
mysql_query('drop index tmp_index2 on conf_location;');
mysql_query('drop index tmp_index3 on conf_location;');
mysql_query('drop index tmp_index4 on conf_location;');
mysql_query('drop index tmp_index5 on conf_location;');

