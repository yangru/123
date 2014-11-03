<?php
//修改agents.php后，运行该文件升级UserAgentParser.php

$updater = new Update;
$updater->updateAgent();
Class Update{
	public function __construct(){
		require_once("old_agents.php");//历史版本的agent数组
		require_once("agents.php");//新版本的agent数组
		
		$this->oldOs = @$old_os;
		$this->oldBrowser = @$old_browser;
		$this->newBrowser = @$BROWSERS;
		$this->newOs = @$OSES;
		$this->osType = @$OS_TYPES;
		$this->osTypeToId = @$OS_TYPE_TO_ID;
	}
	public function updateAgent($file = 'UserAgentParser.php'){
		$this->browsers = $this->transBrowser($this->oldBrowser, $this->newBrowser);
		$this->oses = $this->transOs($this->oldOs, $this->newOs, $this->osType);
		$this->browserNameToInfo = $this->getBrowserNameToInfo($this->browsers);
		$this->replaceFile($file, "browserInfo", $this->browserNameToInfo);
		$this->osNameToInfo =  $this->getOsNameToInfo($this->oses);
		$this->replaceFile($file, "osInfo", $this->osNameToInfo);
		$this->browserIdToInfo = $this->getBrowserIdToInfo($this->browsers);
		$this->replaceFile($file, "browserIdToInfo", $this->browserIdToInfo);
		$this->osIdToInfo =  $this->getOsIdToInfo($this->oses);
		$this->replaceFile($file, "osIdToInfo", $this->osIdToInfo);
		$this->osNameToId = $this->getOsNameToId($this->oses);
		$this->replaceFile($file, "osTypes", $this->osNameToId);
		$this->browserNameToId = $this->getBrowserNameToId($this->browsers, $this->browserNameToInfo);
		$this->replaceFile($file, "browserTypes", $this->browserNameToId);
		$this->replaceFile($file, "browsers", $this->newBrowser);
		$this->replaceFile($file, "oses", $this->newOs);
		
	}
	public function replaceFile($file, $item, $value){
		$str = file_get_contents($file);
		ob_start();

		var_export($value);
		$data = ob_get_contents();
		ob_end_clean();
		$replace = preg_replace ("/($item = )array\s*\([^;]*\)/",
              "\\1$data",
              $str);
		file_put_contents($file, $replace);

	}
	//根据新旧浏览器数组生成浏览器数组
	function transBrowser($old, $new){
		//遍历旧的数组，缓存历史数据的id，缓存最大的id
		$temp_browsers = array();
		$max_id = 0;
		$browsers = array();
		$dump = array();
		foreach($old as $key => $value){
			$icon = $value['icon'];
			$display = $value['description'];
			$temp_browsers[strtolower($value['name'])][0][0] = array('id'=>$key, 'icon'=>$icon, 'name'=>$value['name']);
			if(empty($new[strtolower($value['name'])])){
				$new[strtolower($value['name'])] = $value['name'];
				
			}
			if($key>$max_id){$max_id = $key;}
			if(!empty($value['child']))foreach ($value['child'] as $major_key => $major){
				$icon = empty($major['icon'])?$icon:$major['icon'];
				$display = empty($major['description'])?$display:$major['description'];
				$temp_browsers[strtolower($value['name'])][$major['name']][0] = array('id'=>$major_key, 'icon'=>$icon, 'name'=>$value['name'], 'display'=>$display);
				
				if($major_key>$max_id){$max_id = $major_key;}
				if(!empty($major['child']))foreach($major['child'] as $mirror_key => $mirror){
					$icon = empty($mirror['icon'])?$icon:$mirror['icon'];
					$display = empty($mirror['description'])?$display:$mirror['description'];
					$temp_browsers[strtolower($value['name'])][$major['name']][$mirror['name']] = array('id'=>$mirror_key, 'icon'=>$icon, 'name'=>$value['name']);
					if($mirror_key>$max_id){$max_id = $mirror_key;}
				}
			}
		}
		//遍历新的数据、主版本、子版本
		//查询是否有历史id，如果有，保存旧的id，如果没有，根据缓存的最大id生成新的id，更新最大缓存
		//生成列表
		$new = array_unique ($new);
		
		foreach ($new as $key => $value){

			if(empty($temp_browsers[strtolower($value)])){
						$max_id = $max_id+100;
						$temp_browsers[strtolower($value)][0][0] = array('id'=>$max_id, 'icon'=>strtolower($value), 'name'=>$value);
			}
			for($i = 0; $i<=20; $i++){
				for($ii = 0; $ii<=20; $ii++){
					if(!empty($temp_browsers[strtolower($value)][$i][$ii])){
						$browsers[strtolower($value)][$i][$ii] = array('id'=>$temp_browsers[strtolower($value)][$i][$ii]['id'], 'icon'=>$temp_browsers[strtolower($value)][$i][$ii]['icon'], 'name'=>$value, 'display'=>$value.($i>0?$i:''));

						$version = ($i==0)?0:$browsers[strtolower($value)][$i][0]['id'];
						$subversion = ($ii==0)?0:$browsers[strtolower($value)][$i][$ii]['id'];

						$dump[] = array('type'=>$browsers[strtolower($value)][0][0]['id'], 'version'=>$version, 'subversion'=>$subversion, 'icon'=>$browsers[strtolower($value)][$i][$ii]['icon'], 'type_name'=>$browsers[strtolower($value)][$i][$ii]['name'], 'version_name'=>$i, 'subversion_name'=>$ii, 'description'=>$browsers[strtolower($value)][$i][$ii]['display']);
					}else{
						$version = $temp_browsers[strtolower($value)][0][0]['id']+$i*10+$ii;
						if($i == 0){
							if($ii==0){
								$description = $value;
							}else{
								$description = $value.'0.'.$ii;
							}
						}else{
							$description = $value.$i;
						}
						$browsers[strtolower($value)][$i][$ii] = array('id'=>$version, 'icon'=>$temp_browsers[strtolower($value)][0][0]['icon'], 'name'=>$value, 'display'=>$description);
						$dump[] = array('type'=>$browsers[strtolower($value)][0][0]['id'], 'version'=>$browsers[strtolower($value)][$i][0]['id'], 'subversion'=>$browsers[strtolower($value)][$i][$ii]['id'], 'icon'=>$browsers[strtolower($value)][$i][$ii]['icon'], 'type_name'=>$browsers[strtolower($value)][$i][$ii]['name'], 'version_name'=>$i, 'subversion_name'=>$ii, 'description'=>$browsers[strtolower($value)][$i][$ii]['display'], 'empty' => 1);

					}
				}
			}
		}
		//print_r($temp_browsers['firefox']);
		//print_r($dump);
		return $dump;
	}
	//根据新旧操作系统数组生成操作系统数组
	function transOs($old, $new, $os_type){
		//遍历旧数组（两层），存储id和最大id
		$temp_oses = array();
		$max_id = 0;
		$oses = array();
		$dump = array();
		foreach($old as $key => $value){
			$icon = $value['icon'];
			$display = $value['description'];
			$oses[strtolower($value['name'])] = array('id'=>$key, 'icon'=>$icon, 'name'=>$value['name']);
			$dump[] = array('type'=>$key, 'version'=>0, 'subversion'=>0, 'icon'=>$icon, 'type_name'=>$value['name'], 'version_name'=>$value['name'], 'subversion_name'=>'', 'description'=>$value['name']);
			
			if($key>$max_id){$max_id = $key;}
			if(!empty($value['child'])){
				foreach ($value['child'] as $major_key => $major){
					$icon = empty($major['icon'])?$icon:$major['icon'];
					$display = empty($major['description'])?$display:$major['description'];
					$temp_oses[strtolower($value['name'])][strtolower($major['name'])] = array('id'=>$major_key, 'icon'=>$icon, 'name'=>$major['name'], 'display'=>$display);
					
					if($major_key>$max_id){$max_id = $major_key;}
				}

			}
		}
		//遍历新数组
		//如果有历史记录，记录其id，如果没有，根据最大id+1得到当前id
		//$new = array_unique ($new);
		foreach($os_type as $key=>$value){
			if(empty($oses[strtolower($value)])){
				$id = ++$max_id;
				$oses[strtolower($value)] = array('id'=>$id, 'icon'=>strtolower($value), 'name'=>$value, 'display'=>$value);
				$dump[] = array('type'=>$id, 'version'=>0, 'subversion'=>0, 'icon'=>strtolower($value), 'type_name'=>$value, 'version_name'=>$value, 'subversion_name'=>'', 'description'=>$value);
				//$dump[] = strtolower($value)."	".$id."	0	0	".strtolower($value)."	".$value."	$value		".$value."\n";
			}
		}
		foreach ($new as $key => $value){
			$type = $os_type[$value]?$os_type[$value]:$value;
			if(empty($oses[strtolower($value)])){
				if(!empty($temp_oses[strtolower($type)][strtolower($value)])){
					$oses[strtolower($value)] = array('id'=>$temp_oses[strtolower($type)][strtolower($value)]['id'], 'icon'=>$temp_oses[strtolower($type)][strtolower($value)]['icon'], 'name'=>$value, 'display'=>$value);
				}else{
					$id = ++$max_id;
					$oses[strtolower($value)] = array('id'=>$id, 'icon'=>strtolower($type), 'name'=>$value, 'display'=>$value);
					
				}
				
				$dump[] = array('type'=>$oses[strtolower($type)]['id'], 'version'=>$oses[strtolower($value)]['id'], 'subversion'=>0, 'icon'=>$oses[strtolower($value)]['icon'], 'type_name'=>$oses[strtolower($type)]['name'], 'version_name'=>$value, 'subversion_name'=>'', 'description'=>$value);
				
			}
		}
		//print_r($temp_browsers['firefox']);
		//print_r($dump);
		return $dump;
	}

	//生成浏览器id反查数组
	public function getBrowserIdToInfo($browsers){
		foreach($browsers as $key=>$value){
			if(empty($value['empty'])){
				$browserx[$value['type']][$value['version']][$value['subversion']] = $value;
			}
		}
		return $browserx;
	}

	//生成操作系统id反查数组
	public function getOsIdToInfo($os){
		foreach($os as $key=>$value){
			$osx[$value['type']][$value['version']][$value['subversion']] = $value;
		}
		return $osx;
	}

	//生成浏览器name+version->info数组
	public function getBrowserNameToInfo($browsers){
		foreach($browsers as $key=>$value){
			//var_dump($value);
			if($value['version']==$value['type']){
				$value['version'] = 0;
			}
			if($value['subversion']==$value['version']){
				$value['subversion'] = 0;
			}
			if($value['version']==0){
				$index = strtolower($value['type_name']);
			}else{
				$index = strtolower($value['type_name']).$value['version_name'];
			}
			//empty表示不用写入配置文件
			if(empty($value['empty'])){$brs[$index] = array('type'=>$value['type'],
														'version'=>$value['version'],'subversion'=>$value['subversion'],
														'type_name'=>$value['type_name'],
														'version_name'=>$value['version_name'],
														'subversion_name'=>$value['subversion_name'],
														'icon'=>$value['icon'],
														'description'=>$value['description']);
			}

		}

		return $brs;
	}
	//生成操作系统name+version->info数组
	public function getOsNameToInfo($os){
		foreach($os as $key=>$value){
			//var_dump($value);
			if($value['version'] == 0){
				$id = $value['type'];
			}else{
				$id = $value['version'];
			}
			$oses[strtolower($value['description'])] = array('type'=>$value['type'],
														'version'=>$value['version'],'subversion'=>0,
														'type_name'=>$value['type_name'],
														'icon'=>$value['icon'],
														'description'=>$value['description']
														);
		
		}
		return $oses;

	}
	public function getOsNameToId($oses){
		
		$osx = array();
		foreach($oses as $key=>$value){
			if($value['version'] == 0&&$value['subversion']==0){
				$osx[strtolower($value['type_name'])] = $value['type'];
			}
		}
		return $osx;
	}
	public function getBrowserNameToId($browsers, $browserNameToInfo){
		$browserx = array();
		foreach($browsers as $key=>$value){

			$browserx[strtolower($value['type_name'])] = $browserNameToInfo[strtolower($value['type_name'])]['type'];

		}
		return $browserx;
	}
}


