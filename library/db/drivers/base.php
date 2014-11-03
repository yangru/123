<?php
/**
 * 数据库驱动接口
 *
 * @author    QLeelulu <qleelulu@gmail.com>
 * @since     2012-09-02
 */


/**
 * DB_Driver
 */
interface DB_Driver
{
    /**
     * return the db type
     * @return string: lower string name
     */
    public function dbType();

    /**
     * Connects to the database
     *
     * @param string $host     Hostname
     * @param string $user     Username
     * @param string $password Password
     * @param string $db       Database name
     *
     * @return boolean
     */
    public function connect($host, $port, $user, $password, $db, $new_link = false);

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
    public function pconnect($host, $port, $user, $password, $db, $new_link = false);

    /**
     * Sends a query to the database.
     *
     * This function sends a query to the database.
     *
     * @param   string $query
     * @return  mixed $result
     */
    public function query($query);

    /**
     * Escapes a string for use in a query
     *
     * @param   string
     * @return  string
     */
    public function escape($string);

    /**
     * Escapes a string for use in a query
     *
     * @param   string
     * @return  string
     */
    // public function escape($string);

    /**
     * Fetch a result row as an object
     *
     * @param   mixed $result
     * @return  mixed
     */
    public function fetchObject($result);

    /**
     * Fetch a result row as an associative array.
     *
     * @param   mixed $result
     * @return  mixed: Returns an associative array of strings that corresponds to the fetched row, or FALSE if there are no more rows.
     */
    public function fetchAssoc($result);

    /**
     * Fetch a result row as an object
     *
     * @param   mixed $result
     * @return  array
     */
    public function fetchArray($result);

    /**
     * Fetches a complete result as an object
     *
     * @param  resource      $result Resultset
     * @return Array
     */
    public function fetchAll($result);

    /**
     * Returns an numerical array of strings that corresponds to the fetched row, or FALSE if there are no more rows.
     *
     * @param  resource      $result Resultset
     * @return mixed
     */
    public function fetchRow($result);

    /**
     * Number of rows in a result
     *
     * @param   mixed $result
     * @return  integer
     */
    public function numRows($result);

    /**
     * This function returns the table status.
     *
     * @access  public
     * @return  array
     */
    public function getTableStatus();

    /**
     * Returns the error string.
     *
     * @return string
     */
    public function error();

    /**
     * Free result memory.
     *
     * @access boolean
     */
    public function free($result);

    /**
     * Closes the connection to the database.
     *
     * @access boolean
     */
    public function close();
}
