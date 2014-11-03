<?php
/**
 * The DB_oracle class provides methods and functions for Oracle 10g, 11g,
 * 5.1.x, and 5.5.x databases.
 *
 * PHP Version 5.3
 *
 * @author    QLeelulu <qleelulu@gmail.com>
 * @since     2012-09-02
 */

require_once('base.php');

/**
 * DB_oracle
 *
 */
class DB_oracle implements DB_Driver 
{
    /**
     * The connection object
     *
     * @var mixed
     */
    private $conn = false;

    private $stmt = false;

    public $lastQuery = '';

    /**
     * return the db type
     * @return string
     */
    public function dbType()
    {
        return 'oracle';
    }

    /**
     * Connects to the database
     *
     * @param string $host     Oracle Hostname
     * @param string $username Oracle Username
     * @param string $password Oracle Password
     * @param string $db_name  Oracle Database name
     *
     * @return boolean
     */
    public function connect ($host, $port, $user, $password, $db, $new_link, $new_link = false)
    {
        $this->conn = oci_connect($user, $password, $host.':'.$port.'/'.$db, 'utf8');
        if (!$this->conn) {
            print_r('oci_connect error: '.$user.' -- '.$password.' -- '.$host.':'.$port.'/'.$db);
            return false;
        }
        return true;
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
        $this->conn = oci_pconnect($user, $password, $host.':'.$port.'/'.$db, 'utf8');
        if (!$this->conn) {
            return false;
        }
        return true;
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
        $this->stmt = oci_parse($this->conn, $query);
        if ($this->stmt) {
            if (oci_execute($this->stmt)){
                return $this->stmt;
            }
        }
        echo "==>>>  ".$query."\n";
        return false;
    }

    /**
     * Escapes a string for use in a query
     *
     * @param  string $inp String
     * @return string
     */
    public function escape($inp)
    {
        return !empty($inp) && is_string($inp) ? str_replace(array('\\', "\0", "\n", "\r", "'", '"', "\x1a"), array('\\\\', '\\0', '\\n', '\\r', "\\'", '\\"', '\\Z'), $inp) : $inp;
    }

    /**
     * Fetch a result row as an object
     *
     * @param  mixed $result Resultset
     * @return mixed
     */
    public function fetchObject($result)
    {
        return oci_fetch_object($result);
    }

    /**
     * Fetch a result row as an associative array.
     *
     * @param   mixed $result
     * @return  mixed: Returns an associative array of strings that corresponds to the fetched row, or FALSE if there are no more rows.
     */
    public function fetchAssoc($result){
        return oci_fetch_assoc($result);
    }

    /**
     * Returns an numerical array of strings that corresponds to the fetched row, or FALSE if there are no more rows.
     *
     * @param  resource      $result Resultset
     * @return mixed
     */
    public function fetchRow($result){
        return oci_fetch_row($result);
    }

    /**
     * Fetch a result row as an object
     *
     * @param  mixed $result Resultset
     * @return mixed
     */
    public function fetchArray($result)
    {
        return oci_fetch_array($result);
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
        return oci_num_rows($result);
    }

    /**
     * Returns the table status.
     *
     * @return array
     */
    public function getTableStatus()
    {
        return array();
    }

     /**
      * Returns the error string.
      *
      * @return string
      */
    public function error()
    {
        if ($this->conn) {
            $e = oci_error($this->conn);
            if (!$e) {
                $e = oci_error($this->stmt);
            }
        } else {
            $e = oci_error();
        }
        return $e['message'];
    }

    /**
     * Free result memory.
     *
     * @access boolean
     */
    public function free($result)
    {
        return oci_free_statement($result);
    }

    /**
     * Closes the connection to the database.
     *
     * @return void
     */
    public function close()
    {
        if (is_resource($this->conn)) {
            oci_close($this->conn);
        }
    }
}
