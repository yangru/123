<?php
$GLOBALS['THRIFT_ROOT'] = '/root/Downloads/thrift-0.8.0/lib/php/src';

# According to the thrift documentation, compiled PHP thrift libraries should
# reside under the THRIFT_ROOT/packages directory.  If these compiled libraries 
# are not present in this directory, move them there from gen-php/.  
require_once ($GLOBALS['THRIFT_ROOT'] . '/Thrift.php');
require_once ($GLOBALS['THRIFT_ROOT'] . '/transport/TSocket.php');
require_once ($GLOBALS['THRIFT_ROOT'] . '/transport/TBufferedTransport.php');
require_once ($GLOBALS['THRIFT_ROOT'] . '/protocol/TBinaryProtocol.php');
require_once ($GLOBALS['THRIFT_ROOT'] . '/packages/Hbase/Hbase.php');
require_once (dirname(__FILE__) . '/../../library/jsconf/jsconf.php');
require_once(dirname(__FILE__) . '/../../library/log/CLogging.php');

class HBase {
	
	private $socket;
	private $transport;
	private $protocol;
	private $client;
	private $t;
	private $columns;
	private $log;
	
    public function __construct($table) {
        $this->open_log();
        $jsconf = jsconf_load('midlayer');
        $hbase_config = $jsconf['hbase'];
        try {
            $this->log->notice("Connect to HBase ...");
        	$this->socket = new TSocket($hbase_config['host'], $hbase_config['port']);
            $this->socket->setSendTimeout($hbase_config['send_time_out']); // Ten seconds (too long for production, but this is just a demo ;)
            $this->socket->setRecvTimeout($hbase_config['recv_time_out']); // Twenty seconds
            $this->transport = new TBufferedTransport($this->socket);
            $this->protocol = new TBinaryProtocol($this->transport);
            $this->client = new HbaseClient($this->protocol);
            $this->transport->open();
            $this->t = $table;
        } catch (Exception $e) {
        	$this->log->error($e->getMessage());
        }
    }
    
    public function setTableName($table) {
        $this->t = $table;
    }
    
    public function getTableName() {
        return $this->t;
    }
    
    public function setColumns($columnDescriptor) {
        $this->columns = $columnDescriptor;
    }
    
    public function getColumns() {
        return $this->columns;
    }
    
    public function deleteTable() {
    	$this->log->notice("Delete Table {$this->t}");
        $tables = $this->client->gettablenames();
        sort($tables);
        foreach ($tables as $name) {
            if ($name == $this->t) {
                try {
                    if ($this->client->isTableEnabled($this->t)) {
                        $this->client->disableTable($this->t);
                    }
                    $this->client->deleteTable($this->t);
                } catch (Exception $e) {
                	$this->log->error($e->getMessage());
                }
            }
        }
    }
    
    public function createTable($columns) {
    	$this->log->notice("Create Table {$this->t}");
        $tables = $this->client->gettablenames();
        sort($tables);
        foreach ($tables as $name) {
            if ($name == $this->t) {
            	$this->log->notice("Table {$this->t} has existed!");
                return;
            }
        }
        try {
            $this->client->createTable($this->t, $columns);
        } catch (Exception $e) {
        	$this->log->error($e->getMessage());
        }
    }
    
    public function putRow($row, $mutations) {
    	$this->log->notice("Mutate Row - table:{$this->t} row:{$row} mutations:".implode(',', $mutations));
        try {
            $this->client->mutateRow($this->t, $row, $mutations);
        } catch (Exception $e) {
        	$this->log->error($e->getMessage());
        }
    }
    
    public function deleteAllRow($row) {
    	$this->log->notice("Delete All Row - table:{$this->t} row:{$row}");
        try {
            $this->client->deleteAllRow($this->t, $row);
        } catch (Exception $e) {
        	$this->log->error($e->getMessage());
        }
    }
    
    public function scannerOpenWithStop($column, $start_row, $stop_row, $limit = 10000000) {
    	$this->log->notice("ScannerOpenWithStop - table:{$this->t} start_row:{$start_row} stop_row:{$stop_row} column:{$column}");
        try {
            $scanner = $this->client->scannerOpenWithStop($this->t, $start_row, $stop_row, array($column));
            $result = $this->client->scannerGetList($scanner, $limit);
            $this->client->scannerClose($scanner);
        } catch (Exception $e) {
        	$this->log->error($e->getMessage());
        }
        if (!empty($result) && is_array($result)) {
            $data = array();
            foreach ($result as $row) {
                $temp = array();
                foreach ($row->columns as $k => $v) {
                    $k = str_replace($column, '', $k);
                    $temp[$k] = $v->value;
                }
                $data[] = $temp;
            }
            return $data;
        } else {
            return false;
        }
    }
    
    private function open_log() {
    	$this->log = new CLogging();
        $cfg = jsconf_load('module_log');
        $name = jsconf_load('name');
        $filename = $cfg['path'] . "/" . strtolower(__CLASS__) . "_$name/" . strtolower(__CLASS__) . '_' . $name . '_' . date("Y-m-d") . '.log';
        $this->log->open(array('filename' => $filename, 'id' => strtolower(__CLASS__) . '_' . $name, 'level' => CLogging::NOTICE));
    }
    
    public function __destruct() {
    	$this->log->close();
    }
}


