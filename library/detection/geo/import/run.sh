#!/bin/bash
cat schame.sql | mysql -h '192.168.10.4' -u root --password='80eef62460' ip_test
echo 'create database finished';
php import.php
echo 'import finished';
