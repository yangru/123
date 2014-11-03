<?php
//客户端识别用的配置文件
$OSES = array(
	'MI-ONE Plus'			=> 'MIUI',
	'Android'				=> 'Android',
	'Maemo'					=> 'Maemo',
	'Linux'					=> 'Linux',
	'Ubuntu'				=> 'Ubuntu',
	'CentOS'				=> 'CentOS',
	'Debian'				=> 'Debian',
	'RedHeat'				=> 'RedHeat',

	'WP7'					=> 'WP7',

	'CYGWIN_NT-6.1'			=> 'Win7',
	'CYGWIN_NT-6.2'			=> 'Win8',
	'Windows NT 6.2'		=> 'Win8',
	'Windows NT 6.1'		=> 'Win7',
	'Windows 7'				=> 'Win7',
	'CYGWIN_NT-6.0'			=> 'Win7',
	'Windows NT 6.0'		=> 'Win7',
	'Windows Vista'			=> 'WinVista',
	'CYGWIN_NT-5.2'			=> 'Win2003',
	'Windows NT 5.2'		=> 'Win2003',
	'Windows Server 2003 / XP x64' => 'Win2003',
	'CYGWIN_NT-5.1'			=> 'WinXP',
	'Windows NT 5.1'		=> 'WinXP',
	'Windows XP'			=> 'WinXP',
	'CYGWIN_NT-5.0'			=> 'Win2000',
	'Windows NT 5.0'		=> 'Win2000',
	'Windows 2000'			=> 'Win2000',
	'CYGWIN_NT-4.0'			=> 'WinNT',
	'Windows NT 4.0'		=> 'WinNT',
	'WinNT'					=> 'WinNT',
	'Windows NT'			=> 'WinNT',
	'CYGWIN_ME-4.90'		=> 'WinME',
	'Win 9x 4.90'			=> 'WinME',
	'Windows ME'			=> 'WinME',
	'CYGWIN_98-4.10'		=> 'Win98',
	'Win98'					=> 'Win98',
	'Windows 98'			=> 'Win98',
	'CYGWIN_95-4.0'			=> 'Win95',
	'Win32'					=> 'Win95',
	'Win95'					=> 'Win95',		
	'Windows 95'			=> 'Win95',

	'Windows Phone OS 7.0'	=> 'WinPhone7',
	'Windows Mobile 6.5'	=> 'WinMobile6.5',
	'Windows Mobile 6.1'	=> 'WinMobile6.1',
	'Windows CE'			=> 'WinCE',

	'iPod'					=> 'iPod',
	'iPad'					=> 'iPad',
	'iPhone'				=> 'iPhone',
//			'iOS'					=> 'IOS',
	'Darwin'				=> 'MacOSX',
	'Macintosh'				=> 'MacOSX',
	'Power Macintosh'		=> 'MacOSX',
	'Mac_PowerPC'			=> 'MacOSX', 
	'Mac PPC'				=> 'MacOSX',
	'PPC'					=> 'MacOSX',
	'Mac PowerPC'			=> 'MacOSX',
	'Mac OS'				=> 'MacOSX',

	'webOS'					=> 'webOS',
	'Palm webOS'			=> 'webOS',
	'PalmOS'				=> 'PalmOS',
	'Palm OS'				=> 'PalmOS',

	'BlackBerry'			=> 'BlackBerry',
	'RIM Tablet OS'			=> 'QNX',
	'QNX'					=> 'QNX',

	'SymbOS'				=> 'SymbianOS',
	'Symbian OS'			=> 'SymbianOS',
	'SymbianOS'				=> 'SymbianOS',

	'bada'					=> 'bada',

	'SunOS'					=> 'SunOS',
	'AIX'					=> 'AIX',
	'HP-UX'					=> 'HPUnix',
	'OpenVMS'				=> 'OpenVMS',

	'FreeBSD'				=> 'FreeBSD',
	'NetBSD'				=> 'NetBSD',
	'OpenBSD'				=> 'OpenBSD',
	'DragonFly'				=> 'DragonFly',
	'Syllable'				=> 'Syllable',

	'Nintendo Wii'			=> 'Wii',
	'Nitro'					=> 'NDS',
	'Nintendo DS '			=> 'NDS',
	'Nintendo DSi'			=> 'NDSI',
	'PlayStation Portable'	=> 'PSP',
	'PlayStation 3'			=> 'PS3',

	'IRIX'					=> 'IRIX',
	'OSF1'					=> 'Tru64',
	'OS/2'					=> 'OS2',
	'BEOS'					=> 'BeOS',
	'Amiga'					=> 'AmigaOS',
	'AmigaOS'				=> 'AmigaOS',
	//新的操作系统在尾部添加
);
$BROWSERS = array(
	//'xiaoxie' => 'type',
	'360se' => '360SE',
	'360ee' => '360EE',
	'abrowse' => 'ABrowse',
	'amaya' => 'Amaya',
	'amigavoyager' => 'AmigaVoyager',
	'amiga-aweb' => 'AWeb',
	'arora' => 'Arora',
	'baidubrowser' => 'BaiduBrowser',
	'beonex' => 'Beonex',
	'blackberry' => 'BlackBerry',
	'playbook' => 'PlayBook',
	'browsex' => 'BrowseX',
	'chimera' => 'Chimera',
	'camino' => 'Camino',
	'cheshire' => 'Cheshire',
	'chrome' => 'Chrome',
	'360chrome' => '360Chrome',
	'cometbird' => 'CometBird',
	'dillo' => 'Dillo',
	'elinks' => 'ELinks',
	'epiphany' => 'Epiphany',
	'fennec' => 'Fennec',
	'dolfin' => 'Dolfin',
	'phoenix' => 'Phoenix',
	'mozilla firebird' => 'Firebird',
	'firebird' => 'Firebird',
	'bonecho' => 'Firebird',
	'minefield' => 'Minefield',
	'namoroka' => 'Namoroka',
	'shiretoko' => 'Shiretoko',
	'granparadiso' => 'Granparadiso',
	'iceweasel' => 'Iceweasel',
	'icecat' => 'Icecat',
	'firefox' => 'Firefox',
	'flock' => 'Flock',
	'fluid' => 'Fluid',
	'galeon' => 'Galeon',
	'google earth' => 'GoogleEarth',
	'hana' => 'Hana',
	'hotjava' => 'HotJava',
	'ibrowse' => 'IBrowse',
	'icab' => 'iCab',
	'msie' => 'IE',
	'internet explorer' => 'IE',
	'iron' => 'Iron',
	'kapiko' => 'Kapiko',
	'kazehakase' => 'Kazehakase',
	'k-meleon' => 'K-Meleon',
	'konqueror' => 'Konqueror',
	'links' => 'Links',
	'lynx' => 'Lynx',
	'midori' => 'Midori',
	'myie' => 'Myie',
	'myie2' => 'Myie',
	'maxthon' => 'Maxthon',
	'mozilla' => 'Mozilla',
	'gnuzilla' => 'Gnuzilla',
	'iceape' => 'Iceape',
	'seamonkey' => 'SeaMonkey',
	'mosaic' => 'Mosaic',
	'ncsa mosaic' => 'Mosaic',
	'navigator' => 'Netscape',
	'netscape6' => 'Netscape',
	'netscape' => 'Netscape',
	'omniweb' => 'OmniWeb',
	'nitro) opera' => 'Opera',
	'opera' => 'Opera',
	'metasr' => 'SoGou',
	'qqbrowser' => 'QQBrowser',
	'ucweb' => 'UCWEB',
	'applewebkit' => 'Safari',
	'titanium' => 'Titanium',
	'webos' => 'webOS',
	'webpro' => 'WebPro',
	//新浏览器加入到该位置以下
	'tencenttraveler' => 'TT',
	'TheWorld' => 'TheWorld'
);
$OS_TYPES = array(
	'MI-ONE Plus'			=> 'MIUI',
	'Android'				=> 'Android',
	'Maemo'					=> 'Maemo',
	'Linux'					=> 'Linux',
	'Ubuntu'				=> 'Linux',
	'CentOS'				=> 'Linux',
	'Debian'				=> 'Linux',
	'RedHeat'				=> 'Linux',

	'WP7'					=> 'WP7',

	'Win7'					=> 'Windows',
	'Win8'					=> 'Windows',
	'WinVista'				=> 'Windows',
	'Win2003'				=> 'Windows',
	'WinXP'					=> 'Windows',
	'Win2000'				=> 'Windows',
	'WinNT'					=> 'Windows',
	'WinME'					=> 'Windows',
	'Win98'					=> 'Windows',
	'Win95'					=> 'Windows',

	'WinPhone7'				=> 'Windows Phone',
	'WinMobile6.5'			=> 'Windows Mobile',
	'WinMobile6.1'			=> 'Windows Mobile',
	'WinCE'					=> 'Windows',

	'iPod'					=> 'iPod',
	'iPad'					=> 'iPad',
	'iPhone'				=> 'iPhone',
	'MacOSX'				=> 'MacOSX',

	'webOS'					=> 'webOS',
	'PalmOS'				=> 'PalmOS',

	'BlackBerry'			=> 'BlackBerry',
	'QNX'					=> 'QNX',

	'SymbianOS'				=> 'SymbianOS',

	'bada'					=> 'bada',

	'SunOS'					=> 'SunOS',
	'AIX'					=> 'AIX',
	'HPUnix'				=> 'HPUnix',
	'OpenVMS'				=> 'OpenVMS',

	'FreeBSD'				=> 'FreeBSD',
	'NetBSD'				=> 'NetBSD',
	'OpenBSD'				=> 'OpenBSD',
	'DragonFly'				=> 'DragonFly',
	'Syllable'				=> 'Syllable',

	'Wii'					=> 'Wii',
	'NDS'					=> 'Nintendo',
	'NDSI'					=> 'Nintendo',
	'PSP'					=> 'PlayStation',
	'PS3'					=> 'PlayStation',

	'IRIX'					=> 'IRIX',
	'Tru64'					=> 'Tru64',
	'OS2'					=> 'OS2',
	'BeOS'					=> 'BeOS',
	'AmigaOS'				=> 'AmigaOS',
);
$OS_TYPE_TO_ID = array (
	  'Linux' => 10000,
	  'MacOS' => 10003,
	  'Other' => 10005,
	  'Android' => 10006,
	  'BlackBerry' => 10007,
	  'JAVA' => 10009,
	  'SymbianOS' => 10010,
	  'Unknown' => 10011,
	  'Windows' => 10012,
	  'MIUI' => 10020,
	  'Maemo' => 10021,
	  'WP7' => 10022,
	  'Windows Phone' => 10023,
	  'Windows Mobile' => 10024,
	  'iPod' => 10025,
	  'iPad' => 10026,
	  'iPhone' => 10027,
	  'webOS' => 10028,
	  'PalmOS' => 10029,
	  'QNX' => 10030,
	  'bada' => 10031,
	  'SunOS' => 10032,
	  'AIX' => 10033,
	  'HPUnix' => 10034,
	  'OpenVMS' => 10035,
	  'FreeBSD' => 10036,
	  'NetBSD' => 10037,
	  'OpenBSD' => 10038,
	  'DragonFly' => 10039,
	  'Syllable' => 10040,
	  'Wii' => 10041,
	  'Nintendo' => 10042,
	  'PlayStation' => 10043,
	  'IRIX' => 10044,
	  'Tru64' => 10045,
	  'OS/2' => 10046,
	  'BeOS' => 10047,
	  'AmigaOS' => 10048,
	);
$BROWSER_TYPE_TO_ID = array (
	  'Unknown' => 10012,
	  'ABrowse' => 10156,
	  'Amaya' => 10256,
	  'AmigaVoyager' => 10356,
	  'AWeb' => 10456,
	  'Arora' => 10556,
	  'BaiduBrowser' => 10656,
	  'Beonex' => 10756,
	  'BlackBerry' => 10003,
	  'PlayBook' => 10856,
	  'BrowseX' => 10956,
	  'Chimera' => 11056,
	  'Camino' => 11156,
	  'Cheshire' => 11256,
	  'Chrome' => 10004,
	  '360Chrome' => 11356,
	  'CometBird' => 11456,
	  'Dillo' => 11556,
	  'ELinks' => 11656,
	  'Epiphany' => 11756,
	  'Fennec' => 11856,
	  'Dolfin' => 11956,
	  'Phoenix' => 12056,
	  'Firebird' => 12156,
	  'Bonecho' => 12256,
	  'Minefield' => 12356,
	  'Namoroka' => 12456,
	  'Shiretoko' => 12556,
	  'Granparadiso' => 12656,
	  'Iceweasel' => 12756,
	  'Icecat' => 12856,
	  'Firefox' => 10013,
	  'Flock' => 12956,
	  'Fluid' => 13056,
	  'Galeon' => 13156,
	  'GoogleEarth' => 13256,
	  'Hana' => 13356,
	  'HotJava' => 13456,
	  'IBrowse' => 13556,
	  'iCab' => 13656,
	  'IE' => 10019,
	  '360SE' => 13756,
	  'Iron' => 13856,
	  'Kapiko' => 13956,
	  'Kazehakase' => 14056,
	  'K-Meleon' => 14156,
	  'Konqueror' => 10034,
	  'Links' => 14256,
	  'Lynx' => 14356,
	  'Midori' => 14456,
	  'Myie' => 14556,
	  'Myie2' => 14656,
	  'Maxthon' => 10036,
	  'QQBrowser' => 14756,
	  'TencentTraveler' => 15700,
	  'SoGou' => 14856,
	  'Mozilla' => 10039,
	  'Gnuzilla' => 14956,
	  'Iceape' => 15056,
	  'SeaMonkey' => 15156,
	  'Mosaic' => 15256,
	  'Navigator' => 15356,
	  'Netscape6' => 15456,
	  'Netscape' => 15556,
	  'OmniWeb' => 15656,
	  'Opera' => 10042,
	  'UCWEB' => 15756,
	  'Safari' => 10050,
	  'Titanium' => 15856,
	  'webOS' => 15956,
	  'WebPro' => 16056,
	  'Android' => 10000,
	  'iPad' => 10025,
	  'iPhone' => 10027,
	  'iPod Touch' => 10030,
	  'Kindle' => 10032,
	  'Nokia' => 10041,
	  'Opera Mini' => 10046,
	  'Yahoo! Slurp' => 10054,
	);
