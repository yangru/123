<?php
/**
 * The database utils.
 *
 * PHP Version 5.3
 *
 * @author    QLeelulu <qleelulu@gmail.com>
 * @since     2012-09-02
 */

if (!defined('DB_TYPE')) {
    require_once(dirname(__FILE__) . '/../jsconf/jsconf.php');
    $jsconf = jsconf_load('app');
    define('DB_TYPE', isset($jsconf["dbtype"]) ? $jsconf["dbtype"] : 'mysql');
}

/**
* mysql utils
*/
class mysqlUtils
{

protected $quoteChar = '`';

public function quote()
{
    return $this->quoteChar;
}

public function getCDbConnectionString($host, $port, $database)
{
    return "mysql:dbname=$database;host=$host;port=$port";
}

public function getDateTimeNowStr()
{
    return date('Y-m-d H:i:s', time());
}

/**
 * Quotes a table name for use in a query.
 * @param string $name table name
 * @return string the properly quoted table name
 */
public function quoteTableName($name)
{
    if ($name[0] == $this->quoteChar) {
        return $name;
    }
    return $this->quoteChar.$name.$this->quoteChar;
}

/**
 * Quotes a column name for use in a query.
 * @param string $name column name
 * @return string the properly quoted column name
 */
public function quoteColumnName($name)
{
    if ($name[0] == $this->quoteChar) {
        return $name;
    }
    // $name = str_replace('.', $this->quoteChar.'.'.$this->quoteChar, $name);
    return $this->quoteChar.$name.$this->quoteChar;
}

/**
 * @param  string $begindate '2011-10-01'
 * @param  string $enddate   '2011-10-01'
 * @return string
 */
public function dateBetween($begindate, $enddate)
{
    // return "between DATE_FORMAT('$begindate', '%Y%m%d') and  DATE_FORMAT('$enddate', '%Y%m%d')";
    $begindate = str_replace('-', '', $begindate);
    $enddate = str_replace('-', '', $enddate);
    return "between '$begindate' and '$enddate'";
}

/**
 * get query sql from config file(midlayer/ClickiModel/confi.php)
 * @param  array $field
 * @return string       query sql
 */
public function getFeedQuery($field)
{
    if (isset($field[DB_TYPE])) {
        return $field[DB_TYPE];
    } else {
        return $field['query'];
    }
}

/**
 * convert column name to the query result column name.
 * e.g. in oracle query result column is uppercase.
 * @param  array $field
 * @return string       query sql
 */
public function resultColumnName($col)
{
    return $col;
}

public function resultColumnValue($result, $col)
{
    if (isset($result[$col])) {
        return $result[$col];
    }
    $col = trim($col, $this->quoteChar);
    return $result[$col];
}

/**
 * 通过参数的方式获取SQL。
 * SQL在配置文件 protected/config/sqls.php 中配置
 * sql的定义方式为： "between '{beginhour}' and '{endhour}'"
 * @param  string $name key name
 * @param  array  $vals params values, e.g. array('begindate' => '2012-09-01')
 * @return string
 */
public function getSql($name, $vals)
{
    global $SQLS;
    $vals2 = array();
    foreach ($vals as $key => $value) {
        $vals2['{'.$key.'}'] = $value;
    }
    if (isset($SQLS[$name][DB_TYPE])) {
        $sql = $SQLS[$name][DB_TYPE];
    } else {
        // default get mysql
        $sql = $SQLS[$name]['mysql'];
    }
    return strtr($sql, $vals2);
}

/**
 * 通过格式化参数的方式获取SQL。
 * SQL在配置文件 protected/config/sqls.php 中配置
 * 例如: getSqlf('keyname', 5, 20120901)
 * @param  string $name key name
 * @return string
 */
public function getSqlf($name)
{
    global $SQLS;
    $args = func_get_args();
    if (isset($SQLS[$name][DB_TYPE])) {
        $args[0] = $SQLS[$name][DB_TYPE];
    } else {
        // default get mysql
        $args[0] = $SQLS[$name]['mysql'];
    }
    return call_user_func_array('sprintf', $args);
}

}



/**
* oracle utils
*/
class oracleUtils extends mysqlUtils
{

protected $quoteChar = '"';

public function getCDbConnectionString($host, $port, $database)
{
    return "oci:dbname=$host:$port/$database;charset=UTF8";
}

public function getDateTimeNowStr()
{
    return new CDbExpression("to_date('".date('Y-m-d H:i:s', time())."', 'yyyy-mm-dd hh24:mi:ss')");
}

/**
 * @param  string $begindate '2011-10-01'
 * @param  string $enddate   '2011-10-01'
 * @return string
 */
public function dateBetween($begindate, $enddate)
{
    // return "between TO_DATE('$begindate','YYYY-MM-DD') and TO_DATE('$enddate', 'YYYY-MM-DD')";
    $begindate = str_replace('-', '', $begindate);
    $enddate = str_replace('-', '', $enddate);
    return "between $begindate and $enddate";
}

/**
 * convert column name to the query result column name.
 * e.g. in oracle query result column is uppercase.
 * @param  array $field
 * @return string       query sql
 */
public function resultColumnName($col)
{
    return strtoupper(str_replace(' ', '', $col));
}

/**
 * oracle的返回结果会中，列名会转换为大写，
 * 但是如果加了双引号的列名，还是和查询语句中一样。
 * 目前查询语句中会有这两种情况混合在一起，这就蛋疼了 =。=！！！！
 * @param  Array  $result  查询结果
 * @param  string $col     列名
 * @return mixed           列值
 */
public function resultColumnValue($result, $col)
{
    $col = trim($col, '"');
    if (!isset($result[$col])) {
        $col = $this->resultColumnName($col);
    }
    if (!isset($result[$col])) {
        return null;
    }
    return $result[$col];
}

}



class DbUtils {

private static $db_type = DB_TYPE;

private static $_class_map = array(
    'mysql' => null,
    'oracle' => null,
);

public static function __callStatic($method, $parameters)
{
    if (empty(self::$_class_map[self::$db_type])) {
        $class = self::$db_type.'Utils';
        self::$_class_map[self::$db_type] = new $class;
    }
    return call_user_func_array(array(self::$_class_map[self::$db_type], $method), $parameters);
}

}


