<?php
class CdcClickiTools
{
    const FILE_NO_EXIST = -1; // '目录不存在并且无法创建';
    const FILE_NO_WRITABLE = -2; // '目录不可写';

    public static $version = '1.0';
    public static $officialUrl = 'http://sitemonitor.cn.miaozhen.com/';
    public static $beianUrl = 'http://www.miibeian.gov.cn/';

    /**
     * 过滤处理超级链接标签a，去掉无用的属性，并且添加class
     * @param $html string 需要处理的包含超级链接标签的html代码
     * @return string 处理后的html代码
     */
    public static function purifyLinkTag($html)
    {
        $p = '/<a(.*?)href="(.+?)"(.*?)>(.+?)<\/a>/ism';
        $r = '<a href="$2" target="_blank">$4</a>';
        $html = preg_replace($p, $r, $html);
        return $html;
    }


    /**
     * 过滤处理img标签
     * @param $html string 需要处理的html代码
     * @param $alt string 处理替换的alt属性值
     * @param $title string 为img加上的超级链接的title属性
     * @return string 处理之后的html代码
     */
    public static function purifyImgTag($html, $title = null)
    {
        $p = '/<img .*?src="?(.+?)"?( .*?|\/|)>/ism';
        $r = sprintf('<img src="$1" class="content-pic" alt="图片：%s" />', $title);
        return preg_replace($p, $r, $html);
    }


    /**
     * 使用CHtmlPurify过滤html代码
     * @param $content string 需要过滤的html代码
     * @return string 过滤之后的 html代码
     */
    public static function purify($content, $section)
    {
        static $purifier;
        if($purifier[$section] === null) {
            $purifier[$section] = new CHtmlPurifier();
            $options = require(dirname(__FILE__) . DS . '..' . DS . 'config' . DS . 'purifier.ini.php');
            $purifier[$section]->options = $options[$section];
        }
        return $purifier[$section]->purify($content);
    }


    /**
     * 获取客户端IP地址
     * @return string 客户端IP地址
     */
    public static function getClientIp()
    {
        if ($_SERVER['HTTP_CLIENT_IP']) {
	      $ip = $_SERVER['HTTP_CLIENT_IP'];
	 	} elseif ($_SERVER['HTTP_X_FORWARDED_FOR']) {
	      $ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
	 	} else {
	      $ip = $_SERVER['REMOTE_ADDR'];
	 	}

        return $ip;
    }

	/**
     * 过滤敏感关键字，如果replace字段替换字符串为空，则显示param('spamReplace')指定的默认字符串
     * 如果不为空，则替换为replace字段指定值
     * 支持不连续关键字过滤，如subject字段为 a{1}b{1}c，则可以过滤abc，axbc，abxc，axbxc等敏感词
     * @param $html string 需要过滤的字符串
     * @return string 过滤之后的字符串
     */
    public static function purifySpamWords($html)
    {
        // 读取所有敏感词语
        static $words;
        if ($words === null)
            $words = SpamWords::getAllValidWords();
        foreach ((array)$words as $w) {
            if (empty($w->replace)) $w->replace = param('spamReplace');
            $p = '/(.+?)\{(\d+?)\}/ism';
            $w->subject = preg_replace($p, '$1.{0,$2}', $w->subject);
            $html = preg_replace('/' . $w->subject . '/ism', '<i>' . $w->replace . '</i>', $html);
        }

        return $html;
    }


    /**
     * 返回当前程序版本
     * @return string $version
     */
    public static function getVersion()
    {
        return self::$version;
    }

    /**
     * 返回上传后的文件路径
     * @return string|Array 如果成功则返回路径地址，如果失败则返回错误号和错误信息
     * -1 目录不存在并且无法创建
     * -2 目录不可写
     */
    public static function makeUploadPath($additional = null)
    {
        $relativeUrl = (($additional === null) ? '' : $additional . '/')
            . date('Y/m/d/', $_SERVER['REQUEST_TIME']);
        $relativePath = (($additional === null) ? '' : $additional . DS)
            . date(addslashes(sprintf('Y%sm%sd%s', DS, DS, DS)), $_SERVER['REQUEST_TIME']);

        $path = param('staticBasePath') . $relativePath;

        if (!file_exists($path) && !mkdir($path, 0755, true)) {
            return self::FILE_NO_EXIST;
        } else if (!is_writable($path)) {
            return self::FILE_NO_WRITABLE;
        } else
            return array(
            	'absolute' => $path,
                'relative' => $relativeUrl,
            );
    }

    public static function makeUploadFileName($extension)
    {
        $extension = strtolower($extension);
        return date('YmdHis_', $_SERVER['REQUEST_TIME'])
            . uniqid()
            . ($extension ? '.' . $extension : '');
    }



    public static function makePinyin($str, $separate = '-')
    {
        if (empty($str)) return false;

        $pinyins = require('PinyinArray.php');
	    $len = mb_strlen($str);
	    for ($i=0; $i<$len; $i++) {
	        $word = mb_substr($str, $i, 1, app()->charset);
	        if (array_key_exists($word, $pinyins)) {
	            if (!empty($tmp)) {
	                $pinyin[] = $tmp;
	                unset($tmp);
	            }
	            $pinyin[] = $pinyins[$word];
	        } else {
	            if (preg_match('/^[\w\d]+$/i', $word)) $tmp .= $word;
	        }
	    }

        if (!empty($tmp)) {
            $pinyin[] = $tmp;
            unset($tmp);
        }
	    return join($pinyin, $separate);
    }

    /**
     * 返回 Powered信息
     * @return string Powered Html
     */
    public static function getPowered()
    {
        return 'Copyright &copy; ' . date('Y') . ' by ' . l('sitemonitor', SITEURL) . ' <span style="margin-left:20px;">' . l(param('miibeian'),self::$beianUrl) . '</span><br/>' . 
        		'All Rights Reserved.';
    }

    public static function makeStatePicHmtl($state)
    {
        return CHtml::image(resBu('admin/images/state' . (int)$state . '.gif'), $state ? t('正常') : t('禁用'));
    }

	public static function getReferrer()
	{
	    $referer = urldecode($_GET['referer']);
	    $referer = $_GET['referer'] ?  $referer : app()->request->urlReferrer;
	    $referer = $referer ? $referer : user()->returnUrl;
	    $referer = $referer ? $referer : app()->homeUrl;
	    return $referer;
	}


}