$OS_INFO = array (
		  'Linux' => 
		  array (
			'type' => 10000,
			'version' => 0,
			'subversion' => 0,
			'type_name' => 'Linux',
			'icon' => 'Linux',
			'description' => 'Linux',
		  ),
		  'MacOS' => 
		  array (
			'type' => 10003,
			'version' => 0,
			'subversion' => 0,
			'type_name' => 'MacOS',
			'icon' => 'Mac',
			'description' => 'MacOS',
		  ),
		  'Other' => 
		  array (
			'type' => 10005,
			'version' => 0,
			'subversion' => 0,
			'type_name' => 'Other',
			'icon' => 'Other',
			'description' => 'Other',
		  ),
		  'Android' => 
		  array (
			'type' => 10006,
			'version' => 0,
			'subversion' => 0,
			'type_name' => 'Android',
			'icon' => 'Android',
			'description' => 'Android',
		  ),
		  'BlackBerry' => 
		  array (
			'type' => 10007,
			'version' => 0,
			'subversion' => 0,
			'type_name' => 'BlackBerry',
			'icon' => 'blackberry',
			'description' => 'BlackBerry',
		  ),
		  'JAVA' => 
		  array (
			'type' => 10009,
			'version' => 0,
			'subversion' => 0,
			'type_name' => 'JAVA',
			'icon' => 'JAVA',
			'description' => 'JAVA',
		  ),
		  'SymbianOS' => 
		  array (
			'type' => 10010,
			'version' => 0,
			'subversion' => 0,
			'type_name' => 'SymbianOS',
			'icon' => 'Symbian',
			'description' => 'SymbianOS',
		  ),
		  'Unknown' => 
		  array (
			'type' => 10011,
			'version' => 0,
			'subversion' => 0,
			'type_name' => 'Unknown',
			'icon' => 'unknown',
			'description' => 'Unknown',
		  ),
		  'Windows' => 
		  array (
			'type' => 10012,
			'version' => 0,
			'subversion' => 0,
			'type_name' => 'Windows',
			'icon' => 'Windows',
			'description' => 'Windows',
		  ),
		  'MIUI' => 
		  array (
			'type' => 10020,
			'version' => 0,
			'subversion' => 0,
			'type_name' => 'MIUI',
			'icon' => 'miui',
			'description' => 'MIUI',
		  ),
		  'Maemo' => 
		  array (
			'type' => 10021,
			'version' => 0,
			'subversion' => 0,
			'type_name' => 'Maemo',
			'icon' => 'maemo',
			'description' => 'Maemo',
		  ),
		  'WP7' => 
		  array (
			'type' => 10022,
			'version' => 0,
			'subversion' => 0,
			'type_name' => 'WP7',
			'icon' => 'wp7',
			'description' => 'WP7',
		  ),
		  'Windows Phone' => 
		  array (
			'type' => 10023,
			'version' => 0,
			'subversion' => 0,
			'type_name' => 'Windows Phone',
			'icon' => 'windows phone',
			'description' => 'Windows Phone',
		  ),
		  'Windows Mobile' => 
		  array (
			'type' => 10024,
			'version' => 0,
			'subversion' => 0,
			'type_name' => 'Windows Mobile',
			'icon' => 'windows mobile',
			'description' => 'Windows Mobile',
		  ),
		  'iPod' => 
		  array (
			'type' => 10025,
			'version' => 0,
			'subversion' => 0,
			'type_name' => 'iPod',
			'icon' => 'ipod',
			'description' => 'iPod',
		  ),
		  'iPad' => 
		  array (
			'type' => 10026,
			'version' => 0,
			'subversion' => 0,
			'type_name' => 'iPad',
			'icon' => 'ipad',
			'description' => 'iPad',
		  ),
		  'iPhone' => 
		  array (
			'type' => 10027,
			'version' => 0,
			'subversion' => 0,
			'type_name' => 'iPhone',
			'icon' => 'iphone',
			'description' => 'iPhone',
		  ),
		  'webOS' => 
		  array (
			'type' => 10028,
			'version' => 0,
			'subversion' => 0,
			'type_name' => 'webOS',
			'icon' => 'webos',
			'description' => 'webOS',
		  ),
		  'PalmOS' => 
		  array (
			'type' => 10029,
			'version' => 0,
			'subversion' => 0,
			'type_name' => 'PalmOS',
			'icon' => 'palmos',
			'description' => 'PalmOS',
		  ),
		  'QNX' => 
		  array (
			'type' => 10030,
			'version' => 0,
			'subversion' => 0,
			'type_name' => 'QNX',
			'icon' => 'qnx',
			'description' => 'QNX',
		  ),
		  'bada' => 
		  array (
			'type' => 10031,
			'version' => 0,
			'subversion' => 0,
			'type_name' => 'bada',
			'icon' => 'bada',
			'description' => 'bada',
		  ),
		  'SunOS' => 
		  array (
			'type' => 10032,
			'version' => 0,
			'subversion' => 0,
			'type_name' => 'SunOS',
			'icon' => 'sunos',
			'description' => 'SunOS',
		  ),
		  'AIX' => 
		  array (
			'type' => 10033,
			'version' => 0,
			'subversion' => 0,
			'type_name' => 'AIX',
			'icon' => 'aix',
			'description' => 'AIX',
		  ),
		  'HPUnix' => 
		  array (
			'type' => 10034,
			'version' => 0,
			'subversion' => 0,
			'type_name' => 'HPUnix',
			'icon' => 'hpunix',
			'description' => 'HPUnix',
		  ),
		  'OpenVMS' => 
		  array (
			'type' => 10035,
			'version' => 0,
			'subversion' => 0,
			'type_name' => 'OpenVMS',
			'icon' => 'openvms',
			'description' => 'OpenVMS',
		  ),
		  'FreeBSD' => 
		  array (
			'type' => 10036,
			'version' => 0,
			'subversion' => 0,
			'type_name' => 'FreeBSD',
			'icon' => 'freebsd',
			'description' => 'FreeBSD',
		  ),
		  'NetBSD' => 
		  array (
			'type' => 10037,
			'version' => 0,
			'subversion' => 0,
			'type_name' => 'NetBSD',
			'icon' => 'netbsd',
			'description' => 'NetBSD',
		  ),
		  'OpenBSD' => 
		  array (
			'type' => 10038,
			'version' => 0,
			'subversion' => 0,
			'type_name' => 'OpenBSD',
			'icon' => 'openbsd',
			'description' => 'OpenBSD',
		  ),
		  'DragonFly' => 
		  array (
			'type' => 10039,
			'version' => 0,
			'subversion' => 0,
			'type_name' => 'DragonFly',
			'icon' => 'dragonfly',
			'description' => 'DragonFly',
		  ),
		  'Syllable' => 
		  array (
			'type' => 10040,
			'version' => 0,
			'subversion' => 0,
			'type_name' => 'Syllable',
			'icon' => 'syllable',
			'description' => 'Syllable',
		  ),
		  'Wii' => 
		  array (
			'type' => 10041,
			'version' => 0,
			'subversion' => 0,
			'type_name' => 'Wii',
			'icon' => 'wii',
			'description' => 'Wii',
		  ),
		  'Nintendo' => 
		  array (
			'type' => 10042,
			'version' => 0,
			'subversion' => 0,
			'type_name' => 'Nintendo',
			'icon' => 'nintendo',
			'description' => 'Nintendo',
		  ),
		  'PlayStation' => 
		  array (
			'type' => 10043,
			'version' => 0,
			'subversion' => 0,
			'type_name' => 'PlayStation',
			'icon' => 'playstation',
			'description' => 'PlayStation',
		  ),
		  'IRIX' => 
		  array (
			'type' => 10044,
			'version' => 0,
			'subversion' => 0,
			'type_name' => 'IRIX',
			'icon' => 'irix',
			'description' => 'IRIX',
		  ),
		  'Tru64' => 
		  array (
			'type' => 10045,
			'version' => 0,
			'subversion' => 0,
			'type_name' => 'Tru64',
			'icon' => 'tru64',
			'description' => 'Tru64',
		  ),
		  'OS/2' => 
		  array (
			'type' => 10046,
			'version' => 0,
			'subversion' => 0,
			'type_name' => 'OS/2',
			'icon' => 'os/2',
			'description' => 'OS/2',
		  ),
		  'BeOS' => 
		  array (
			'type' => 10047,
			'version' => 0,
			'subversion' => 0,
			'type_name' => 'BeOS',
			'icon' => 'beos',
			'description' => 'BeOS',
		  ),
		  'AmigaOS' => 
		  array (
			'type' => 10048,
			'version' => 0,
			'subversion' => 0,
			'type_name' => 'AmigaOS',
			'icon' => 'amigaos',
			'description' => 'AmigaOS',
		  ),
		  'Ubuntu' => 
		  array (
			'type' => 10000,
			'version' => 10049,
			'subversion' => 0,
			'type_name' => 'Linux',
			'icon' => 'linux',
			'description' => 'Ubuntu',
		  ),
		  'CentOS' => 
		  array (
			'type' => 10000,
			'version' => 10050,
			'subversion' => 0,
			'type_name' => 'Linux',
			'icon' => 'linux',
			'description' => 'CentOS',
		  ),
		  'Debian' => 
		  array (
			'type' => 10000,
			'version' => 10051,
			'subversion' => 0,
			'type_name' => 'Linux',
			'icon' => 'linux',
			'description' => 'Debian',
		  ),
		  'RedHeat' => 
		  array (
			'type' => 10000,
			'version' => 10052,
			'subversion' => 0,
			'type_name' => 'Linux',
			'icon' => 'linux',
			'description' => 'RedHeat',
		  ),
		  'Win7' => 
		  array (
			'type' => 10012,
			'version' => 10015,
			'subversion' => 0,
			'type_name' => 'Windows',
			'icon' => 'win7',
			'description' => 'Win7',
		  ),
		  'Win8' => 
		  array (
			'type' => 10012,
			'version' => 10053,
			'subversion' => 0,
			'type_name' => 'Windows',
			'icon' => 'windows',
			'description' => 'Win8',
		  ),
		  'WinVista' => 
		  array (
			'type' => 10012,
			'version' => 10018,
			'subversion' => 0,
			'type_name' => 'Windows',
			'icon' => 'winvista',
			'description' => 'WinVista',
		  ),
		  'Win2003' => 
		  array (
			'type' => 10012,
			'version' => 10014,
			'subversion' => 0,
			'type_name' => 'Windows',
			'icon' => 'win2003',
			'description' => 'Win2003',
		  ),
		  'WinXP' => 
		  array (
			'type' => 10012,
			'version' => 10019,
			'subversion' => 0,
			'type_name' => 'Windows',
			'icon' => 'winxp',
			'description' => 'WinXP',
		  ),
		  'Win2000' => 
		  array (
			'type' => 10012,
			'version' => 10013,
			'subversion' => 0,
			'type_name' => 'Windows',
			'icon' => 'win2000',
			'description' => 'Win2000',
		  ),
		  'WinNT' => 
		  array (
			'type' => 10012,
			'version' => 10054,
			'subversion' => 0,
			'type_name' => 'Windows',
			'icon' => 'windows',
			'description' => 'WinNT',
		  ),
		  'WinME' => 
		  array (
			'type' => 10012,
			'version' => 10017,
			'subversion' => 0,
			'type_name' => 'Windows',
			'icon' => 'winme',
			'description' => 'WinME',
		  ),
		  'Win98' => 
		  array (
			'type' => 10012,
			'version' => 10016,
			'subversion' => 0,
			'type_name' => 'Windows',
			'icon' => 'win98',
			'description' => 'Win98',
		  ),
		  'Win95' => 
		  array (
			'type' => 10012,
			'version' => 10055,
			'subversion' => 0,
			'type_name' => 'Windows',
			'icon' => 'windows',
			'description' => 'Win95',
		  ),
		  'WinPhone7' => 
		  array (
			'type' => 10023,
			'version' => 10056,
			'subversion' => 0,
			'type_name' => 'Windows Phone',
			'icon' => 'windows phone',
			'description' => 'WinPhone7',
		  ),
		  'WinMobile6.5' => 
		  array (
			'type' => 10024,
			'version' => 10057,
			'subversion' => 0,
			'type_name' => 'Windows Mobile',
			'icon' => 'windows mobile',
			'description' => 'WinMobile6.5',
		  ),
		  'WinMobile6.1' => 
		  array (
			'type' => 10024,
			'version' => 10058,
			'subversion' => 0,
			'type_name' => 'Windows Mobile',
			'icon' => 'windows mobile',
			'description' => 'WinMobile6.1',
		  ),
		  'WinCE' => 
		  array (
			'type' => 10012,
			'version' => 10059,
			'subversion' => 0,
			'type_name' => 'Windows',
			'icon' => 'windows',
			'description' => 'WinCE',
		  ),
		  'MacOSX' => 
		  array (
			'type' => 10003,
			'version' => 10008,
			'subversion' => 0,
			'type_name' => 'MacOS',
			'icon' => 'macosx',
			'description' => 'MacOSX',
		  ),
		  'NDS' => 
		  array (
			'type' => 10042,
			'version' => 10060,
			'subversion' => 0,
			'type_name' => 'Nintendo',
			'icon' => 'nintendo',
			'description' => 'NDS',
		  ),
		  'NDSI' => 
		  array (
			'type' => 10042,
			'version' => 10061,
			'subversion' => 0,
			'type_name' => 'Nintendo',
			'icon' => 'nintendo',
			'description' => 'NDSI',
		  ),
		  'PSP' => 
		  array (
			'type' => 10043,
			'version' => 10062,
			'subversion' => 0,
			'type_name' => 'PlayStation',
			'icon' => 'playstation',
			'description' => 'PSP',
		  ),
		  'PS3' => 
		  array (
			'type' => 10043,
			'version' => 10063,
			'subversion' => 0,
			'type_name' => 'PlayStation',
			'icon' => 'playstation',
			'description' => 'PS3',
		  ),
		  'OS2' => 
		  array (
			'type' => 10046,
			'version' => 10064,
			'subversion' => 0,
			'type_name' => 'OS/2',
			'icon' => 'os2',
			'description' => 'OS2',
		  ),
		);
