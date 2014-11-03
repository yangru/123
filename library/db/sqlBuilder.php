<?php
/**
 * sql builder
 *
 * PHP Version 5.3
 *
 * @author    QLeelulu <qleelulu@gmail.com>
 * @since     2012-09-02
 */

require_once(dirname(__FILE__) . '/utils.php');

/**
* mysql查询语句构造器
*/
class mysqlSqlBuilder
{

protected $quote = '`';
protected $queryType = false;
protected $_table = false;
protected $_select = '*';
protected $_where = false;
protected $_order = false;
protected $_group = false;
protected $_values = false;
protected $_limit = false;
protected $_offset = false;


function __construct()
{
    # code...
}

/**
* Quotes a table name for use in a query.
* @param string $name table name
* @return string the properly quoted table name
*/
public function quoteTableName($name)
{
    return $this->quoteChar.$name.$this->quoteChar;
}

/**
 * Quotes a column name for use in a query.
 * @param string $name column name
 * @return string the properly quoted column name
 */
public function quoteColumnName($name)
{
    return $this->quoteChar.$name.$this->quoteChar;
}

    /**
     * 查询
     * @param  string $tableName 表名
     * @param  string $fields    需要查询的字段, 所有字段必须用反单引号`包裹
     * @return sqlBuilder
     */
    public function select($tableName, $fields = '*')
    {
        $this->queryType = 1;
        $this->_table = DbUtils::quoteTableName($tableName);
        $this->_select = str_replace('`', $this->quote, $fields);
        return $this;
    }

    public function insert($tableName)
    {
        $this->queryType = 2;
        $this->_table = DbUtils::quoteTableName($tableName);
        return $this;
    }

    public function update($tableName)
    {
        $this->queryType = 3;
        $this->_table = DbUtils::quoteTableName($tableName);
        return $this;
    }

    public function values($vals)
    {
        $this->_values = $vals;
        return $this;
    }

    public function limit($limit, $offset=0)
    {
        $this->_limit = $limit;
        $this->_offset = $offset;
        return $this;
    }

    public function where($cond)
    {
        if (!$cond || empty($cond)) {
            return $this;
        }
        $cond = str_replace('`', $this->quote, $cond);
        if ($this->_where === false) {
            $this->_where = ' WHERE '.$cond;
        } else {
            $this->_where .= ' AND '.$cond;
        }
        return $this;
    }

    // $builder->order('`id` desc')
    public function order($order)
    {
        if (!$order || empty($order)) {
            return $this;
        }
        $order = str_replace('`', $this->quote, $order);
        if ($this->_order === false) {
            $this->_order = ' ORDER BY '.$order;
        } else {
            $this->_order .= ' , '.$order;
        }
        return $this;
    }

    // $builder->group('`id` desc')
    public function group($group)
    {
        if (!$group || empty($group)) {
            return $this;
        }
        $group = str_replace('`', $this->quote, $group);
        if ($this->_group === false) {
            $this->_group = ' GROUP BY '.$group;
        } else {
            $this->_group .= ' , '.$group;
        }
        return $this;
    }

    public function text()
    {
        $sql = '';
        switch ($this->queryType) {
            case 1:
                $sql = $this->textSelect();
                break;
            case 2:
                $sql = $this->textInsert();
                break;
            case 3:
                $sql = $this->textUpdate();
                break;
        }
        return $sql;
    }

    protected function textSelect()
    {
        $sql = "SELECT $this->_select FROM $this->_table $this->_where $this->_group $this->_order ".$this->textLimit();
        return $sql;
    }

    protected function textLimit()
    {
        if ($this->_limit && $this->_limit > 0) {
            return "LIMIT $this->_limit";
        }
        return '';
    }

    protected function textInsert()
    {
        foreach ($this->_values as $key => $value) {
            $cols[] = DbUtils::quoteColumnName($key);
            $vals[] = "'$value'";
        }
        $cols = implode(', ', $cols);
        $vals = implode(', ', $vals);
        $sql = "INSERT INTO $this->_table ($cols) VALUES ($vals)";
        return $sql;
    }

    protected function textUpdate()
    {
        foreach ($this->_values as $key => $value) {
            $cols[] = DbUtils::quoteColumnName($key)."='$value'";
        }
        $cols = implode(', ', $cols);
        $sql = "UPDATE $this->_table SET $cols $this->_where";
        return $sql;
    }
}

/**
* 
*/
class oracleSqlBuilder extends mysqlSqlBuilder
{
    protected $quote = '"';

    function __construct()
    {
        # code...
    }

    protected function textSelect()
    {
        $table = $this->_table;
        if ($this->_order && $this->_limit) {
            $sql = "SELECT * FROM (SELECT $this->_select FROM $this->_table $this->_where $this->_group $this->_order) WHERE ROWNUM <= $this->_limit";
        } else {
            $sql = "SELECT $this->_select FROM $table $this->_where $this->_group ".$this->textLimit();
        }
        return $sql;
    }

    protected function textLimit()
    {
        $limit = '';
        if ($this->_limit && $this->_limit > 0) {
            if ($this->_where) {
                $limit .= ' AND ';
            }
            $limit .= "ROWNUM <= $this->_limit";
        }
        return $limit;
    }
}

/*
$b = new mysqlSqlBuilder;
echo $b->select('info')->where('`name` > 1')->order('`age` desc')->limit(1)->text()."\n";
$b = new mysqlSqlBuilder;
echo $b->select('conf_location')
                    ->group('`country`')
                    ->text()."\n";

$b = new oracleSqlBuilder;
echo $b->select('info', '`age`')->where('`name` > 1')->order('`age` desc')->limit(1)->text()."\n";
$b = new oracleSqlBuilder;
echo $b->select('info')->where('`name` > 1')->text()."\n";
$b = new oracleSqlBuilder;
echo $b->update('info')->where('`name` > 1')->values(array('age' => 3, 'name' => 'clicki'))->text()."\n";
$b = new oracleSqlBuilder;
echo $b->insert('info')->values(array('age' => 3, 'name' => 'clicki'))->text()."\n";
*/
