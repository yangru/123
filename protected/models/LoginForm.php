<?php

/**
 * LoginForm class.
 * LoginForm is the data structure for keeping
 * user login form data. It is used by the 'login' action of 'SiteController'.
 */
class LoginForm extends CFormModel {
	public $user_name;
	public $email;
	public $password;
	public $repassword;
	public $rememberMe = true;
	public $validateCode;
	private $_identity;
	public $checksum = '';
	public $site_url;
	
	/**
	 * Declares the validation rules.
	 * The rules state that username and password are required,
	 * and password needs to be authenticated.
	 */
	public function rules() {
		return array (
				array (
						'user_name',
						'unique',
						'message' => t ( '用户名已存在' ),
						'on' => 'reg',
						'className' => 'Users' 
				),
				array (
						'user_name',
						'length',
						'min' => 4,
						'max' => 20 
				),
				array (
						'email',
						'email',
						'message' => t ( '邮箱不正确.' ) 
				),
				array (
						'email',
						'length',
						'max' => 255 
				),
				array (
						'email',
						'exist',
						'message' => '邮箱不存在,请先注册.',
						'on' => 'login',
						'className' => 'Users' 
				),
				array (
						'password',
						'authenticate',
						'on' => 'login' 
				),
				array (
						'password',
						'length',
						'min' => 6,
						'max' => 16 
				),
				// array('repassword', 'required', 'message'=>t('请再次输入您的密码'), 'on'=>'reg'),
				// array('repassword', 'compare', 'compareAttribute'=>'password', 'message'=>t('两次密码不一样'),'on'=>'reg'),
				// array('validateCode', 'captcha', 'allowEmpty'=>false, 'message'=>t('验证码错误'), 'on'=>'login reg'),
				array (
						'rememberMe',
						'boolean',
						'on' => 'login' 
				),
				array (
						'site_url',
						'length',
						'on' => 'apply',
						'max' => 256 
				),
				array (
						'site_url',
						'url',
						'on' => 'apply',
						'defaultScheme' => 'http',
						'message' => '网站地址不是有效的URL.' 
				),
				array (
						'checksum',
						'length',
						'min' => 1,
						'on' => 'reg' 
				) 
		);
	}
	
	/**
	 * Declares attribute labels.
	 */
	public function attributeLabels() {
		return array (
				'user_name' => t ( '用户名：' ),
				'email' => t ( '邮箱：' ),
				'password' => t ( '密码：' ),
				'rememberMe' => t ( '自动登录' ),
				'repassword' => t ( '确认密码：' ),
				'site_url' => t ( '网站地址：' ),
				'checksum' => t ( '邀请码：' ) 
		// 'validateCode'=>t('验证码：'),
				);
	}
	
	/**
	 * Authenticates the password.
	 * This is the 'authenticate' validator as declared in rules().
	 */
	public function authenticate($attribute, $params) {
		if ($this->hasErrors ( 'user_name' )) {
			return false;
		}
		$this->_identity = new UserIdentity ( $this->user_name, $this->password );
		if (isset ( $_SESSION ['P_' . $this->user_name] ) && $_SESSION ['P_' . $this->user_name] > 10) {
			if (time () - $_SESSION ['P_' . $this->user_name] < 300) {
				$this->addError ( 'user_name', t ( '尝试次数过多，请稍后再试...' ) );
				return;
			}
		}
		if (! $this->_identity->authenticate ()) {
			// $this->addError('email', t('邮箱或密码有误...') . ' <a href="' .url('user/forgot'). '">' . t('忘记密码') . '</a>');
			if (! isset ( $_SESSION ['P_' . $this->user_name] )) {
				$_SESSION ['P_' . $this->user_name] = 1;
			} else if ($_SESSION ['P_' . $this->user_name] > 5) {
				if ($_SESSION ['P_' . $this->user_name] < 10) {
					$_SESSION ['P_' . $this->user_name] = time ();
					$this->addError ( 'user_name', t ( '尝试次数过多，请稍后再试...' ) );
				}
			} else {
				$_SESSION ['P_' . $this->user_name] += 1;
			}
			$this->addError ( 'user_name', t ( '用户名或密码有误...' ) );
		} else {
			unset ( $_SESSION ['P_' . $this->user_name] );
		}
	}
	
	/**
	 * Logs in the user using the given username and password in the model.
	 *
	 * @return boolean whether login is successful
	 */
	public function login() {
		try {
			Yii::log ( __CLASS__, __FUNCTION__, '用户' . $this->user_name . '登录', YII_INFO );
			if ($this->_identity === null) {
				$this->_identity = new UserIdentity ( $this->user_name, $this->password );
			}
			if ($this->_identity->authenticate ()) {
				$duration = (user ()->allowAutoLogin && $this->rememberMe) ? param ( 'autoLoginDuration' ) : 0;
				$user = Users::model ()->findByAttributes ( array (
						'user_name' => strtolower ( $this->user_name ) 
				) );
				$user->count ++;
				$user->update ();
				user ()->login ( $this->_identity, $duration );
				return $user;
			} else {
				return false;
			}
		} catch ( Exception $e ) {
			Yii::log ( __CLASS__, __FUNCTION__, '用户登录失败：' . $e->getMessage (), YII_ERROR );
		}
	}
	public function createUser() {
		try {
			Yii::log ( __CLASS__, __FUNCTION__, '创建用户' . $this->user_name, YII_INFO );
			$user = new Users ();
			$user->user_name = $this->user_name;
			$user->email = $this->email;
			$user->password = $user->hashPassword ( $this->password );
			$user->status = 1;
			$user->create_time = date ( 'Y-m-d H:i:s', time () );
			$user->checksum = Users::generate_checksum ( $this->user_name, $user->create_time );
			return $user->save () ? $user : false;
		} catch ( Exception $e ) {
			Yii::log ( __CLASS__, __FUNCTION__, '创建用户失败：' . $e->getMessage (), YII_ERROR );
		}
	}
}
