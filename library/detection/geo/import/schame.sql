DROP TABLE IF EXISTS conf_location;
CREATE TABLE conf_location (
	id INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
	country INT UNSIGNED NOT NULL,
	region INT UNSIGNED NOT NULL,
	city INT UNSIGNED NOT NULL,
	country_name VARCHAR(256) NOT NULL,
	region_name VARCHAR(256) NOT NULL,
	city_name VARCHAR(256) NOT NULL,
	country_name_cn VARCHAR(256) NOT NULL,
	region_name_cn VARCHAR(256) NOT NULL,
	city_name_cn VARCHAR(256) NOT NULL,
	country_code CHAR(2) NOT NULL,
	region_code CHAR(2) NOT NULL,
	icon CHAR(2) NOT NULL,
	latitude float NOT NULL,
	longitude float NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

LOAD DATA local INFILE '../data/GeoLiteCity-Location.csv'
INTO TABLE conf_location
FIELDS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '"'
LINES TERMINATED BY '\n'
(id, country_code, region_code, city_name, @column0, latitude, longitude, @column1, @column2);

LOAD DATA local INFILE '../data/GeoLiteCity-Location-ex.csv'
INTO TABLE conf_location
FIELDS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '"'
LINES TERMINATED BY '\n'
(id, country_code, region_code, city_name, @column0, latitude, longitude, @column1, @column2);

DROP TABLE IF EXISTS conf_ip;
CREATE TABLE conf_ip (
	start_ip INT UNSIGNED NOT NULL PRIMARY KEY,
	end_ip INT UNSIGNED NOT NULL,
	location_id INT UNSIGNED NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

LOAD DATA local INFILE '../data/GeoLiteCity-Blocks.csv'
INTO TABLE conf_ip
FIELDS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '"'
LINES TERMINATED BY '\n'
(start_ip, end_ip, location_id);