$BROWSER_INFO = array (
  'Unknown' => 
  array (
    'type' => 10012,
    'version' => 0,
    'subversion' => 0,
    'type_name' => 'Unknown',
    'version_name' => 0,
    'subversion_name' => 0,
    'icon' => 'unknown',
    'description' => 'Unknown',
  ),
  'ABrowse' => 
  array (
    'type' => 10156,
    'version' => 0,
    'subversion' => 0,
    'type_name' => 'ABrowse',
    'version_name' => 0,
    'subversion_name' => 0,
    'icon' => 'abrowse',
    'description' => 'ABrowse',
  ),
  'Amaya' => 
  array (
    'type' => 10256,
    'version' => 0,
    'subversion' => 0,
    'type_name' => 'Amaya',
    'version_name' => 0,
    'subversion_name' => 0,
    'icon' => 'amaya',
    'description' => 'Amaya',
  ),
  'AmigaVoyager' => 
  array (
    'type' => 10356,
    'version' => 0,
    'subversion' => 0,
    'type_name' => 'AmigaVoyager',
    'version_name' => 0,
    'subversion_name' => 0,
    'icon' => 'amigavoyager',
    'description' => 'AmigaVoyager',
  ),
  'AWeb' => 
  array (
    'type' => 10456,
    'version' => 0,
    'subversion' => 0,
    'type_name' => 'AWeb',
    'version_name' => 0,
    'subversion_name' => 0,
    'icon' => 'aweb',
    'description' => 'AWeb',
  ),
  'Arora' => 
  array (
    'type' => 10556,
    'version' => 0,
    'subversion' => 0,
    'type_name' => 'Arora',
    'version_name' => 0,
    'subversion_name' => 0,
    'icon' => 'arora',
    'description' => 'Arora',
  ),
  'BaiduBrowser' => 
  array (
    'type' => 10656,
    'version' => 0,
    'subversion' => 0,
    'type_name' => 'BaiduBrowser',
    'version_name' => 0,
    'subversion_name' => 0,
    'icon' => 'baidubrowser',
    'description' => 'BaiduBrowser',
  ),
  'BaiduBrowser1' => 
  array (
    'type' => 10656,
    'version' => 10666,
    'subversion' => 0,
    'type_name' => 'BaiduBrowser',
    'version_name' => 0,
    'subversion_name' => 0,
    'icon' => 'baidubrowser',
    'description' => 'BaiduBrowser1',
  ),
  'BaiduBrowser2' => 
  array (
    'type' => 10656,
    'version' => 10676,
    'subversion' => 0,
    'type_name' => 'BaiduBrowser',
    'version_name' => 0,
    'subversion_name' => 0,
    'icon' => 'baidubrowser',
    'description' => 'BaiduBrowser2',
  ),
  'BaiduBrowser3' => 
  array (
    'type' => 10656,
    'version' => 10686,
    'subversion' => 0,
    'type_name' => 'BaiduBrowser',
    'version_name' => 0,
    'subversion_name' => 0,
    'icon' => 'baidubrowser',
    'description' => 'BaiduBrowser3',
  ),
  'Beonex' => 
  array (
    'type' => 10756,
    'version' => 0,
    'subversion' => 0,
    'type_name' => 'Beonex',
    'version_name' => 0,
    'subversion_name' => 0,
    'icon' => 'beonex',
    'description' => 'Beonex',
  ),
  'BlackBerry' => 
  array (
    'type' => 10003,
    'version' => 0,
    'subversion' => 0,
    'type_name' => 'BlackBerry',
    'version_name' => 0,
    'subversion_name' => 0,
    'icon' => 'blackberry',
    'description' => 'BlackBerry',
  ),
  'PlayBook' => 
  array (
    'type' => 10856,
    'version' => 0,
    'subversion' => 0,
    'type_name' => 'PlayBook',
    'version_name' => 0,
    'subversion_name' => 0,
    'icon' => 'playbook',
    'description' => 'PlayBook',
  ),
  'BrowseX' => 
  array (
    'type' => 10956,
    'version' => 0,
    'subversion' => 0,
    'type_name' => 'BrowseX',
    'version_name' => 0,
    'subversion_name' => 0,
    'icon' => 'browsex',
    'description' => 'BrowseX',
  ),
  'Chimera' => 
  array (
    'type' => 11056,
    'version' => 0,
    'subversion' => 0,
    'type_name' => 'Chimera',
    'version_name' => 0,
    'subversion_name' => 0,
    'icon' => 'chimera',
    'description' => 'Chimera',
  ),
  'Camino' => 
  array (
    'type' => 11156,
    'version' => 0,
    'subversion' => 0,
    'type_name' => 'Camino',
    'version_name' => 0,
    'subversion_name' => 0,
    'icon' => 'camino',
    'description' => 'Camino',
  ),
  'Cheshire' => 
  array (
    'type' => 11256,
    'version' => 0,
    'subversion' => 0,
    'type_name' => 'Cheshire',
    'version_name' => 0,
    'subversion_name' => 0,
    'icon' => 'cheshire',
    'description' => 'Cheshire',
  ),
  'Chrome' => 
  array (
    'type' => 10004,
    'version' => 0,
    'subversion' => 0,
    'type_name' => 'Chrome',
    'version_name' => 0,
    'subversion_name' => 0,
    'icon' => 'chrome',
    'description' => 'Chrome',
  ),
  'Chrome9' => 
  array (
    'type' => 10004,
    'version' => 10011,
    'subversion' => 0,
    'type_name' => 'Chrome',
    'version_name' => 9,
    'subversion_name' => 0,
    'icon' => 'chrome',
    'description' => 'Chrome9',
  ),
  'Chrome10' => 
  array (
    'type' => 10004,
    'version' => 10005,
    'subversion' => 0,
    'type_name' => 'Chrome',
    'version_name' => 10,
    'subversion_name' => 0,
    'icon' => 'chrome',
    'description' => 'Chrome10',
  ),
  'Chrome11' => 
  array (
    'type' => 10004,
    'version' => 10006,
    'subversion' => 0,
    'type_name' => 'Chrome',
    'version_name' => 11,
    'subversion_name' => 0,
    'icon' => 'chrome',
    'description' => 'Chrome11',
  ),
  'Chrome12' => 
  array (
    'type' => 10004,
    'version' => 10007,
    'subversion' => 0,
    'type_name' => 'Chrome',
    'version_name' => 12,
    'subversion_name' => 0,
    'icon' => 'chrome',
    'description' => 'Chrome12',
  ),
  'Chrome13' => 
  array (
    'type' => 10004,
    'version' => 10008,
    'subversion' => 0,
    'type_name' => 'Chrome',
    'version_name' => 13,
    'subversion_name' => 0,
    'icon' => 'chrome',
    'description' => 'Chrome13',
  ),
  'Chrome14' => 
  array (
    'type' => 10004,
    'version' => 10009,
    'subversion' => 0,
    'type_name' => 'Chrome',
    'version_name' => 14,
    'subversion_name' => 0,
    'icon' => 'chrome',
    'description' => 'Chrome14',
  ),
  'Chrome15' => 
  array (
    'type' => 10004,
    'version' => 10010,
    'subversion' => 0,
    'type_name' => 'Chrome',
    'version_name' => 15,
    'subversion_name' => 0,
    'icon' => 'chrome',
    'description' => 'Chrome15',
  ),
  'Chrome16' => 
  array (
    'type' => 10004,
    'version' => 10056,
    'subversion' => 0,
    'type_name' => 'Chrome',
    'version_name' => 16,
    'subversion_name' => 0,
    'icon' => 'chrome',
    'description' => 'Chrome16',
  ),
  '360Chrome' => 
  array (
    'type' => 11356,
    'version' => 0,
    'subversion' => 0,
    'type_name' => '360Chrome',
    'version_name' => 0,
    'subversion_name' => 0,
    'icon' => '360chrome',
    'description' => '360Chrome',
  ),
  'CometBird' => 
  array (
    'type' => 11456,
    'version' => 0,
    'subversion' => 0,
    'type_name' => 'CometBird',
    'version_name' => 0,
    'subversion_name' => 0,
    'icon' => 'cometbird',
    'description' => 'CometBird',
  ),
  'Dillo' => 
  array (
    'type' => 11556,
    'version' => 0,
    'subversion' => 0,
    'type_name' => 'Dillo',
    'version_name' => 0,
    'subversion_name' => 0,
    'icon' => 'dillo',
    'description' => 'Dillo',
  ),
  'ELinks' => 
  array (
    'type' => 11656,
    'version' => 0,
    'subversion' => 0,
    'type_name' => 'ELinks',
    'version_name' => 0,
    'subversion_name' => 0,
    'icon' => 'elinks',
    'description' => 'ELinks',
  ),
  'Epiphany' => 
  array (
    'type' => 11756,
    'version' => 0,
    'subversion' => 0,
    'type_name' => 'Epiphany',
    'version_name' => 0,
    'subversion_name' => 0,
    'icon' => 'epiphany',
    'description' => 'Epiphany',
  ),
  'Fennec' => 
  array (
    'type' => 11856,
    'version' => 0,
    'subversion' => 0,
    'type_name' => 'Fennec',
    'version_name' => 0,
    'subversion_name' => 0,
    'icon' => 'fennec',
    'description' => 'Fennec',
  ),
  'Dolfin' => 
  array (
    'type' => 11956,
    'version' => 0,
    'subversion' => 0,
    'type_name' => 'Dolfin',
    'version_name' => 0,
    'subversion_name' => 0,
    'icon' => 'dolfin',
    'description' => 'Dolfin',
  ),
  'Phoenix' => 
  array (
    'type' => 12056,
    'version' => 0,
    'subversion' => 0,
    'type_name' => 'Phoenix',
    'version_name' => 0,
    'subversion_name' => 0,
    'icon' => 'phoenix',
    'description' => 'Phoenix',
  ),
  'Firebird' => 
  array (
    'type' => 12156,
    'version' => 0,
    'subversion' => 0,
    'type_name' => 'Firebird',
    'version_name' => 0,
    'subversion_name' => 0,
    'icon' => 'firebird',
    'description' => 'Firebird',
  ),
  'Bonecho' => 
  array (
    'type' => 12256,
    'version' => 0,
    'subversion' => 0,
    'type_name' => 'Bonecho',
    'version_name' => 0,
    'subversion_name' => 0,
    'icon' => 'bonecho',
    'description' => 'Bonecho',
  ),
  'Minefield' => 
  array (
    'type' => 12356,
    'version' => 0,
    'subversion' => 0,
    'type_name' => 'Minefield',
    'version_name' => 0,
    'subversion_name' => 0,
    'icon' => 'minefield',
    'description' => 'Minefield',
  ),
  'Namoroka' => 
  array (
    'type' => 12456,
    'version' => 0,
    'subversion' => 0,
    'type_name' => 'Namoroka',
    'version_name' => 0,
    'subversion_name' => 0,
    'icon' => 'namoroka',
    'description' => 'Namoroka',
  ),
  'Shiretoko' => 
  array (
    'type' => 12556,
    'version' => 0,
    'subversion' => 0,
    'type_name' => 'Shiretoko',
    'version_name' => 0,
    'subversion_name' => 0,
    'icon' => 'shiretoko',
    'description' => 'Shiretoko',
  ),
  'Granparadiso' => 
  array (
    'type' => 12656,
    'version' => 0,
    'subversion' => 0,
    'type_name' => 'Granparadiso',
    'version_name' => 0,
    'subversion_name' => 0,
    'icon' => 'granparadiso',
    'description' => 'Granparadiso',
  ),
  'Iceweasel' => 
  array (
    'type' => 12756,
    'version' => 0,
    'subversion' => 0,
    'type_name' => 'Iceweasel',
    'version_name' => 0,
    'subversion_name' => 0,
    'icon' => 'iceweasel',
    'description' => 'Iceweasel',
  ),
  'Icecat' => 
  array (
    'type' => 12856,
    'version' => 0,
    'subversion' => 0,
    'type_name' => 'Icecat',
    'version_name' => 0,
    'subversion_name' => 0,
    'icon' => 'icecat',
    'description' => 'Icecat',
  ),
  'Firefox' => 
  array (
    'type' => 10013,
    'version' => 0,
    'subversion' => 0,
    'type_name' => 'Firefox',
    'version_name' => 0,
    'subversion_name' => 0,
    'icon' => 'firefox',
    'description' => 'Firefox',
  ),
  'Firefox2' => 
  array (
    'type' => 10013,
    'version' => 10014,
    'subversion' => 0,
    'type_name' => 'Firefox',
    'version_name' => 2,
    'subversion_name' => 0,
    'icon' => 'firefox',
    'description' => 'Firefox2',
  ),
  'Firefox3' => 
  array (
    'type' => 10013,
    'version' => 10015,
    'subversion' => 0,
    'type_name' => 'Firefox',
    'version_name' => 3,
    'subversion_name' => 0,
    'icon' => 'firefox',
    'description' => 'Firefox3',
  ),
  'Firefox4' => 
  array (
    'type' => 10013,
    'version' => 10016,
    'subversion' => 0,
    'type_name' => 'Firefox',
    'version_name' => 4,
    'subversion_name' => 0,
    'icon' => 'firefox',
    'description' => 'Firefox4',
  ),
  'Firefox5' => 
  array (
    'type' => 10013,
    'version' => 10017,
    'subversion' => 0,
    'type_name' => 'Firefox',
    'version_name' => 5,
    'subversion_name' => 0,
    'icon' => 'firefox',
    'description' => 'Firefox5',
  ),
  'Firefox6' => 
  array (
    'type' => 10013,
    'version' => 10018,
    'subversion' => 0,
    'type_name' => 'Firefox',
    'version_name' => 6,
    'subversion_name' => 0,
    'icon' => 'firefox',
    'description' => 'Firefox6',
  ),
  'Firefox7' => 
  array (
    'type' => 10013,
    'version' => 10055,
    'subversion' => 0,
    'type_name' => 'Firefox',
    'version_name' => 7,
    'subversion_name' => 0,
    'icon' => 'firefox',
    'description' => 'Firefox7',
  ),
  'Firefox8' => 
  array (
    'type' => 10013,
    'version' => 10093,
    'subversion' => 0,
    'type_name' => 'Firefox',
    'icon' => 'firefox',
    'description' => 'Firefox8',
  ),
  'Firefox9' => 
  array (
    'type' => 10013,
    'version' => 10103,
    'subversion' => 0,
    'type_name' => 'Firefox',
    'icon' => 'firefox',
    'description' => 'Firefox9',
  ),
  'Firefox10' => 
  array (
    'type' => 10013,
    'version' => 10113,
    'subversion' => 0,
    'type_name' => 'Firefox',
    'icon' => 'firefox',
    'description' => 'Firefox10',
  ),
  'Flock' => 
  array (
    'type' => 12956,
    'version' => 0,
    'subversion' => 0,
    'type_name' => 'Flock',
    'version_name' => 0,
    'subversion_name' => 0,
    'icon' => 'flock',
    'description' => 'Flock',
  ),
  'Fluid' => 
  array (
    'type' => 13056,
    'version' => 0,
    'subversion' => 0,
    'type_name' => 'Fluid',
    'version_name' => 0,
    'subversion_name' => 0,
    'icon' => 'fluid',
    'description' => 'Fluid',
  ),
  'Galeon' => 
  array (
    'type' => 13156,
    'version' => 0,
    'subversion' => 0,
    'type_name' => 'Galeon',
    'version_name' => 0,
    'subversion_name' => 0,
    'icon' => 'galeon',
    'description' => 'Galeon',
  ),
  'GoogleEarth' => 
  array (
    'type' => 13256,
    'version' => 0,
    'subversion' => 0,
    'type_name' => 'GoogleEarth',
    'version_name' => 0,
    'subversion_name' => 0,
    'icon' => 'googleearth',
    'description' => 'GoogleEarth',
  ),
  'Hana' => 
  array (
    'type' => 13356,
    'version' => 0,
    'subversion' => 0,
    'type_name' => 'Hana',
    'version_name' => 0,
    'subversion_name' => 0,
    'icon' => 'hana',
    'description' => 'Hana',
  ),
  'HotJava' => 
  array (
    'type' => 13456,
    'version' => 0,
    'subversion' => 0,
    'type_name' => 'HotJava',
    'version_name' => 0,
    'subversion_name' => 0,
    'icon' => 'hotjava',
    'description' => 'HotJava',
  ),
  'IBrowse' => 
  array (
    'type' => 13556,
    'version' => 0,
    'subversion' => 0,
    'type_name' => 'IBrowse',
    'version_name' => 0,
    'subversion_name' => 0,
    'icon' => 'ibrowse',
    'description' => 'IBrowse',
  ),
  'iCab' => 
  array (
    'type' => 13656,
    'version' => 0,
    'subversion' => 0,
    'type_name' => 'iCab',
    'version_name' => 0,
    'subversion_name' => 0,
    'icon' => 'icab',
    'description' => 'iCab',
  ),
  'IE' => 
  array (
    'type' => 10019,
    'version' => 0,
    'subversion' => 0,
    'type_name' => 'IE',
    'version_name' => 0,
    'subversion_name' => 0,
    'icon' => 'ie',
    'description' => 'IE',
  ),
  'IE5' => 
  array (
    'type' => 10019,
    'version' => 10020,
    'subversion' => 0,
    'type_name' => 'IE',
    'version_name' => 5,
    'subversion_name' => 0,
    'icon' => 'ie',
    'description' => 'IE5',
  ),
  'IE6' => 
  array (
    'type' => 10019,
    'version' => 10021,
    'subversion' => 0,
    'type_name' => 'IE',
    'version_name' => 6,
    'subversion_name' => 0,
    'icon' => 'ie',
    'description' => 'IE6',
  ),
  'IE7' => 
  array (
    'type' => 10019,
    'version' => 10022,
    'subversion' => 0,
    'type_name' => 'IE',
    'version_name' => 7,
    'subversion_name' => 0,
    'icon' => 'ie',
    'description' => 'IE7',
  ),
  'IE8' => 
  array (
    'type' => 10019,
    'version' => 10023,
    'subversion' => 0,
    'type_name' => 'IE',
    'version_name' => 8,
    'subversion_name' => 0,
    'icon' => 'ie',
    'description' => 'IE8',
  ),
  'IE9' => 
  array (
    'type' => 10019,
    'version' => 10024,
    'subversion' => 0,
    'type_name' => 'IE',
    'version_name' => 9,
    'subversion_name' => 0,
    'icon' => 'ie',
    'description' => 'IE9',
  ),
  '360SE' => 
  array (
    'type' => 13756,
    'version' => 0,
    'subversion' => 0,
    'type_name' => '360SE',
    'version_name' => 0,
    'subversion_name' => 0,
    'icon' => '360se',
    'description' => '360SE',
  ),
  'Iron' => 
  array (
    'type' => 13856,
    'version' => 0,
    'subversion' => 0,
    'type_name' => 'Iron',
    'version_name' => 0,
    'subversion_name' => 0,
    'icon' => 'iron',
    'description' => 'Iron',
  ),
  'Kapiko' => 
  array (
    'type' => 13956,
    'version' => 0,
    'subversion' => 0,
    'type_name' => 'Kapiko',
    'version_name' => 0,
    'subversion_name' => 0,
    'icon' => 'kapiko',
    'description' => 'Kapiko',
  ),
  'Kazehakase' => 
  array (
    'type' => 14056,
    'version' => 0,
    'subversion' => 0,
    'type_name' => 'Kazehakase',
    'version_name' => 0,
    'subversion_name' => 0,
    'icon' => 'kazehakase',
    'description' => 'Kazehakase',
  ),
  'K-Meleon' => 
  array (
    'type' => 14156,
    'version' => 0,
    'subversion' => 0,
    'type_name' => 'K-Meleon',
    'version_name' => 0,
    'subversion_name' => 0,
    'icon' => 'k-meleon',
    'description' => 'K-Meleon',
  ),
  'Konqueror' => 
  array (
    'type' => 10034,
    'version' => 0,
    'subversion' => 0,
    'type_name' => 'Konqueror',
    'version_name' => 0,
    'subversion_name' => 0,
    'icon' => 'konqueror',
    'description' => 'Konqueror',
  ),
  'Konqueror4' => 
  array (
    'type' => 10034,
    'version' => 10035,
    'subversion' => 0,
    'type_name' => 'Konqueror',
    'version_name' => 4,
    'subversion_name' => 0,
    'icon' => 'konqueror',
    'description' => 'Konqueror4',
  ),
  'Links' => 
  array (
    'type' => 14256,
    'version' => 0,
    'subversion' => 0,
    'type_name' => 'Links',
    'version_name' => 0,
    'subversion_name' => 0,
    'icon' => 'links',
    'description' => 'Links',
  ),
  'Lynx' => 
  array (
    'type' => 14356,
    'version' => 0,
    'subversion' => 0,
    'type_name' => 'Lynx',
    'version_name' => 0,
    'subversion_name' => 0,
    'icon' => 'lynx',
    'description' => 'Lynx',
  ),
  'Midori' => 
  array (
    'type' => 14456,
    'version' => 0,
    'subversion' => 0,
    'type_name' => 'Midori',
    'version_name' => 0,
    'subversion_name' => 0,
    'icon' => 'midori',
    'description' => 'Midori',
  ),
  'Myie' => 
  array (
    'type' => 14556,
    'version' => 0,
    'subversion' => 0,
    'type_name' => 'Myie',
    'version_name' => 0,
    'subversion_name' => 0,
    'icon' => 'myie',
    'description' => 'Myie',
  ),
  'Myie2' => 
  array (
    'type' => 14656,
    'version' => 0,
    'subversion' => 0,
    'type_name' => 'Myie2',
    'version_name' => 0,
    'subversion_name' => 0,
    'icon' => 'myie',
    'description' => 'Myie2',
  ),
  'Maxthon' => 
  array (
    'type' => 10036,
    'version' => 0,
    'subversion' => 0,
    'type_name' => 'Maxthon',
    'version_name' => 0,
    'subversion_name' => 0,
    'icon' => 'maxthon',
    'description' => 'Maxthon',
  ),
  'Maxthon2' => 
  array (
    'type' => 10036,
    'version' => 10037,
    'subversion' => 0,
    'type_name' => 'Maxthon',
    'version_name' => 2,
    'subversion_name' => 0,
    'icon' => 'maxthon',
    'description' => 'Maxthon2',
  ),
  'Maxthon3' => 
  array (
    'type' => 10036,
    'version' => 10038,
    'subversion' => 0,
    'type_name' => 'Maxthon',
    'version_name' => 3,
    'subversion_name' => 0,
    'icon' => 'maxthon',
    'description' => 'Maxthon3',
  ),
  'QQBrowser' => 
  array (
    'type' => 14756,
    'version' => 0,
    'subversion' => 0,
    'type_name' => 'QQBrowser',
    'version_name' => 0,
    'subversion_name' => 0,
    'icon' => 'qqbrowser',
    'description' => 'QQBrowser',
  ),
  'QQBrowser6' => 
  array (
    'type' => 14756,
    'version' => 14816,
    'subversion' => 0,
    'type_name' => 'QQBrowser',
    'version_name' => 0,
    'subversion_name' => 0,
    'icon' => 'qqbrowser',
    'description' => 'QQBrowser6',
  ),
  'TencentTraveler' => 
  array (
    'type' => 15700,
    'version' => 0,
    'subversion' => 0,
    'type_name' => 'TencentTraveler',
    'version_name' => 0,
    'subversion_name' => 0,
    'icon' => 'tencenttraveler',
    'description' => 'TencentTraveler',
  ),
  'TencentTraveler1' => 
  array (
    'type' => 15700,
    'version' => 15710,
    'subversion' => 0,
    'type_name' => 'TencentTraveler',
    'version_name' => 0,
    'subversion_name' => 0,
    'icon' => 'tencenttraveler',
    'description' => 'TencentTraveler1',
  ),
  'TencentTraveler2' => 
  array (
    'type' => 15700,
    'version' => 15720,
    'subversion' => 0,
    'type_name' => 'TencentTraveler',
    'version_name' => 0,
    'subversion_name' => 0,
    'icon' => 'tencenttraveler',
    'description' => 'TencentTraveler2',
  ),
  'TencentTraveler3' => 
  array (
    'type' => 15700,
    'version' => 15730,
    'subversion' => 0,
    'type_name' => 'TencentTraveler',
    'version_name' => 0,
    'subversion_name' => 0,
    'icon' => 'tencenttraveler',
    'description' => 'TencentTraveler3',
  ),
  'TencentTraveler4' => 
  array (
    'type' => 15700,
    'version' => 15740,
    'subversion' => 0,
    'type_name' => 'TencentTraveler',
    'version_name' => 0,
    'subversion_name' => 0,
    'icon' => 'tencenttraveler',
    'description' => 'TencentTraveler4',
  ),
  'SoGou' => 
  array (
    'type' => 14856,
    'version' => 0,
    'subversion' => 0,
    'type_name' => 'SoGou',
    'version_name' => 0,
    'subversion_name' => 0,
    'icon' => 'sogou',
    'description' => 'SoGou',
  ),
  'SoGou1' => 
  array (
    'type' => 14856,
    'version' => 14866,
    'subversion' => 0,
    'type_name' => 'SoGou',
    'version_name' => 0,
    'subversion_name' => 0,
    'icon' => 'sogou',
    'description' => 'SoGou1',
  ),
  'SoGou2' => 
  array (
    'type' => 14856,
    'version' => 14876,
    'subversion' => 0,
    'type_name' => 'SoGou',
    'version_name' => 0,
    'subversion_name' => 0,
    'icon' => 'sogou',
    'description' => 'SoGou2',
  ),
  'SoGou3' => 
  array (
    'type' => 14856,
    'version' => 14886,
    'subversion' => 0,
    'type_name' => 'SoGou',
    'version_name' => 0,
    'subversion_name' => 0,
    'icon' => 'sogou',
    'description' => 'SoGou3',
  ),
  'Mozilla' => 
  array (
    'type' => 10039,
    'version' => 0,
    'subversion' => 0,
    'type_name' => 'Mozilla',
    'version_name' => 0,
    'subversion_name' => 0,
    'icon' => 'mozilla',
    'description' => 'Mozilla',
  ),
  'Mozilla1' => 
  array (
    'type' => 10039,
    'version' => 10040,
    'subversion' => 0,
    'type_name' => 'Mozilla',
    'version_name' => 1,
    'subversion_name' => 0,
    'icon' => 'mozilla',
    'description' => 'Mozilla1',
  ),
  'Gnuzilla' => 
  array (
    'type' => 14956,
    'version' => 0,
    'subversion' => 0,
    'type_name' => 'Gnuzilla',
    'version_name' => 0,
    'subversion_name' => 0,
    'icon' => 'gnuzilla',
    'description' => 'Gnuzilla',
  ),
  'Iceape' => 
  array (
    'type' => 15056,
    'version' => 0,
    'subversion' => 0,
    'type_name' => 'Iceape',
    'version_name' => 0,
    'subversion_name' => 0,
    'icon' => 'iceape',
    'description' => 'Iceape',
  ),
  'SeaMonkey' => 
  array (
    'type' => 15156,
    'version' => 0,
    'subversion' => 0,
    'type_name' => 'SeaMonkey',
    'version_name' => 0,
    'subversion_name' => 0,
    'icon' => 'seamonkey',
    'description' => 'SeaMonkey',
  ),
  'Mosaic' => 
  array (
    'type' => 15256,
    'version' => 0,
    'subversion' => 0,
    'type_name' => 'Mosaic',
    'version_name' => 0,
    'subversion_name' => 0,
    'icon' => 'mosaic',
    'description' => 'Mosaic',
  ),
  'Navigator' => 
  array (
    'type' => 15356,
    'version' => 0,
    'subversion' => 0,
    'type_name' => 'Navigator',
    'version_name' => 0,
    'subversion_name' => 0,
    'icon' => 'navigator',
    'description' => 'Navigator',
  ),
  'Netscape6' => 
  array (
    'type' => 15456,
    'version' => 0,
    'subversion' => 0,
    'type_name' => 'Netscape6',
    'version_name' => 0,
    'subversion_name' => 0,
    'icon' => 'netscape6',
    'description' => 'Netscape6',
  ),
  'Netscape' => 
  array (
    'type' => 15556,
    'version' => 0,
    'subversion' => 0,
    'type_name' => 'Netscape',
    'version_name' => 0,
    'subversion_name' => 0,
    'icon' => 'netscape',
    'description' => 'Netscape',
  ),
  'OmniWeb' => 
  array (
    'type' => 15656,
    'version' => 0,
    'subversion' => 0,
    'type_name' => 'OmniWeb',
    'version_name' => 0,
    'subversion_name' => 0,
    'icon' => 'omniweb',
    'description' => 'OmniWeb',
  ),
  'Opera' => 
  array (
    'type' => 10042,
    'version' => 0,
    'subversion' => 0,
    'type_name' => 'Opera',
    'version_name' => 0,
    'subversion_name' => 0,
    'icon' => 'opera',
    'description' => 'Opera',
  ),
  'Opera10' => 
  array (
    'type' => 10042,
    'version' => 10043,
    'subversion' => 0,
    'type_name' => 'Opera',
    'version_name' => 10,
    'subversion_name' => 0,
    'icon' => 'opera',
    'description' => 'Opera10',
  ),
  'Opera11' => 
  array (
    'type' => 10042,
    'version' => 10044,
    'subversion' => 0,
    'type_name' => 'Opera',
    'version_name' => 11,
    'subversion_name' => 0,
    'icon' => 'opera',
    'description' => 'Opera11',
  ),
  'Opera12' => 
  array (
    'type' => 10042,
    'version' => 10045,
    'subversion' => 0,
    'type_name' => 'Opera',
    'version_name' => 12,
    'subversion_name' => 0,
    'icon' => 'opera',
    'description' => 'Opera12',
  ),
  'UCWEB' => 
  array (
    'type' => 15756,
    'version' => 0,
    'subversion' => 0,
    'type_name' => 'UCWEB',
    'version_name' => 0,
    'subversion_name' => 0,
    'icon' => 'ucweb',
    'description' => 'UCWEB',
  ),
  'Safari' => 
  array (
    'type' => 10050,
    'version' => 0,
    'subversion' => 0,
    'type_name' => 'Safari',
    'version_name' => 0,
    'subversion_name' => 0,
    'icon' => 'safari',
    'description' => 'Safari',
  ),
  'Safari3' => 
  array (
    'type' => 10050,
    'version' => 10051,
    'subversion' => 0,
    'type_name' => 'Safari',
    'version_name' => 3,
    'subversion_name' => 0,
    'icon' => 'safari',
    'description' => 'Safari3',
  ),
  'Safari4' => 
  array (
    'type' => 10050,
    'version' => 10052,
    'subversion' => 0,
    'type_name' => 'Safari',
    'version_name' => 4,
    'subversion_name' => 0,
    'icon' => 'safari',
    'description' => 'Safari4',
  ),
  'Safari5' => 
  array (
    'type' => 10050,
    'version' => 10053,
    'subversion' => 0,
    'type_name' => 'Safari',
    'version_name' => 5,
    'subversion_name' => 0,
    'icon' => 'safari',
    'description' => 'Safari5',
  ),
  'Titanium' => 
  array (
    'type' => 15856,
    'version' => 0,
    'subversion' => 0,
    'type_name' => 'Titanium',
    'version_name' => 0,
    'subversion_name' => 0,
    'icon' => 'titanium',
    'description' => 'Titanium',
  ),
  'webOS' => 
  array (
    'type' => 15956,
    'version' => 0,
    'subversion' => 0,
    'type_name' => 'webOS',
    'version_name' => 0,
    'subversion_name' => 0,
    'icon' => 'webos',
    'description' => 'webOS',
  ),
  'WebPro' => 
  array (
    'type' => 16056,
    'version' => 0,
    'subversion' => 0,
    'type_name' => 'WebPro',
    'version_name' => 0,
    'subversion_name' => 0,
    'icon' => 'webpro',
    'description' => 'WebPro',
  ),
  'Android' => 
  array (
    'type' => 10000,
    'version' => 0,
    'subversion' => 0,
    'type_name' => 'Android',
    'version_name' => 0,
    'subversion_name' => 0,
    'icon' => 'android',
    'description' => 'Android',
  ),
  'Android1' => 
  array (
    'type' => 10000,
    'version' => 10001,
    'subversion' => 0,
    'type_name' => 'Android',
    'version_name' => 1,
    'subversion_name' => 0,
    'icon' => 'android',
    'description' => 'Android1',
  ),
  'Android2' => 
  array (
    'type' => 10000,
    'version' => 10002,
    'subversion' => 0,
    'type_name' => 'Android',
    'version_name' => 2,
    'subversion_name' => 0,
    'icon' => 'android',
    'description' => 'Android2',
  ),
  'iPad' => 
  array (
    'type' => 10025,
    'version' => 0,
    'subversion' => 0,
    'type_name' => 'iPad',
    'version_name' => 0,
    'subversion_name' => 0,
    'icon' => 'ipad',
    'description' => 'iPad',
  ),
  'iPad4' => 
  array (
    'type' => 10025,
    'version' => 10026,
    'subversion' => 0,
    'type_name' => 'iPad',
    'version_name' => 4,
    'subversion_name' => 0,
    'icon' => 'ipad',
    'description' => 'iPad4',
  ),
  'iPhone' => 
  array (
    'type' => 10027,
    'version' => 0,
    'subversion' => 0,
    'type_name' => 'iPhone',
    'version_name' => 0,
    'subversion_name' => 0,
    'icon' => 'iphone',
    'description' => 'iPhone',
  ),
  'iPhone3' => 
  array (
    'type' => 10027,
    'version' => 10028,
    'subversion' => 0,
    'type_name' => 'iPhone',
    'version_name' => 3,
    'subversion_name' => 0,
    'icon' => 'iphone',
    'description' => 'iPhone3',
  ),
  'iPhone4' => 
  array (
    'type' => 10027,
    'version' => 10029,
    'subversion' => 0,
    'type_name' => 'iPhone',
    'version_name' => 4,
    'subversion_name' => 0,
    'icon' => 'iphone',
    'description' => 'iPhone4',
  ),
  'iPod Touch' => 
  array (
    'type' => 10030,
    'version' => 0,
    'subversion' => 0,
    'type_name' => 'iPod Touch',
    'version_name' => 0,
    'subversion_name' => 0,
    'icon' => 'ipod',
    'description' => 'iPod Touch',
  ),
  'iPod Touch4' => 
  array (
    'type' => 10030,
    'version' => 10031,
    'subversion' => 0,
    'type_name' => 'iPod Touch',
    'version_name' => 4,
    'subversion_name' => 0,
    'icon' => 'ipod',
    'description' => 'iPod Touch4',
  ),
  'Kindle' => 
  array (
    'type' => 10032,
    'version' => 0,
    'subversion' => 0,
    'type_name' => 'Kindle',
    'version_name' => 0,
    'subversion_name' => 0,
    'icon' => 'kindle',
    'description' => 'Kindle',
  ),
  'Kindle3' => 
  array (
    'type' => 10032,
    'version' => 10033,
    'subversion' => 0,
    'type_name' => 'Kindle',
    'version_name' => 3,
    'subversion_name' => 0,
    'icon' => 'kindle',
    'description' => 'Kindle3',
  ),
  'Nokia' => 
  array (
    'type' => 10041,
    'version' => 0,
    'subversion' => 0,
    'type_name' => 'Nokia',
    'version_name' => 0,
    'subversion_name' => 0,
    'icon' => 'nokia',
    'description' => 'Nokia',
  ),
  'Opera Mini' => 
  array (
    'type' => 10046,
    'version' => 0,
    'subversion' => 0,
    'type_name' => 'Opera Mini',
    'version_name' => 0,
    'subversion_name' => 0,
    'icon' => 'opera',
    'description' => 'Opera Mini',
  ),
  'Opera Mini4' => 
  array (
    'type' => 10046,
    'version' => 10047,
    'subversion' => 0,
    'type_name' => 'Opera Mini',
    'version_name' => 4,
    'subversion_name' => 0,
    'icon' => 'opera',
    'description' => 'Opera Mini4',
  ),
  'Opera Mini5' => 
  array (
    'type' => 10046,
    'version' => 10048,
    'subversion' => 0,
    'type_name' => 'Opera Mini',
    'version_name' => 5,
    'subversion_name' => 0,
    'icon' => 'opera',
    'description' => 'Opera Mini5',
  ),
  'Opera Mini6' => 
  array (
    'type' => 10046,
    'version' => 10049,
    'subversion' => 0,
    'type_name' => 'Opera Mini',
    'version_name' => 6,
    'subversion_name' => 0,
    'icon' => 'opera',
    'description' => 'Opera Mini6',
  ),
  'Yahoo! Slurp' => 
  array (
    'type' => 10054,
    'version' => 0,
    'subversion' => 0,
    'type_name' => 'Yahoo! Slurp',
    'version_name' => 0,
    'subversion_name' => 0,
    'icon' => 'yahoo',
    'description' => 'Yahoo! Slurp',
  ),
);
$BROWSER_ID_TO_NAME = array (
		  10012 => 
		  array (
			0 => 
			array (
			  0 => 
			  array (
				'type' => 10012,
				'version' => 0,
				'subversion' => 0,
				'icon' => 'unknown',
				'type_name' => 'Unknown',
				'version_name' => 0,
				'subversion_name' => 0,
				'description' => 'Unknown',
			  ),
			),
		  ),
		  10156 => 
		  array (
			0 => 
			array (
			  0 => 
			  array (
				'type' => 10156,
				'version' => 0,
				'subversion' => 0,
				'icon' => 'abrowse',
				'type_name' => 'ABrowse',
				'version_name' => 0,
				'subversion_name' => 0,
				'description' => 'ABrowse',
			  ),
			),
		  ),
		  10256 => 
		  array (
			0 => 
			array (
			  0 => 
			  array (
				'type' => 10256,
				'version' => 0,
				'subversion' => 0,
				'icon' => 'amaya',
				'type_name' => 'Amaya',
				'version_name' => 0,
				'subversion_name' => 0,
				'description' => 'Amaya',
			  ),
			),
		  ),
		  10356 => 
		  array (
			0 => 
			array (
			  0 => 
			  array (
				'type' => 10356,
				'version' => 0,
				'subversion' => 0,
				'icon' => 'amigavoyager',
				'type_name' => 'AmigaVoyager',
				'version_name' => 0,
				'subversion_name' => 0,
				'description' => 'AmigaVoyager',
			  ),
			),
		  ),
		  10456 => 
		  array (
			0 => 
			array (
			  0 => 
			  array (
				'type' => 10456,
				'version' => 0,
				'subversion' => 0,
				'icon' => 'aweb',
				'type_name' => 'AWeb',
				'version_name' => 0,
				'subversion_name' => 0,
				'description' => 'AWeb',
			  ),
			),
		  ),
		  10556 => 
		  array (
			0 => 
			array (
			  0 => 
			  array (
				'type' => 10556,
				'version' => 0,
				'subversion' => 0,
				'icon' => 'arora',
				'type_name' => 'Arora',
				'version_name' => 0,
				'subversion_name' => 0,
				'description' => 'Arora',
			  ),
			),
		  ),
		  10656 => 
		  array (
			0 => 
			array (
			  0 => 
			  array (
				'type' => 10656,
				'version' => 0,
				'subversion' => 0,
				'icon' => 'baidubrowser',
				'type_name' => 'BaiduBrowser',
				'version_name' => 0,
				'subversion_name' => 0,
				'description' => 'BaiduBrowser',
			  ),
			),
		  ),
		  10756 => 
		  array (
			0 => 
			array (
			  0 => 
			  array (
				'type' => 10756,
				'version' => 0,
				'subversion' => 0,
				'icon' => 'beonex',
				'type_name' => 'Beonex',
				'version_name' => 0,
				'subversion_name' => 0,
				'description' => 'Beonex',
			  ),
			),
		  ),
		  10003 => 
		  array (
			0 => 
			array (
			  0 => 
			  array (
				'type' => 10003,
				'version' => 0,
				'subversion' => 0,
				'icon' => 'blackberry',
				'type_name' => 'BlackBerry',
				'version_name' => 0,
				'subversion_name' => 0,
				'description' => 'BlackBerry',
			  ),
			),
		  ),
		  10856 => 
		  array (
			0 => 
			array (
			  0 => 
			  array (
				'type' => 10856,
				'version' => 0,
				'subversion' => 0,
				'icon' => 'playbook',
				'type_name' => 'PlayBook',
				'version_name' => 0,
				'subversion_name' => 0,
				'description' => 'PlayBook',
			  ),
			),
		  ),
		  10956 => 
		  array (
			0 => 
			array (
			  0 => 
			  array (
				'type' => 10956,
				'version' => 0,
				'subversion' => 0,
				'icon' => 'browsex',
				'type_name' => 'BrowseX',
				'version_name' => 0,
				'subversion_name' => 0,
				'description' => 'BrowseX',
			  ),
			),
		  ),
		  11056 => 
		  array (
			0 => 
			array (
			  0 => 
			  array (
				'type' => 11056,
				'version' => 0,
				'subversion' => 0,
				'icon' => 'chimera',
				'type_name' => 'Chimera',
				'version_name' => 0,
				'subversion_name' => 0,
				'description' => 'Chimera',
			  ),
			),
		  ),
		  11156 => 
		  array (
			0 => 
			array (
			  0 => 
			  array (
				'type' => 11156,
				'version' => 0,
				'subversion' => 0,
				'icon' => 'camino',
				'type_name' => 'Camino',
				'version_name' => 0,
				'subversion_name' => 0,
				'description' => 'Camino',
			  ),
			),
		  ),
		  11256 => 
		  array (
			0 => 
			array (
			  0 => 
			  array (
				'type' => 11256,
				'version' => 0,
				'subversion' => 0,
				'icon' => 'cheshire',
				'type_name' => 'Cheshire',
				'version_name' => 0,
				'subversion_name' => 0,
				'description' => 'Cheshire',
			  ),
			),
		  ),
		  10004 => 
		  array (
			0 => 
			array (
			  0 => 
			  array (
				'type' => 10004,
				'version' => 0,
				'subversion' => 0,
				'icon' => 'chrome',
				'type_name' => 'Chrome',
				'version_name' => 0,
				'subversion_name' => 0,
				'description' => 'Chrome',
			  ),
			),
			10011 => 
			array (
			  0 => 
			  array (
				'type' => 10004,
				'version' => 10011,
				'subversion' => 0,
				'icon' => 'chrome',
				'type_name' => 'Chrome',
				'version_name' => 9,
				'subversion_name' => 0,
				'description' => 'Chrome9',
			  ),
			),
			10005 => 
			array (
			  0 => 
			  array (
				'type' => 10004,
				'version' => 10005,
				'subversion' => 0,
				'icon' => 'chrome',
				'type_name' => 'Chrome',
				'version_name' => 10,
				'subversion_name' => 0,
				'description' => 'Chrome10',
			  ),
			),
			10006 => 
			array (
			  0 => 
			  array (
				'type' => 10004,
				'version' => 10006,
				'subversion' => 0,
				'icon' => 'chrome',
				'type_name' => 'Chrome',
				'version_name' => 11,
				'subversion_name' => 0,
				'description' => 'Chrome11',
			  ),
			),
			10007 => 
			array (
			  0 => 
			  array (
				'type' => 10004,
				'version' => 10007,
				'subversion' => 0,
				'icon' => 'chrome',
				'type_name' => 'Chrome',
				'version_name' => 12,
				'subversion_name' => 0,
				'description' => 'Chrome12',
			  ),
			),
			10008 => 
			array (
			  0 => 
			  array (
				'type' => 10004,
				'version' => 10008,
				'subversion' => 0,
				'icon' => 'chrome',
				'type_name' => 'Chrome',
				'version_name' => 13,
				'subversion_name' => 0,
				'description' => 'Chrome13',
			  ),
			),
			10009 => 
			array (
			  0 => 
			  array (
				'type' => 10004,
				'version' => 10009,
				'subversion' => 0,
				'icon' => 'chrome',
				'type_name' => 'Chrome',
				'version_name' => 14,
				'subversion_name' => 0,
				'description' => 'Chrome14',
			  ),
			),
			10010 => 
			array (
			  0 => 
			  array (
				'type' => 10004,
				'version' => 10010,
				'subversion' => 0,
				'icon' => 'chrome',
				'type_name' => 'Chrome',
				'version_name' => 15,
				'subversion_name' => 0,
				'description' => 'Chrome15',
			  ),
			),
			10056 => 
			array (
			  0 => 
			  array (
				'type' => 10004,
				'version' => 10056,
				'subversion' => 0,
				'icon' => 'chrome',
				'type_name' => 'Chrome',
				'version_name' => 16,
				'subversion_name' => 0,
				'description' => 'Chrome16',
			  ),
			),
		  ),
		  11356 => 
		  array (
			0 => 
			array (
			  0 => 
			  array (
				'type' => 11356,
				'version' => 0,
				'subversion' => 0,
				'icon' => '360chrome',
				'type_name' => '360Chrome',
				'version_name' => 0,
				'subversion_name' => 0,
				'description' => '360Chrome',
			  ),
			),
		  ),
		  11456 => 
		  array (
			0 => 
			array (
			  0 => 
			  array (
				'type' => 11456,
				'version' => 0,
				'subversion' => 0,
				'icon' => 'cometbird',
				'type_name' => 'CometBird',
				'version_name' => 0,
				'subversion_name' => 0,
				'description' => 'CometBird',
			  ),
			),
		  ),
		  11556 => 
		  array (
			0 => 
			array (
			  0 => 
			  array (
				'type' => 11556,
				'version' => 0,
				'subversion' => 0,
				'icon' => 'dillo',
				'type_name' => 'Dillo',
				'version_name' => 0,
				'subversion_name' => 0,
				'description' => 'Dillo',
			  ),
			),
		  ),
		  11656 => 
		  array (
			0 => 
			array (
			  0 => 
			  array (
				'type' => 11656,
				'version' => 0,
				'subversion' => 0,
				'icon' => 'elinks',
				'type_name' => 'ELinks',
				'version_name' => 0,
				'subversion_name' => 0,
				'description' => 'ELinks',
			  ),
			),
		  ),
		  11756 => 
		  array (
			0 => 
			array (
			  0 => 
			  array (
				'type' => 11756,
				'version' => 0,
				'subversion' => 0,
				'icon' => 'epiphany',
				'type_name' => 'Epiphany',
				'version_name' => 0,
				'subversion_name' => 0,
				'description' => 'Epiphany',
			  ),
			),
		  ),
		  11856 => 
		  array (
			0 => 
			array (
			  0 => 
			  array (
				'type' => 11856,
				'version' => 0,
				'subversion' => 0,
				'icon' => 'fennec',
				'type_name' => 'Fennec',
				'version_name' => 0,
				'subversion_name' => 0,
				'description' => 'Fennec',
			  ),
			),
		  ),
		  11956 => 
		  array (
			0 => 
			array (
			  0 => 
			  array (
				'type' => 11956,
				'version' => 0,
				'subversion' => 0,
				'icon' => 'dolfin',
				'type_name' => 'Dolfin',
				'version_name' => 0,
				'subversion_name' => 0,
				'description' => 'Dolfin',
			  ),
			),
		  ),
		  12056 => 
		  array (
			0 => 
			array (
			  0 => 
			  array (
				'type' => 12056,
				'version' => 0,
				'subversion' => 0,
				'icon' => 'phoenix',
				'type_name' => 'Phoenix',
				'version_name' => 0,
				'subversion_name' => 0,
				'description' => 'Phoenix',
			  ),
			),
		  ),
		  12156 => 
		  array (
			0 => 
			array (
			  0 => 
			  array (
				'type' => 12156,
				'version' => 0,
				'subversion' => 0,
				'icon' => 'firebird',
				'type_name' => 'Firebird',
				'version_name' => 0,
				'subversion_name' => 0,
				'description' => 'Firebird',
			  ),
			),
		  ),
		  12256 => 
		  array (
			0 => 
			array (
			  0 => 
			  array (
				'type' => 12256,
				'version' => 0,
				'subversion' => 0,
				'icon' => 'bonecho',
				'type_name' => 'Bonecho',
				'version_name' => 0,
				'subversion_name' => 0,
				'description' => 'Bonecho',
			  ),
			),
		  ),
		  12356 => 
		  array (
			0 => 
			array (
			  0 => 
			  array (
				'type' => 12356,
				'version' => 0,
				'subversion' => 0,
				'icon' => 'minefield',
				'type_name' => 'Minefield',
				'version_name' => 0,
				'subversion_name' => 0,
				'description' => 'Minefield',
			  ),
			),
		  ),
		  12456 => 
		  array (
			0 => 
			array (
			  0 => 
			  array (
				'type' => 12456,
				'version' => 0,
				'subversion' => 0,
				'icon' => 'namoroka',
				'type_name' => 'Namoroka',
				'version_name' => 0,
				'subversion_name' => 0,
				'description' => 'Namoroka',
			  ),
			),
		  ),
		  12556 => 
		  array (
			0 => 
			array (
			  0 => 
			  array (
				'type' => 12556,
				'version' => 0,
				'subversion' => 0,
				'icon' => 'shiretoko',
				'type_name' => 'Shiretoko',
				'version_name' => 0,
				'subversion_name' => 0,
				'description' => 'Shiretoko',
			  ),
			),
		  ),
		  12656 => 
		  array (
			0 => 
			array (
			  0 => 
			  array (
				'type' => 12656,
				'version' => 0,
				'subversion' => 0,
				'icon' => 'granparadiso',
				'type_name' => 'Granparadiso',
				'version_name' => 0,
				'subversion_name' => 0,
				'description' => 'Granparadiso',
			  ),
			),
		  ),
		  12756 => 
		  array (
			0 => 
			array (
			  0 => 
			  array (
				'type' => 12756,
				'version' => 0,
				'subversion' => 0,
				'icon' => 'iceweasel',
				'type_name' => 'Iceweasel',
				'version_name' => 0,
				'subversion_name' => 0,
				'description' => 'Iceweasel',
			  ),
			),
		  ),
		  12856 => 
		  array (
			0 => 
			array (
			  0 => 
			  array (
				'type' => 12856,
				'version' => 0,
				'subversion' => 0,
				'icon' => 'icecat',
				'type_name' => 'Icecat',
				'version_name' => 0,
				'subversion_name' => 0,
				'description' => 'Icecat',
			  ),
			),
		  ),
		  10013 => 
		  array (
			0 => 
			array (
			  0 => 
			  array (
				'type' => 10013,
				'version' => 0,
				'subversion' => 0,
				'icon' => 'firefox',
				'type_name' => 'Firefox',
				'version_name' => 0,
				'subversion_name' => 0,
				'description' => 'Firefox',
			  ),
			),
			10014 => 
			array (
			  0 => 
			  array (
				'type' => 10013,
				'version' => 10014,
				'subversion' => 0,
				'icon' => 'firefox',
				'type_name' => 'Firefox',
				'version_name' => 2,
				'subversion_name' => 0,
				'description' => 'Firefox2',
			  ),
			),
			10015 => 
			array (
			  0 => 
			  array (
				'type' => 10013,
				'version' => 10015,
				'subversion' => 0,
				'icon' => 'firefox',
				'type_name' => 'Firefox',
				'version_name' => 3,
				'subversion_name' => 0,
				'description' => 'Firefox3',
			  ),
			),
			10016 => 
			array (
			  0 => 
			  array (
				'type' => 10013,
				'version' => 10016,
				'subversion' => 0,
				'icon' => 'firefox',
				'type_name' => 'Firefox',
				'version_name' => 4,
				'subversion_name' => 0,
				'description' => 'Firefox4',
			  ),
			),
			10017 => 
			array (
			  0 => 
			  array (
				'type' => 10013,
				'version' => 10017,
				'subversion' => 0,
				'icon' => 'firefox',
				'type_name' => 'Firefox',
				'version_name' => 5,
				'subversion_name' => 0,
				'description' => 'Firefox5',
			  ),
			),
			10018 => 
			array (
			  0 => 
			  array (
				'type' => 10013,
				'version' => 10018,
				'subversion' => 0,
				'icon' => 'firefox',
				'type_name' => 'Firefox',
				'version_name' => 6,
				'subversion_name' => 0,
				'description' => 'Firefox6',
			  ),
			),
			10055 => 
			array (
			  0 => 
			  array (
				'type' => 10013,
				'version' => 10055,
				'subversion' => 0,
				'icon' => 'firefox',
				'type_name' => 'Firefox',
				'version_name' => 7,
				'subversion_name' => 0,
				'description' => 'Firefox7',
			  ),
			),
		  ),
		  12956 => 
		  array (
			0 => 
			array (
			  0 => 
			  array (
				'type' => 12956,
				'version' => 0,
				'subversion' => 0,
				'icon' => 'flock',
				'type_name' => 'Flock',
				'version_name' => 0,
				'subversion_name' => 0,
				'description' => 'Flock',
			  ),
			),
		  ),
		  13056 => 
		  array (
			0 => 
			array (
			  0 => 
			  array (
				'type' => 13056,
				'version' => 0,
				'subversion' => 0,
				'icon' => 'fluid',
				'type_name' => 'Fluid',
				'version_name' => 0,
				'subversion_name' => 0,
				'description' => 'Fluid',
			  ),
			),
		  ),
		  13156 => 
		  array (
			0 => 
			array (
			  0 => 
			  array (
				'type' => 13156,
				'version' => 0,
				'subversion' => 0,
				'icon' => 'galeon',
				'type_name' => 'Galeon',
				'version_name' => 0,
				'subversion_name' => 0,
				'description' => 'Galeon',
			  ),
			),
		  ),
		  13256 => 
		  array (
			0 => 
			array (
			  0 => 
			  array (
				'type' => 13256,
				'version' => 0,
				'subversion' => 0,
				'icon' => 'googleearth',
				'type_name' => 'GoogleEarth',
				'version_name' => 0,
				'subversion_name' => 0,
				'description' => 'GoogleEarth',
			  ),
			),
		  ),
		  13356 => 
		  array (
			0 => 
			array (
			  0 => 
			  array (
				'type' => 13356,
				'version' => 0,
				'subversion' => 0,
				'icon' => 'hana',
				'type_name' => 'Hana',
				'version_name' => 0,
				'subversion_name' => 0,
				'description' => 'Hana',
			  ),
			),
		  ),
		  13456 => 
		  array (
			0 => 
			array (
			  0 => 
			  array (
				'type' => 13456,
				'version' => 0,
				'subversion' => 0,
				'icon' => 'hotjava',
				'type_name' => 'HotJava',
				'version_name' => 0,
				'subversion_name' => 0,
				'description' => 'HotJava',
			  ),
			),
		  ),
		  13556 => 
		  array (
			0 => 
			array (
			  0 => 
			  array (
				'type' => 13556,
				'version' => 0,
				'subversion' => 0,
				'icon' => 'ibrowse',
				'type_name' => 'IBrowse',
				'version_name' => 0,
				'subversion_name' => 0,
				'description' => 'IBrowse',
			  ),
			),
		  ),
		  13656 => 
		  array (
			0 => 
			array (
			  0 => 
			  array (
				'type' => 13656,
				'version' => 0,
				'subversion' => 0,
				'icon' => 'icab',
				'type_name' => 'iCab',
				'version_name' => 0,
				'subversion_name' => 0,
				'description' => 'iCab',
			  ),
			),
		  ),
		  10019 => 
		  array (
			0 => 
			array (
			  0 => 
			  array (
				'type' => 10019,
				'version' => 0,
				'subversion' => 0,
				'icon' => 'ie',
				'type_name' => 'IE',
				'version_name' => 0,
				'subversion_name' => 0,
				'description' => 'IE',
			  ),
			),
			10020 => 
			array (
			  0 => 
			  array (
				'type' => 10019,
				'version' => 10020,
				'subversion' => 0,
				'icon' => 'ie',
				'type_name' => 'IE',
				'version_name' => 5,
				'subversion_name' => 0,
				'description' => 'IE5',
			  ),
			),
			10021 => 
			array (
			  0 => 
			  array (
				'type' => 10019,
				'version' => 10021,
				'subversion' => 0,
				'icon' => 'ie',
				'type_name' => 'IE',
				'version_name' => 6,
				'subversion_name' => 0,
				'description' => 'IE6',
			  ),
			),
			10022 => 
			array (
			  0 => 
			  array (
				'type' => 10019,
				'version' => 10022,
				'subversion' => 0,
				'icon' => 'ie',
				'type_name' => 'IE',
				'version_name' => 7,
				'subversion_name' => 0,
				'description' => 'IE7',
			  ),
			),
			10023 => 
			array (
			  0 => 
			  array (
				'type' => 10019,
				'version' => 10023,
				'subversion' => 0,
				'icon' => 'ie',
				'type_name' => 'IE',
				'version_name' => 8,
				'subversion_name' => 0,
				'description' => 'IE8',
			  ),
			),
			10024 => 
			array (
			  0 => 
			  array (
				'type' => 10019,
				'version' => 10024,
				'subversion' => 0,
				'icon' => 'ie',
				'type_name' => 'IE',
				'version_name' => 9,
				'subversion_name' => 0,
				'description' => 'IE9',
			  ),
			),
		  ),
		  13756 => 
		  array (
			0 => 
			array (
			  0 => 
			  array (
				'type' => 13756,
				'version' => 0,
				'subversion' => 0,
				'icon' => '360se',
				'type_name' => '360SE',
				'version_name' => 0,
				'subversion_name' => 0,
				'description' => '360SE',
			  ),
			),
		  ),
		  13856 => 
		  array (
			0 => 
			array (
			  0 => 
			  array (
				'type' => 13856,
				'version' => 0,
				'subversion' => 0,
				'icon' => 'iron',
				'type_name' => 'Iron',
				'version_name' => 0,
				'subversion_name' => 0,
				'description' => 'Iron',
			  ),
			),
		  ),
		  13956 => 
		  array (
			0 => 
			array (
			  0 => 
			  array (
				'type' => 13956,
				'version' => 0,
				'subversion' => 0,
				'icon' => 'kapiko',
				'type_name' => 'Kapiko',
				'version_name' => 0,
				'subversion_name' => 0,
				'description' => 'Kapiko',
			  ),
			),
		  ),
		  14056 => 
		  array (
			0 => 
			array (
			  0 => 
			  array (
				'type' => 14056,
				'version' => 0,
				'subversion' => 0,
				'icon' => 'kazehakase',
				'type_name' => 'Kazehakase',
				'version_name' => 0,
				'subversion_name' => 0,
				'description' => 'Kazehakase',
			  ),
			),
		  ),
		  14156 => 
		  array (
			0 => 
			array (
			  0 => 
			  array (
				'type' => 14156,
				'version' => 0,
				'subversion' => 0,
				'icon' => 'k-meleon',
				'type_name' => 'K-Meleon',
				'version_name' => 0,
				'subversion_name' => 0,
				'description' => 'K-Meleon',
			  ),
			),
		  ),
		  10034 => 
		  array (
			0 => 
			array (
			  0 => 
			  array (
				'type' => 10034,
				'version' => 0,
				'subversion' => 0,
				'icon' => 'konqueror',
				'type_name' => 'Konqueror',
				'version_name' => 0,
				'subversion_name' => 0,
				'description' => 'Konqueror',
			  ),
			),
			10035 => 
			array (
			  0 => 
			  array (
				'type' => 10034,
				'version' => 10035,
				'subversion' => 0,
				'icon' => 'konqueror',
				'type_name' => 'Konqueror',
				'version_name' => 4,
				'subversion_name' => 0,
				'description' => 'Konqueror4',
			  ),
			),
		  ),
		  14256 => 
		  array (
			0 => 
			array (
			  0 => 
			  array (
				'type' => 14256,
				'version' => 0,
				'subversion' => 0,
				'icon' => 'links',
				'type_name' => 'Links',
				'version_name' => 0,
				'subversion_name' => 0,
				'description' => 'Links',
			  ),
			),
		  ),
		  14356 => 
		  array (
			0 => 
			array (
			  0 => 
			  array (
				'type' => 14356,
				'version' => 0,
				'subversion' => 0,
				'icon' => 'lynx',
				'type_name' => 'Lynx',
				'version_name' => 0,
				'subversion_name' => 0,
				'description' => 'Lynx',
			  ),
			),
		  ),
		  14456 => 
		  array (
			0 => 
			array (
			  0 => 
			  array (
				'type' => 14456,
				'version' => 0,
				'subversion' => 0,
				'icon' => 'midori',
				'type_name' => 'Midori',
				'version_name' => 0,
				'subversion_name' => 0,
				'description' => 'Midori',
			  ),
			),
		  ),
		  14556 => 
		  array (
			0 => 
			array (
			  0 => 
			  array (
				'type' => 14556,
				'version' => 0,
				'subversion' => 0,
				'icon' => 'myie',
				'type_name' => 'Myie',
				'version_name' => 0,
				'subversion_name' => 0,
				'description' => 'Myie',
			  ),
			),
		  ),
		  14656 => 
		  array (
			0 => 
			array (
			  0 => 
			  array (
				'type' => 14656,
				'version' => 0,
				'subversion' => 0,
				'icon' => 'myie',
				'type_name' => 'Myie2',
				'version_name' => 0,
				'subversion_name' => 0,
				'description' => 'Myie2',
			  ),
			),
		  ),
		  10036 => 
		  array (
			0 => 
			array (
			  0 => 
			  array (
				'type' => 10036,
				'version' => 0,
				'subversion' => 0,
				'icon' => 'maxthon',
				'type_name' => 'Maxthon',
				'version_name' => 0,
				'subversion_name' => 0,
				'description' => 'Maxthon',
			  ),
			),
			10037 => 
			array (
			  0 => 
			  array (
				'type' => 10036,
				'version' => 10037,
				'subversion' => 0,
				'icon' => 'maxthon',
				'type_name' => 'Maxthon',
				'version_name' => 2,
				'subversion_name' => 0,
				'description' => 'Maxthon2',
			  ),
			),
			10038 => 
			array (
			  0 => 
			  array (
				'type' => 10036,
				'version' => 10038,
				'subversion' => 0,
				'icon' => 'maxthon',
				'type_name' => 'Maxthon',
				'version_name' => 3,
				'subversion_name' => 0,
				'description' => 'Maxthon3',
			  ),
			),
		  ),
		  14756 => 
		  array (
			0 => 
			array (
			  0 => 
			  array (
				'type' => 14756,
				'version' => 0,
				'subversion' => 0,
				'icon' => 'qqbrowser',
				'type_name' => 'QQBrowser',
				'version_name' => 0,
				'subversion_name' => 0,
				'description' => 'QQBrowser',
			  ),
			),
		  ),
		  14856 => 
		  array (
			0 => 
			array (
			  0 => 
			  array (
				'type' => 14856,
				'version' => 0,
				'subversion' => 0,
				'icon' => 'sogou',
				'type_name' => 'SoGou',
				'version_name' => 0,
				'subversion_name' => 0,
				'description' => 'SoGou',
			  ),
			),
		  ),
		  10039 => 
		  array (
			0 => 
			array (
			  0 => 
			  array (
				'type' => 10039,
				'version' => 0,
				'subversion' => 0,
				'icon' => 'mozilla',
				'type_name' => 'Mozilla',
				'version_name' => 0,
				'subversion_name' => 0,
				'description' => 'Mozilla',
			  ),
			),
			10040 => 
			array (
			  0 => 
			  array (
				'type' => 10039,
				'version' => 10040,
				'subversion' => 0,
				'icon' => 'mozilla',
				'type_name' => 'Mozilla',
				'version_name' => 1,
				'subversion_name' => 0,
				'description' => 'Mozilla1',
			  ),
			),
		  ),
		  14956 => 
		  array (
			0 => 
			array (
			  0 => 
			  array (
				'type' => 14956,
				'version' => 0,
				'subversion' => 0,
				'icon' => 'gnuzilla',
				'type_name' => 'Gnuzilla',
				'version_name' => 0,
				'subversion_name' => 0,
				'description' => 'Gnuzilla',
			  ),
			),
		  ),
		  15056 => 
		  array (
			0 => 
			array (
			  0 => 
			  array (
				'type' => 15056,
				'version' => 0,
				'subversion' => 0,
				'icon' => 'iceape',
				'type_name' => 'Iceape',
				'version_name' => 0,
				'subversion_name' => 0,
				'description' => 'Iceape',
			  ),
			),
		  ),
		  15156 => 
		  array (
			0 => 
			array (
			  0 => 
			  array (
				'type' => 15156,
				'version' => 0,
				'subversion' => 0,
				'icon' => 'seamonkey',
				'type_name' => 'SeaMonkey',
				'version_name' => 0,
				'subversion_name' => 0,
				'description' => 'SeaMonkey',
			  ),
			),
		  ),
		  15256 => 
		  array (
			0 => 
			array (
			  0 => 
			  array (
				'type' => 15256,
				'version' => 0,
				'subversion' => 0,
				'icon' => 'mosaic',
				'type_name' => 'Mosaic',
				'version_name' => 0,
				'subversion_name' => 0,
				'description' => 'Mosaic',
			  ),
			),
		  ),
		  15356 => 
		  array (
			0 => 
			array (
			  0 => 
			  array (
				'type' => 15356,
				'version' => 0,
				'subversion' => 0,
				'icon' => 'navigator',
				'type_name' => 'Navigator',
				'version_name' => 0,
				'subversion_name' => 0,
				'description' => 'Navigator',
			  ),
			),
		  ),
		  15456 => 
		  array (
			0 => 
			array (
			  0 => 
			  array (
				'type' => 15456,
				'version' => 0,
				'subversion' => 0,
				'icon' => 'netscape6',
				'type_name' => 'Netscape6',
				'version_name' => 0,
				'subversion_name' => 0,
				'description' => 'Netscape6',
			  ),
			),
		  ),
		  15556 => 
		  array (
			0 => 
			array (
			  0 => 
			  array (
				'type' => 15556,
				'version' => 0,
				'subversion' => 0,
				'icon' => 'netscape',
				'type_name' => 'Netscape',
				'version_name' => 0,
				'subversion_name' => 0,
				'description' => 'Netscape',
			  ),
			),
		  ),
		  15656 => 
		  array (
			0 => 
			array (
			  0 => 
			  array (
				'type' => 15656,
				'version' => 0,
				'subversion' => 0,
				'icon' => 'omniweb',
				'type_name' => 'OmniWeb',
				'version_name' => 0,
				'subversion_name' => 0,
				'description' => 'OmniWeb',
			  ),
			),
		  ),
		  10042 => 
		  array (
			0 => 
			array (
			  0 => 
			  array (
				'type' => 10042,
				'version' => 0,
				'subversion' => 0,
				'icon' => 'opera',
				'type_name' => 'Opera',
				'version_name' => 0,
				'subversion_name' => 0,
				'description' => 'Opera',
			  ),
			),
			10043 => 
			array (
			  0 => 
			  array (
				'type' => 10042,
				'version' => 10043,
				'subversion' => 0,
				'icon' => 'opera',
				'type_name' => 'Opera',
				'version_name' => 10,
				'subversion_name' => 0,
				'description' => 'Opera10',
			  ),
			),
			10044 => 
			array (
			  0 => 
			  array (
				'type' => 10042,
				'version' => 10044,
				'subversion' => 0,
				'icon' => 'opera',
				'type_name' => 'Opera',
				'version_name' => 11,
				'subversion_name' => 0,
				'description' => 'Opera11',
			  ),
			),
			10045 => 
			array (
			  0 => 
			  array (
				'type' => 10042,
				'version' => 10045,
				'subversion' => 0,
				'icon' => 'opera',
				'type_name' => 'Opera',
				'version_name' => 12,
				'subversion_name' => 0,
				'description' => 'Opera12',
			  ),
			),
		  ),
		  15756 => 
		  array (
			0 => 
			array (
			  0 => 
			  array (
				'type' => 15756,
				'version' => 0,
				'subversion' => 0,
				'icon' => 'ucweb',
				'type_name' => 'UCWEB',
				'version_name' => 0,
				'subversion_name' => 0,
				'description' => 'UCWEB',
			  ),
			),
		  ),
		  10050 => 
		  array (
			0 => 
			array (
			  0 => 
			  array (
				'type' => 10050,
				'version' => 0,
				'subversion' => 0,
				'icon' => 'safari',
				'type_name' => 'Safari',
				'version_name' => 0,
				'subversion_name' => 0,
				'description' => 'Safari',
			  ),
			),
			10051 => 
			array (
			  0 => 
			  array (
				'type' => 10050,
				'version' => 10051,
				'subversion' => 0,
				'icon' => 'safari',
				'type_name' => 'Safari',
				'version_name' => 3,
				'subversion_name' => 0,
				'description' => 'Safari3',
			  ),
			),
			10052 => 
			array (
			  0 => 
			  array (
				'type' => 10050,
				'version' => 10052,
				'subversion' => 0,
				'icon' => 'safari',
				'type_name' => 'Safari',
				'version_name' => 4,
				'subversion_name' => 0,
				'description' => 'Safari4',
			  ),
			),
			10053 => 
			array (
			  0 => 
			  array (
				'type' => 10050,
				'version' => 10053,
				'subversion' => 0,
				'icon' => 'safari',
				'type_name' => 'Safari',
				'version_name' => 5,
				'subversion_name' => 0,
				'description' => 'Safari5',
			  ),
			),
		  ),
		  15856 => 
		  array (
			0 => 
			array (
			  0 => 
			  array (
				'type' => 15856,
				'version' => 0,
				'subversion' => 0,
				'icon' => 'titanium',
				'type_name' => 'Titanium',
				'version_name' => 0,
				'subversion_name' => 0,
				'description' => 'Titanium',
			  ),
			),
		  ),
		  15956 => 
		  array (
			0 => 
			array (
			  0 => 
			  array (
				'type' => 15956,
				'version' => 0,
				'subversion' => 0,
				'icon' => 'webos',
				'type_name' => 'webOS',
				'version_name' => 0,
				'subversion_name' => 0,
				'description' => 'webOS',
			  ),
			),
		  ),
		  16056 => 
		  array (
			0 => 
			array (
			  0 => 
			  array (
				'type' => 16056,
				'version' => 0,
				'subversion' => 0,
				'icon' => 'webpro',
				'type_name' => 'WebPro',
				'version_name' => 0,
				'subversion_name' => 0,
				'description' => 'WebPro',
			  ),
			),
		  ),
		  10000 => 
		  array (
			0 => 
			array (
			  0 => 
			  array (
				'type' => 10000,
				'version' => 0,
				'subversion' => 0,
				'icon' => 'android',
				'type_name' => 'Android',
				'version_name' => 0,
				'subversion_name' => 0,
				'description' => 'Android',
			  ),
			),
			10001 => 
			array (
			  0 => 
			  array (
				'type' => 10000,
				'version' => 10001,
				'subversion' => 0,
				'icon' => 'android',
				'type_name' => 'Android',
				'version_name' => 1,
				'subversion_name' => 0,
				'description' => 'Android1',
			  ),
			),
			10002 => 
			array (
			  0 => 
			  array (
				'type' => 10000,
				'version' => 10002,
				'subversion' => 0,
				'icon' => 'android',
				'type_name' => 'Android',
				'version_name' => 2,
				'subversion_name' => 0,
				'description' => 'Android2',
			  ),
			),
		  ),
		  10025 => 
		  array (
			0 => 
			array (
			  0 => 
			  array (
				'type' => 10025,
				'version' => 0,
				'subversion' => 0,
				'icon' => 'ipad',
				'type_name' => 'iPad',
				'version_name' => 0,
				'subversion_name' => 0,
				'description' => 'iPad',
			  ),
			),
			10026 => 
			array (
			  0 => 
			  array (
				'type' => 10025,
				'version' => 10026,
				'subversion' => 0,
				'icon' => 'ipad',
				'type_name' => 'iPad',
				'version_name' => 4,
				'subversion_name' => 0,
				'description' => 'iPad4',
			  ),
			),
		  ),
		  10027 => 
		  array (
			0 => 
			array (
			  0 => 
			  array (
				'type' => 10027,
				'version' => 0,
				'subversion' => 0,
				'icon' => 'iphone',
				'type_name' => 'iPhone',
				'version_name' => 0,
				'subversion_name' => 0,
				'description' => 'iPhone',
			  ),
			),
			10028 => 
			array (
			  0 => 
			  array (
				'type' => 10027,
				'version' => 10028,
				'subversion' => 0,
				'icon' => 'iphone',
				'type_name' => 'iPhone',
				'version_name' => 3,
				'subversion_name' => 0,
				'description' => 'iPhone3',
			  ),
			),
			10029 => 
			array (
			  0 => 
			  array (
				'type' => 10027,
				'version' => 10029,
				'subversion' => 0,
				'icon' => 'iphone',
				'type_name' => 'iPhone',
				'version_name' => 4,
				'subversion_name' => 0,
				'description' => 'iPhone4',
			  ),
			),
		  ),
		  10030 => 
		  array (
			0 => 
			array (
			  0 => 
			  array (
				'type' => 10030,
				'version' => 0,
				'subversion' => 0,
				'icon' => 'ipod',
				'type_name' => 'iPod Touch',
				'version_name' => 0,
				'subversion_name' => 0,
				'description' => 'iPod Touch',
			  ),
			),
			10031 => 
			array (
			  0 => 
			  array (
				'type' => 10030,
				'version' => 10031,
				'subversion' => 0,
				'icon' => 'ipod',
				'type_name' => 'iPod Touch',
				'version_name' => 4,
				'subversion_name' => 0,
				'description' => 'iPod Touch4',
			  ),
			),
		  ),
		  10032 => 
		  array (
			0 => 
			array (
			  0 => 
			  array (
				'type' => 10032,
				'version' => 0,
				'subversion' => 0,
				'icon' => 'kindle',
				'type_name' => 'Kindle',
				'version_name' => 0,
				'subversion_name' => 0,
				'description' => 'Kindle',
			  ),
			),
			10033 => 
			array (
			  0 => 
			  array (
				'type' => 10032,
				'version' => 10033,
				'subversion' => 0,
				'icon' => 'kindle',
				'type_name' => 'Kindle',
				'version_name' => 3,
				'subversion_name' => 0,
				'description' => 'Kindle3',
			  ),
			),
		  ),
		  10041 => 
		  array (
			0 => 
			array (
			  0 => 
			  array (
				'type' => 10041,
				'version' => 0,
				'subversion' => 0,
				'icon' => 'nokia',
				'type_name' => 'Nokia',
				'version_name' => 0,
				'subversion_name' => 0,
				'description' => 'Nokia',
			  ),
			),
		  ),
		  10046 => 
		  array (
			0 => 
			array (
			  0 => 
			  array (
				'type' => 10046,
				'version' => 0,
				'subversion' => 0,
				'icon' => 'opera',
				'type_name' => 'Opera Mini',
				'version_name' => 0,
				'subversion_name' => 0,
				'description' => 'Opera Mini',
			  ),
			),
			10047 => 
			array (
			  0 => 
			  array (
				'type' => 10046,
				'version' => 10047,
				'subversion' => 0,
				'icon' => 'opera',
				'type_name' => 'Opera Mini',
				'version_name' => 4,
				'subversion_name' => 0,
				'description' => 'Opera Mini4',
			  ),
			),
			10048 => 
			array (
			  0 => 
			  array (
				'type' => 10046,
				'version' => 10048,
				'subversion' => 0,
				'icon' => 'opera',
				'type_name' => 'Opera Mini',
				'version_name' => 5,
				'subversion_name' => 0,
				'description' => 'Opera Mini5',
			  ),
			),
			10049 => 
			array (
			  0 => 
			  array (
				'type' => 10046,
				'version' => 10049,
				'subversion' => 0,
				'icon' => 'opera',
				'type_name' => 'Opera Mini',
				'version_name' => 6,
				'subversion_name' => 0,
				'description' => 'Opera Mini6',
			  ),
			),
		  ),
		  10054 => 
		  array (
			0 => 
			array (
			  0 => 
			  array (
				'type' => 10054,
				'version' => 0,
				'subversion' => 0,
				'icon' => 'yahoo',
				'type_name' => 'Yahoo! Slurp',
				'version_name' => 0,
				'subversion_name' => 0,
				'description' => 'Yahoo! Slurp',
			  ),
			),
		  ),
		);
