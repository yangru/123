<?php
class qq_oauth{

	private $appkey = '';
	private $appsecret = '';
	private static $authorizeURL = 'https://graph.qq.com/oauth2.0/authorize';
	private static $requestTokenURL = 'https://graph.qq.com/oauth2.0/token';
	private static $meOpenidURL = 'https://graph.qq.com/oauth2.0/me';

	function __construct($key, $secret){
		$this->appkey = $key;
		$this->appsecret = $secret;
	}
	/**
	 * 构建请求URL
	 * @param string $url
	 * @param array $params
	 * @param string $oauth_token_secret
	 * 
	 */
	function build_request_uri($callback, $oauth_token_secret=''){
		$params = array(
			'response_type' => 'code',
			'client_id' => $this->appkey,
			'redirect_uri' => $callback,
		);
		return self::$authorizeURL.'?'.http_build_query($params);
	}
	/**
	 * 校验回调是否返回约定的参数 
	 */
	function check_callback(){
		if(isset($_GET['oauth_token']))
			if(isset($_GET['openid']))
				if(isset($_GET['oauth_signature']))
					if(isset($_GET['timestamp']))
						if(isset($_GET['oauth_vericode']))
							return true;
		return false;
	}
	
	function get_contents($url){
		$curl = curl_init();
		curl_setopt($curl,CURLOPT_RETURNTRANSFER,true);
		curl_setopt($curl,CURLOPT_URL,$url);
		return curl_exec($curl);
	}
	/**
	 * Step1：请求临时token、Step2：生成未授权的临时token
	 */
	function oauth_request_token($callback){
		$url = $this->build_request_uri($callback);
		header("Location: $url");
	}
	/**
	 * Step3：引导用户到Qzone的登录页
	 * @param string $oauth_token 未授权的临时token
	 */
	function authorize($oauth_code, $callback){
		$str = "HTTP/1.1 302 Found";
		header($str);
		$query_strings = http_build_query(array(
			'grant_type'=>'authorization_code',
			'client_id' => $this->appkey,
			'client_secret' => $this->appsecret,
			'code'=>$oauth_code,
			'redirect_uri'=>$callback,
		));
		$url = self::$requestTokenURL.'?'.$query_strings;
		$response = $this->get_contents($url);
		parse_str($response);
		/*
		oauth_token	未授权的临时token
		oauth_token_secret	token的密钥，该密钥仅限于临时token
		error_code	错误码
		*/
		if (isset($access_token)){
			return array(
				'access_token'=>$access_token,
				'expires_in'=>$expires_in
			);
		} else {
			$lpos = strpos($response, "(");
			$rpos = strrpos($response, ")");
			$response  = substr($response, $lpos + 1, $rpos - $lpos -1);
			$msg = json_decode($response);
			if (isset($msg->error))
			{
				return array(
					'error' => $msg->error,
					'msg' => $msg->error_description,
				);
			}
		}
	}

	function get_openid($access_token){
		$query_strings = http_build_query(array(
			'access_token'=>$access_token,
		));
		$url = self::$meOpenidURL.'?'.$query_strings;
		$response = $this->get_contents($url);
		if (strpos($response, "callback") !== false)
		{
			$lpos = strpos($response, "(");
			$rpos = strrpos($response, ")");
			$str  = substr($response, $lpos + 1, $rpos - $lpos -1);
		}
		$user = json_decode($str);
		if (isset($user->openid))
			return $user->openid;
	}
	/**
	 * Step4：Qzone引导用户跳转到第三方应用
	 * @return bool 验证是否有效 
	 */
	function register_user(){
		/*
		 * oauth_token	已授权的临时token
		 * openid	腾讯用户对外的统一ID，该OpenID与用户QQ号码一一对应
		 * oauth_signature	签名值，方便第三方来验证openid以及来源的可靠性。
		 * 		使用HMAC-SHA1算法：
		 * 		源串：openid+timestamp（串中间不要添加'+'符号）
		 * 		密钥：oauth_consumer_secret
		 * timestamp	openid的时间戳
		 * oauth_vericode	授权验证码。
		 */
		if($this->check_callback()){
			//校验签名
			$signature = base64_encode(hash_hmac('sha1',$_GET['openid'].$_GET['timestamp'],$this->C('oauth_consumer_secret'),true));
			if(!empty($_GET['oauth_signature']) && $signature==$_GET['oauth_signature']){
				$_SESSION['oauth_token'] = $_GET['oauth_token'];
				$_SESSION['oauth_vericode'] = $_GET['oauth_vericode'];
				return;
			}
		}
		//校验未通过
		exit('UNKNOW REQUEST');
	}
	/**
	 * Step5：请求access token 
	 */
	function request_access_token(){
		$url = $this->build_request_uri($this->C('oauth_request_access_token_url'),array(
			'oauth_token'=>$_SESSION['oauth_token'],
			'oauth_vericode'=>$_SESSION['oauth_vericode']
		),$_SESSION['oauth_token_secret']);
		return $this->get_contents($url);
	}
	/**
	 * Step6：生成access token （保存access token）
	 * 
	 * 关于access_token
	 * 目前access_token(及其secret)是长期有效的，和某一个openid对应，目前可以支持线下获取该openid的信息。 
	 * 当然，用户有权限在Qzone这边删除对第三方的授权，此时该access_token会失效，需要重新走整个流程让用户授权。
	 * 以后会逐步丰富access_token的有效性，长期有效、短期有效、用户登录时才有效等。
	 */
	function save_access_token($access_token_str){
		parse_str($access_token_str,$access_token_arr);
		if(isset($access_token_arr['error_code'])){
			return FALSE;
		} else {
			return $access_token_arr;
		}
	}
	/**
	 * 目前腾讯仅开放该API
	 * 获取登录用户信息，目前可获取用户昵称及头像信息。
	 * http://openapi.qzone.qq.com/user/get_user_info
	 */
	function get_user_info($access_token, $key, $openid, $format = "json"){
		$query_strings = http_build_query(array(
			'access_token'=>$access_token,
			'oauth_consumer_key' => $key,
			'openid' => $openid,
			'format' => $format,
		));
		$url = "https://graph.qq.com/user/get_user_info";
		$url = $url.'?'.$query_strings;
		$response = $this->get_contents($url);
		return json_decode($response);
	}
}
