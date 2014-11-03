<?php
/**
 * The database abstraction factory
 *
 * PHP Version 5.3
 *
 * @author    QLeelulu <qleelulu@gmail.com>
 * @since     2012-09-02
 */

require_once(dirname(__FILE__) . '/../jsconf/jsconf.php');
require_once(dirname(__FILE__) . '/sqlBuilder.php');

/**
 * DbFactory
 * 所有数据库实例都从这里获取，统一管理。
 * 数据库实例会根据配置文件生成。
 * 示例：
 *     $db = DbFactory::getInstance('app');
 *     // 如果是读写分离的，获取读库，则为：
 *     // $db = DbFactory::getReadInstance('app');
 *     $result = $db->query('select 1');
 *     $row = $db->fetchRow($result);
 *
 * 完整的 DB_Driver 函数参考 drivers/base.php 接口文件
 */
class DbFactory
{
    /**
     * Database type
     *
     * @var string
     */
    private static $dbType = null;

    /**
     * json config
     *
     * @var array
     */
    private static $config = false;

    /**
     * Constructor
     *
     */
    private function __construct()
    {
    }

    private static function loadConfig()
    {
        if (self::$config !== false) {
            return;
        }
        self::$config = jsconf_load('');
    }
    
    /**
     * Database factory
     *
     * @param string $type Database management system type
     * @throws Exception
     *
     * @return DB_Driver
     */
    public static function factory($type)
    {
        self::$dbType = $type;
        
        $file = str_replace('\\', '/', __FILE__);
        $dir  = substr($file, 0, strrpos($file, "/")) . '/drivers/';
        // $type = ucfirst($type);
        $type = strtolower($type);
        
        if (file_exists($dir . $type . '.php')) {
            require_once $dir . $type . '.php';
            $class    = 'DB_' . $type;
            $instance = new $class;
            return $instance;
        } else {
            throw new Exception('Invalid Database Type: ' . $type);
        }
    }

    /**
     * Returns the db instance by config
     *
     * @param string @target: which database to select. 'app', 'info', 'midlayer'
     * @return Db_Driver
     */
    public static function getInstance($target, $dbInst = false, $persistent = false, $new_link = false)
    {
        return self::_getInstance($target, $dbInst, false, $persistent, $new_link);
    }

    /**
     * get the read db instance by config
     *
     * @param string @target: which database to select. 'app', 'info', 'midlayer'
     * @return Db_Driver
     */
    public static function getReadInstance($target, $dbInst = false, $persistent = false, $new_link = false)
    {
        return self::_getInstance($target, $dbInst, true, $persistent, $new_link);
    }


    /**
     * get the db instance by config
     *
     * @param string $target: which database to select. 'app', 'info', 'midlayer'
     * @param int   $dbInst:  which db instance name, false == only one the db
     * @param bool   $is_read: 
     * @return Db_Driver
     */
    private static function _getInstance($target, $dbInst = false, $is_read = false, $persistent = false, $new_link = false)
    {
        $db_conf = self::getDbConfig($target, $dbInst, $is_read);
        $conf = self::$config[$target];
        $db = self::factory($conf['dbtype']);
        $connect = 'connect';
        if ($persistent === true) {
            $connect = 'pconnect';
        }
        if ( !$db->$connect($db_conf['host'], $db_conf['port'], $db_conf['username'], $db_conf['password'], $db_conf['database'], $new_link) ) {
            throw new Exception($db->error());
        }
        return $db;
    }

    /**
     * create a sql builder, to build sql
     * @param  string $target which database to select. 'app', 'info', 'midlayer'
     * @return SqlBuilder
     */
    public static function createSqlBuilder($target)
    {
        self::loadConfig();
        $conf = self::$config[$target];
        $type = strtolower($conf['dbtype']);
        
        $class    = $type.'SqlBuilder';
        $instance = new $class;
        return $instance;
    }

    /**
     * get the db config
     *
     * @param string $target:  which database to select. 'app', 'info', 'midlayer'
     * @param int $dbInst: which db instance name
     * @param bool   $is_read: 
     * @return array
     */
    public static function getDbConfig($target, $dbInst = false, $is_read = false)
    {
        self::loadConfig();
        if (!isset(self::$config[$target])) {
            throw new Exception("db factory - Unknown target[$target]");
        }
        $conf = self::$config[$target];
        $db_conf_name = $conf['dbtype'];
        if ($dbInst == false)
        {
            if ($is_read === true) {
                $db_conf_name .= '_read';
            }
            if (!isset($conf[ $db_conf_name ])) {
                throw new Exception("db factory - Unknown db config[$db_conf_name]");
            }
            $db_conf = $conf[ $db_conf_name ];
        }
        else
        {
            $db_conf_name .= '_instances';
            if (!isset($conf[ $db_conf_name ])){
                throw new Exception("db factory - Unknown db config[$db_conf_name]");            
            }
            $conf = $conf[ $db_conf_name ];

            if (!isset($conf[$dbInst])){
                throw new Exception("db factory - no db index[$dbindex]");            
            }
            $conf = $conf[$dbInst];

            if ($is_read === true)
                $db_conf_name = 'read';
            else
                $db_conf_name = 'write';
            if (!isset($conf[ $db_conf_name ])) {
                throw new Exception("db factory - Unknown db config[$db_conf_name]");            
            }
            $db_conf = $conf[ $db_conf_name ];
        }
        return $db_conf;
    }


    public static function siteIdToDbInstance($target, $siteId)
    {
        self::loadConfig();

        if (!isset(self::$config[$target])) {
            throw new Exception("db factory - Unknown target[$target]");
        }            
        $conf = self::$config[$target];
        $conf = $conf["site_db_instances"];
        $dbInst = "";
        foreach ($conf as $sd) {
            if ($sd["type"] == "list") {
                $list = $sd["values"];
                foreach ($list as $key => $value) {
                    if ($siteId == $value) {
                        $dbInst = $sd["dbInstance"];
                        break 2;
                    }
                }
            }
            else if ($sd["type"] == "range") {
                $range = $sd["values"];
                if (count($range) != 2) {
                    throw new Exception("siteIdToDbInstance, type:range  value not valid");
                }
                $j = intval($range[0]);
                $k = intval($range[1]);
                if ($j > $k){
                    throw new Exception("siteIdToDbInstance, type:range  value not valid");
                }                        
                if (($siteId >= $j) && ($siteId <= $k)) {
                        $dbInst = $sd["dbInstance"];
                        break;
                } 
            }

        }

        return $dbInst;        
    }

    /**
     * __clone() Magic method to prevent cloning
     *
     * @return void
     */
    private function __clone()
    {
    }
    
    /**
     * Returns the database type
     *
     * @return string
     */
    public static function getType()
    {
        return self::$dbType;
    }
}

/*
$bd = DbFactory::createSqlBuilder('app');
echo $bd->select('info', '`age`, `name`')->where('`id` > 1')->limit(3)->text();

$dbInst = DbFactory::siteIdToDbInstance('midlayer', 3);
var_dump($dbInst);
$db = DbFactory::getInstance('midlayer', $dbInst);
$r = $db->query('select 1');
var_dump($db->fetchRow($r));
$db->close();

$db = DbFactory::getInstance('midlayer');
$r = $db->query('select 1');
var_dump($db->fetchRow($r));
$db->close();
*/
