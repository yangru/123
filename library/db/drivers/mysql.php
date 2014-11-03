<?php
/**
 * The DB_Mysql class provides methods and functions for MySQL 5.0.x,
 * 5.1.x, and 5.5.x databases.
 *
 * PHP Version 5.3
 *
 * @author    QLeelulu <qleelulu@gmail.com>
 * @since     2012-09-02
 */

require_once('base.php');

/**
 * DB_mysql
 *
 */
class DB_mysql implements DB_Driver 
{
    /**
     * The connection object
     *
     * @var mixed
     */
    private $conn = false;

    public $lastQuery = '';

    /**
     * return the db type
     * @return string
     */
    public function dbType()
    {
        return 'mysql';
    }

    /**
     * Connects to the database
     *
     * @param string $host     MySQL Hostname
     * @param string $username MySQL Username
     * @param string $password MySQL Password
     * @param string $db_name  MySQL Database name
     *
     * @return boolean
     */
    public function connect ($host, $port, $user, $password, $db, $new_link = false)
    {
        $this->conn = mysql_connect($host.':'.$port, $user, $password, $new_link);
        if (empty($db) || $this->conn == false) {
            return false;
        }
        
        mysql_set_charset('utf8', $this->conn);
        
        return mysql_select_db($db, $this->conn);
    }

    /**
     * Connects to the database using a persistent connection
     *
     * @param string $host     Hostname
     * @param string $user     Username
     * @param string $password Password
     * @param string $db       Database name
     *
     * @return boolean
     */
    public function pconnect($host, $port, $user, $password, $db, $new_link = false)
    {
        $this->conn = mysql_pconnect($host.':'.$port, $user, $password, $new_link);
        if (empty($db) || $this->conn == false) {
            return false;
        }
        
        mysql_set_charset('utf8', $this->conn);
        
        return mysql_select_db($db, $this->conn);
    }

    /**
     * This function sends a query to the database.
     *
     * @param  string $query Query string
     * @return mixed
     */
    public function query($query)
    {
        $this->lastQuery = $query;
        $result = mysql_query($query, $this->conn);
        return $result;
    }

    /**
     * Escapes a string for use in a query
     *
     * @param  string $string String
     * @return string
     */
    public function escape($string)
    {
        return mysql_real_escape_string($string, $this->conn);
    }

    /**
     * Fetch a result row as an object
     *
     * @param  mixed $result Resultset
     * @return mixed
     */
    public function fetchObject($result)
    {
        return mysql_fetch_object($result);
    }

    /**
     * Fetch a result row as an associative array.
     *
     * @param   mixed $result
     * @return  mixed: Returns an associative array of strings that corresponds to the fetched row, or FALSE if there are no more rows.
     */
    public function fetchAssoc($result){
        return mysql_fetch_assoc($result);
    }

    /**
     * Returns an numerical array of strings that corresponds to the fetched row, or FALSE if there are no more rows.
     *
     * @param  resource      $result Resultset
     * @return mixed
     */
    public function fetchRow($result){
        return mysql_fetch_row($result);
    }

    /**
     * Fetch a result row as an object
     *
     * @param  mixed $result Resultset
     * @return mixed
     */
    public function fetchArray($result)
    {
        return mysql_fetch_assoc($result);
    }

    /**
     * Fetches a complete result as an object
     *
     * @param  resource     $result Resultset
     * @return Array
     */
    public function fetchAll($result)
    {
        $ret = array();
        if (false === $result) {
            throw new Exception('Error while fetching result: ' . $this->error());
        }
        
        while ($row = $this->fetchObject($result)) {
            $ret[] = $row;
        }
        
        return $ret;
    }
    
    /**
     * Number of rows in a result
     *
     * @param  mixed   $result Resultset
     * @return integer
     */
    public function numRows($result)
    {
        return mysql_num_rows($result);
    }

    /**
     * Returns the table status.
     *
     * @return array
     */
    public function getTableStatus()
    {
        $arr = array();
        $result = $this->query("SHOW TABLE STATUS");
        while ($row = $this->fetchArray($result)) {
            $arr[$row["Name"]] = $row["Rows"];
        }
        return $arr;
    }

     /**
      * Returns the error string.
      *
      * @return string
      */
    public function error()
    {
        return mysql_error($this->conn);
    }

    // /**
    //  * Returns the client version string.
    //  *
    //  * @return string
    //  */
    // public function clientVersion()
    // {
    //     return mysql_get_client_info();
    // }

    // /**
    //  * Returns the server version string.
    //  *
    //  * @return string
    //  */
    // public function serverVersion()
    // {
    //     return mysql_get_server_info();
    // }

    /**
     * Free result memory.
     *
     * @access boolean
     */
    public function free($result)
    {
        return mysql_free_result($result);
    }

    /**
     * Closes the connection to the database.
     *
     * @return void
     */
    public function close()
    {
        if (is_resource($this->conn)) {
            mysql_close($this->conn);
        }
    }
}