$OS_ID_TO_NAME = array (
		  10000 => 
		  array (
			0 => 
			array (
			  0 => 
			  array (
				'type' => 10000,
				'version' => 0,
				'subversion' => 0,
				'icon' => 'Linux',
				'type_name' => 'Linux',
				'version_name' => 'Linux',
				'subversion_name' => '',
				'description' => 'Linux',
			  ),
			),
			10049 => 
			array (
			  0 => 
			  array (
				'type' => 10000,
				'version' => 10049,
				'subversion' => 0,
				'icon' => 'linux',
				'type_name' => 'Linux',
				'version_name' => 'Ubuntu',
				'subversion_name' => '',
				'description' => 'Ubuntu',
			  ),
			),
			10050 => 
			array (
			  0 => 
			  array (
				'type' => 10000,
				'version' => 10050,
				'subversion' => 0,
				'icon' => 'linux',
				'type_name' => 'Linux',
				'version_name' => 'CentOS',
				'subversion_name' => '',
				'description' => 'CentOS',
			  ),
			),
			10051 => 
			array (
			  0 => 
			  array (
				'type' => 10000,
				'version' => 10051,
				'subversion' => 0,
				'icon' => 'linux',
				'type_name' => 'Linux',
				'version_name' => 'Debian',
				'subversion_name' => '',
				'description' => 'Debian',
			  ),
			),
			10052 => 
			array (
			  0 => 
			  array (
				'type' => 10000,
				'version' => 10052,
				'subversion' => 0,
				'icon' => 'linux',
				'type_name' => 'Linux',
				'version_name' => 'RedHeat',
				'subversion_name' => '',
				'description' => 'RedHeat',
			  ),
			),
		  ),
		  10003 => 
		  array (
			0 => 
			array (
			  0 => 
			  array (
				'type' => 10003,
				'version' => 0,
				'subversion' => 0,
				'icon' => 'Mac',
				'type_name' => 'MacOS',
				'version_name' => 'MacOS',
				'subversion_name' => '',
				'description' => 'MacOS',
			  ),
			),
			10008 => 
			array (
			  0 => 
			  array (
				'type' => 10003,
				'version' => 10008,
				'subversion' => 0,
				'icon' => 'macosx',
				'type_name' => 'MacOS',
				'version_name' => 'MacOSX',
				'subversion_name' => '',
				'description' => 'MacOSX',
			  ),
			),
		  ),
		  10005 => 
		  array (
			0 => 
			array (
			  0 => 
			  array (
				'type' => 10005,
				'version' => 0,
				'subversion' => 0,
				'icon' => 'Other',
				'type_name' => 'Other',
				'version_name' => 'Other',
				'subversion_name' => '',
				'description' => 'Other',
			  ),
			),
		  ),
		  10006 => 
		  array (
			0 => 
			array (
			  0 => 
			  array (
				'type' => 10006,
				'version' => 0,
				'subversion' => 0,
				'icon' => 'Android',
				'type_name' => 'Android',
				'version_name' => 'Android',
				'subversion_name' => '',
				'description' => 'Android',
			  ),
			),
		  ),
		  10007 => 
		  array (
			0 => 
			array (
			  0 => 
			  array (
				'type' => 10007,
				'version' => 0,
				'subversion' => 0,
				'icon' => 'blackberry',
				'type_name' => 'BlackBerry',
				'version_name' => 'BlackBerry',
				'subversion_name' => '',
				'description' => 'BlackBerry',
			  ),
			),
		  ),
		  10009 => 
		  array (
			0 => 
			array (
			  0 => 
			  array (
				'type' => 10009,
				'version' => 0,
				'subversion' => 0,
				'icon' => 'JAVA',
				'type_name' => 'JAVA',
				'version_name' => 'JAVA',
				'subversion_name' => '',
				'description' => 'JAVA',
			  ),
			),
		  ),
		  10010 => 
		  array (
			0 => 
			array (
			  0 => 
			  array (
				'type' => 10010,
				'version' => 0,
				'subversion' => 0,
				'icon' => 'Symbian',
				'type_name' => 'SymbianOS',
				'version_name' => 'SymbianOS',
				'subversion_name' => '',
				'description' => 'SymbianOS',
			  ),
			),
		  ),
		  10011 => 
		  array (
			0 => 
			array (
			  0 => 
			  array (
				'type' => 10011,
				'version' => 0,
				'subversion' => 0,
				'icon' => 'unknown',
				'type_name' => 'Unknown',
				'version_name' => 'Unknown',
				'subversion_name' => '',
				'description' => 'Unknown',
			  ),
			),
		  ),
		  10012 => 
		  array (
			0 => 
			array (
			  0 => 
			  array (
				'type' => 10012,
				'version' => 0,
				'subversion' => 0,
				'icon' => 'Windows',
				'type_name' => 'Windows',
				'version_name' => 'Windows',
				'subversion_name' => '',
				'description' => 'Windows',
			  ),
			),
			10015 => 
			array (
			  0 => 
			  array (
				'type' => 10012,
				'version' => 10015,
				'subversion' => 0,
				'icon' => 'win7',
				'type_name' => 'Windows',
				'version_name' => 'Win7',
				'subversion_name' => '',
				'description' => 'Win7',
			  ),
			),
			10053 => 
			array (
			  0 => 
			  array (
				'type' => 10012,
				'version' => 10053,
				'subversion' => 0,
				'icon' => 'windows',
				'type_name' => 'Windows',
				'version_name' => 'Win8',
				'subversion_name' => '',
				'description' => 'Win8',
			  ),
			),
			10018 => 
			array (
			  0 => 
			  array (
				'type' => 10012,
				'version' => 10018,
				'subversion' => 0,
				'icon' => 'winvista',
				'type_name' => 'Windows',
				'version_name' => 'WinVista',
				'subversion_name' => '',
				'description' => 'WinVista',
			  ),
			),
			10014 => 
			array (
			  0 => 
			  array (
				'type' => 10012,
				'version' => 10014,
				'subversion' => 0,
				'icon' => 'win2003',
				'type_name' => 'Windows',
				'version_name' => 'Win2003',
				'subversion_name' => '',
				'description' => 'Win2003',
			  ),
			),
			10019 => 
			array (
			  0 => 
			  array (
				'type' => 10012,
				'version' => 10019,
				'subversion' => 0,
				'icon' => 'winxp',
				'type_name' => 'Windows',
				'version_name' => 'WinXP',
				'subversion_name' => '',
				'description' => 'WinXP',
			  ),
			),
			10013 => 
			array (
			  0 => 
			  array (
				'type' => 10012,
				'version' => 10013,
				'subversion' => 0,
				'icon' => 'win2000',
				'type_name' => 'Windows',
				'version_name' => 'Win2000',
				'subversion_name' => '',
				'description' => 'Win2000',
			  ),
			),
			10054 => 
			array (
			  0 => 
			  array (
				'type' => 10012,
				'version' => 10054,
				'subversion' => 0,
				'icon' => 'windows',
				'type_name' => 'Windows',
				'version_name' => 'WinNT',
				'subversion_name' => '',
				'description' => 'WinNT',
			  ),
			),
			10017 => 
			array (
			  0 => 
			  array (
				'type' => 10012,
				'version' => 10017,
				'subversion' => 0,
				'icon' => 'winme',
				'type_name' => 'Windows',
				'version_name' => 'WinME',
				'subversion_name' => '',
				'description' => 'WinME',
			  ),
			),
			10016 => 
			array (
			  0 => 
			  array (
				'type' => 10012,
				'version' => 10016,
				'subversion' => 0,
				'icon' => 'win98',
				'type_name' => 'Windows',
				'version_name' => 'Win98',
				'subversion_name' => '',
				'description' => 'Win98',
			  ),
			),
			10055 => 
			array (
			  0 => 
			  array (
				'type' => 10012,
				'version' => 10055,
				'subversion' => 0,
				'icon' => 'windows',
				'type_name' => 'Windows',
				'version_name' => 'Win95',
				'subversion_name' => '',
				'description' => 'Win95',
			  ),
			),
			10059 => 
			array (
			  0 => 
			  array (
				'type' => 10012,
				'version' => 10059,
				'subversion' => 0,
				'icon' => 'windows',
				'type_name' => 'Windows',
				'version_name' => 'WinCE',
				'subversion_name' => '',
				'description' => 'WinCE',
			  ),
			),
		  ),
		  10020 => 
		  array (
			0 => 
			array (
			  0 => 
			  array (
				'type' => 10020,
				'version' => 0,
				'subversion' => 0,
				'icon' => 'miui',
				'type_name' => 'MIUI',
				'version_name' => 'MIUI',
				'subversion_name' => '',
				'description' => 'MIUI',
			  ),
			),
		  ),
		  10021 => 
		  array (
			0 => 
			array (
			  0 => 
			  array (
				'type' => 10021,
				'version' => 0,
				'subversion' => 0,
				'icon' => 'maemo',
				'type_name' => 'Maemo',
				'version_name' => 'Maemo',
				'subversion_name' => '',
				'description' => 'Maemo',
			  ),
			),
		  ),
		  10022 => 
		  array (
			0 => 
			array (
			  0 => 
			  array (
				'type' => 10022,
				'version' => 0,
				'subversion' => 0,
				'icon' => 'wp7',
				'type_name' => 'WP7',
				'version_name' => 'WP7',
				'subversion_name' => '',
				'description' => 'WP7',
			  ),
			),
		  ),
		  10023 => 
		  array (
			0 => 
			array (
			  0 => 
			  array (
				'type' => 10023,
				'version' => 0,
				'subversion' => 0,
				'icon' => 'windows phone',
				'type_name' => 'Windows Phone',
				'version_name' => 'Windows Phone',
				'subversion_name' => '',
				'description' => 'Windows Phone',
			  ),
			),
			10056 => 
			array (
			  0 => 
			  array (
				'type' => 10023,
				'version' => 10056,
				'subversion' => 0,
				'icon' => 'windows phone',
				'type_name' => 'Windows Phone',
				'version_name' => 'WinPhone7',
				'subversion_name' => '',
				'description' => 'WinPhone7',
			  ),
			),
		  ),
		  10024 => 
		  array (
			0 => 
			array (
			  0 => 
			  array (
				'type' => 10024,
				'version' => 0,
				'subversion' => 0,
				'icon' => 'windows mobile',
				'type_name' => 'Windows Mobile',
				'version_name' => 'Windows Mobile',
				'subversion_name' => '',
				'description' => 'Windows Mobile',
			  ),
			),
			10057 => 
			array (
			  0 => 
			  array (
				'type' => 10024,
				'version' => 10057,
				'subversion' => 0,
				'icon' => 'windows mobile',
				'type_name' => 'Windows Mobile',
				'version_name' => 'WinMobile6.5',
				'subversion_name' => '',
				'description' => 'WinMobile6.5',
			  ),
			),
			10058 => 
			array (
			  0 => 
			  array (
				'type' => 10024,
				'version' => 10058,
				'subversion' => 0,
				'icon' => 'windows mobile',
				'type_name' => 'Windows Mobile',
				'version_name' => 'WinMobile6.1',
				'subversion_name' => '',
				'description' => 'WinMobile6.1',
			  ),
			),
		  ),
		  10025 => 
		  array (
			0 => 
			array (
			  0 => 
			  array (
				'type' => 10025,
				'version' => 0,
				'subversion' => 0,
				'icon' => 'ipod',
				'type_name' => 'iPod',
				'version_name' => 'iPod',
				'subversion_name' => '',
				'description' => 'iPod',
			  ),
			),
		  ),
		  10026 => 
		  array (
			0 => 
			array (
			  0 => 
			  array (
				'type' => 10026,
				'version' => 0,
				'subversion' => 0,
				'icon' => 'ipad',
				'type_name' => 'iPad',
				'version_name' => 'iPad',
				'subversion_name' => '',
				'description' => 'iPad',
			  ),
			),
		  ),
		  10027 => 
		  array (
			0 => 
			array (
			  0 => 
			  array (
				'type' => 10027,
				'version' => 0,
				'subversion' => 0,
				'icon' => 'iphone',
				'type_name' => 'iPhone',
				'version_name' => 'iPhone',
				'subversion_name' => '',
				'description' => 'iPhone',
			  ),
			),
		  ),
		  10028 => 
		  array (
			0 => 
			array (
			  0 => 
			  array (
				'type' => 10028,
				'version' => 0,
				'subversion' => 0,
				'icon' => 'webos',
				'type_name' => 'webOS',
				'version_name' => 'webOS',
				'subversion_name' => '',
				'description' => 'webOS',
			  ),
			),
		  ),
		  10029 => 
		  array (
			0 => 
			array (
			  0 => 
			  array (
				'type' => 10029,
				'version' => 0,
				'subversion' => 0,
				'icon' => 'palmos',
				'type_name' => 'PalmOS',
				'version_name' => 'PalmOS',
				'subversion_name' => '',
				'description' => 'PalmOS',
			  ),
			),
		  ),
		  10030 => 
		  array (
			0 => 
			array (
			  0 => 
			  array (
				'type' => 10030,
				'version' => 0,
				'subversion' => 0,
				'icon' => 'qnx',
				'type_name' => 'QNX',
				'version_name' => 'QNX',
				'subversion_name' => '',
				'description' => 'QNX',
			  ),
			),
		  ),
		  10031 => 
		  array (
			0 => 
			array (
			  0 => 
			  array (
				'type' => 10031,
				'version' => 0,
				'subversion' => 0,
				'icon' => 'bada',
				'type_name' => 'bada',
				'version_name' => 'bada',
				'subversion_name' => '',
				'description' => 'bada',
			  ),
			),
		  ),
		  10032 => 
		  array (
			0 => 
			array (
			  0 => 
			  array (
				'type' => 10032,
				'version' => 0,
				'subversion' => 0,
				'icon' => 'sunos',
				'type_name' => 'SunOS',
				'version_name' => 'SunOS',
				'subversion_name' => '',
				'description' => 'SunOS',
			  ),
			),
		  ),
		  10033 => 
		  array (
			0 => 
			array (
			  0 => 
			  array (
				'type' => 10033,
				'version' => 0,
				'subversion' => 0,
				'icon' => 'aix',
				'type_name' => 'AIX',
				'version_name' => 'AIX',
				'subversion_name' => '',
				'description' => 'AIX',
			  ),
			),
		  ),
		  10034 => 
		  array (
			0 => 
			array (
			  0 => 
			  array (
				'type' => 10034,
				'version' => 0,
				'subversion' => 0,
				'icon' => 'hpunix',
				'type_name' => 'HPUnix',
				'version_name' => 'HPUnix',
				'subversion_name' => '',
				'description' => 'HPUnix',
			  ),
			),
		  ),
		  10035 => 
		  array (
			0 => 
			array (
			  0 => 
			  array (
				'type' => 10035,
				'version' => 0,
				'subversion' => 0,
				'icon' => 'openvms',
				'type_name' => 'OpenVMS',
				'version_name' => 'OpenVMS',
				'subversion_name' => '',
				'description' => 'OpenVMS',
			  ),
			),
		  ),
		  10036 => 
		  array (
			0 => 
			array (
			  0 => 
			  array (
				'type' => 10036,
				'version' => 0,
				'subversion' => 0,
				'icon' => 'freebsd',
				'type_name' => 'FreeBSD',
				'version_name' => 'FreeBSD',
				'subversion_name' => '',
				'description' => 'FreeBSD',
			  ),
			),
		  ),
		  10037 => 
		  array (
			0 => 
			array (
			  0 => 
			  array (
				'type' => 10037,
				'version' => 0,
				'subversion' => 0,
				'icon' => 'netbsd',
				'type_name' => 'NetBSD',
				'version_name' => 'NetBSD',
				'subversion_name' => '',
				'description' => 'NetBSD',
			  ),
			),
		  ),
		  10038 => 
		  array (
			0 => 
			array (
			  0 => 
			  array (
				'type' => 10038,
				'version' => 0,
				'subversion' => 0,
				'icon' => 'openbsd',
				'type_name' => 'OpenBSD',
				'version_name' => 'OpenBSD',
				'subversion_name' => '',
				'description' => 'OpenBSD',
			  ),
			),
		  ),
		  10039 => 
		  array (
			0 => 
			array (
			  0 => 
			  array (
				'type' => 10039,
				'version' => 0,
				'subversion' => 0,
				'icon' => 'dragonfly',
				'type_name' => 'DragonFly',
				'version_name' => 'DragonFly',
				'subversion_name' => '',
				'description' => 'DragonFly',
			  ),
			),
		  ),
		  10040 => 
		  array (
			0 => 
			array (
			  0 => 
			  array (
				'type' => 10040,
				'version' => 0,
				'subversion' => 0,
				'icon' => 'syllable',
				'type_name' => 'Syllable',
				'version_name' => 'Syllable',
				'subversion_name' => '',
				'description' => 'Syllable',
			  ),
			),
		  ),
		  10041 => 
		  array (
			0 => 
			array (
			  0 => 
			  array (
				'type' => 10041,
				'version' => 0,
				'subversion' => 0,
				'icon' => 'wii',
				'type_name' => 'Wii',
				'version_name' => 'Wii',
				'subversion_name' => '',
				'description' => 'Wii',
			  ),
			),
		  ),
		  10042 => 
		  array (
			0 => 
			array (
			  0 => 
			  array (
				'type' => 10042,
				'version' => 0,
				'subversion' => 0,
				'icon' => 'nintendo',
				'type_name' => 'Nintendo',
				'version_name' => 'Nintendo',
				'subversion_name' => '',
				'description' => 'Nintendo',
			  ),
			),
			10060 => 
			array (
			  0 => 
			  array (
				'type' => 10042,
				'version' => 10060,
				'subversion' => 0,
				'icon' => 'nintendo',
				'type_name' => 'Nintendo',
				'version_name' => 'NDS',
				'subversion_name' => '',
				'description' => 'NDS',
			  ),
			),
			10061 => 
			array (
			  0 => 
			  array (
				'type' => 10042,
				'version' => 10061,
				'subversion' => 0,
				'icon' => 'nintendo',
				'type_name' => 'Nintendo',
				'version_name' => 'NDSI',
				'subversion_name' => '',
				'description' => 'NDSI',
			  ),
			),
		  ),
		  10043 => 
		  array (
			0 => 
			array (
			  0 => 
			  array (
				'type' => 10043,
				'version' => 0,
				'subversion' => 0,
				'icon' => 'playstation',
				'type_name' => 'PlayStation',
				'version_name' => 'PlayStation',
				'subversion_name' => '',
				'description' => 'PlayStation',
			  ),
			),
			10062 => 
			array (
			  0 => 
			  array (
				'type' => 10043,
				'version' => 10062,
				'subversion' => 0,
				'icon' => 'playstation',
				'type_name' => 'PlayStation',
				'version_name' => 'PSP',
				'subversion_name' => '',
				'description' => 'PSP',
			  ),
			),
			10063 => 
			array (
			  0 => 
			  array (
				'type' => 10043,
				'version' => 10063,
				'subversion' => 0,
				'icon' => 'playstation',
				'type_name' => 'PlayStation',
				'version_name' => 'PS3',
				'subversion_name' => '',
				'description' => 'PS3',
			  ),
			),
		  ),
		  10044 => 
		  array (
			0 => 
			array (
			  0 => 
			  array (
				'type' => 10044,
				'version' => 0,
				'subversion' => 0,
				'icon' => 'irix',
				'type_name' => 'IRIX',
				'version_name' => 'IRIX',
				'subversion_name' => '',
				'description' => 'IRIX',
			  ),
			),
		  ),
		  10045 => 
		  array (
			0 => 
			array (
			  0 => 
			  array (
				'type' => 10045,
				'version' => 0,
				'subversion' => 0,
				'icon' => 'tru64',
				'type_name' => 'Tru64',
				'version_name' => 'Tru64',
				'subversion_name' => '',
				'description' => 'Tru64',
			  ),
			),
		  ),
		  10046 => 
		  array (
			0 => 
			array (
			  0 => 
			  array (
				'type' => 10046,
				'version' => 0,
				'subversion' => 0,
				'icon' => 'os/2',
				'type_name' => 'OS/2',
				'version_name' => 'OS/2',
				'subversion_name' => '',
				'description' => 'OS/2',
			  ),
			),
			10064 => 
			array (
			  0 => 
			  array (
				'type' => 10046,
				'version' => 10064,
				'subversion' => 0,
				'icon' => 'os/2',
				'type_name' => 'OS/2',
				'version_name' => 'OS2',
				'subversion_name' => '',
				'description' => 'OS2',
			  ),
			),
		  ),
		  10047 => 
		  array (
			0 => 
			array (
			  0 => 
			  array (
				'type' => 10047,
				'version' => 0,
				'subversion' => 0,
				'icon' => 'beos',
				'type_name' => 'BeOS',
				'version_name' => 'BeOS',
				'subversion_name' => '',
				'description' => 'BeOS',
			  ),
			),
		  ),
		  10048 => 
		  array (
			0 => 
			array (
			  0 => 
			  array (
				'type' => 10048,
				'version' => 0,
				'subversion' => 0,
				'icon' => 'amigaos',
				'type_name' => 'AmigaOS',
				'version_name' => 'AmigaOS',
				'subversion_name' => '',
				'description' => 'AmigaOS',
			  ),
			),
		  ),
		);