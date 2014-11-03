<?php
return array(

"baidu" => array(
	"baidu.+[?|&]w=([^&]*)",
	"baidu.+[?|&]wd=([^&]*)",
	"baidu.+[?|&]word=([^&]*)",
),

"google" => array(
	"google.+[?|&]q=([^&]*)",
),

"sogou" => array(
	"sogou.+[?|&]query=([^&]*)",
),

"soso" => array(
	"soso\.com.+[?|&]w=([^&]*)",
),

"bing" => array(
	"bing.com.+[?|&]q=([^&]*)",
),

"live" => array(
	"live\.com.+[?|&]q=([^&]*)",
),

"youdao" => array(
	"youdao.+[?|&]q=([^&]*)",
),

"360" => array(
    "so\.360\.cn.+[?|&]q=([^&]*)",
),

);