//mysql_connect("clicki.server", "clicki", "3281344c86");
//mysql_select_db("clicki_v2");
//exit;
//foreach($browsers as $key=>$value){
//	//var_dump($value);
//	if($value['version']==$value['type']){
//		$value['version'] = 0;
//	}
//	if($value['subversion']==$value['version']){
//		$value['subversion'] = 0;
//	}
//	$sql = "INSERT INTO `conf_browser`(type,version,subversion,icon,type_name,version_name,subversion_name,description) VALUES({$value['type']}, {$value['version']}, {$value['subversion']},'{$value['icon']}', '{$value['type_name']}', '{$value['version_name']}', '{$value['subversion_name']}', '{$value['description']}');";
//	mysql_query($sql);
//	//empty表示不用写入配置文件
//	/* {$brs[$value['description']] = array('type'=>$value['type'],
//												'version'=>$value['version'],'subversion'=>$value['subversion'],
//												'type_name'=>$value['type_name'],
//												'version_name'=>$value['version_name'],
//												'subversion_name'=>$value['subversion_name'],
//												'icon'=>$value['icon'],
//												'description'=>$value['description']);
//	}
//	 */
//}
//exit;
//var_export($brs);
//往数据库里插入数据：

//var_export($osx);
//foreach($os as $key=>$value){
//	//var_dump($value);
//	if($value['version'] == 0){
//		$id = $value['type'];
//	}else{
//		$id = $value['version'];
//	}
//	$sql = "INSERT INTO `conf_os`(type,version,subversion,icon,type_name,version_name,subversion_name,description) VALUES({$value['type']}, {$value['version']}, {$value['subversion']},'{$value['icon']}', '{$value['type_name']}', '{$value['version_name']}', '{$value['subversion_name']}', '{$value['description']}');";
//	mysql_query($sql);
//	$oses[$value['description']] = array('type'=>$value['type'],
//												'version'=>$value['version'],'subversion'=>0,
//												'type_name'=>$value['type_name'],
//												'icon'=>$value['icon'],
//												'description'=>$value['description']
//												);
//
//}
//var_export($oses);
