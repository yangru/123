<?php
class UserController extends Controller {
    
    public $layout='//layouts/user/column';
    public $max_resend = 3;
    //15分钟
    public $max_timeout = 900; 
    
    public function filters() {
        return array(
            'accessControl',
        );
    }
        
    public function accessRules() {
		return array(
			//array(
			//	'deny',
			//	'actions' => array('setpassword'),
			//	'expression'=>'$user->getState("demo") == 1',
			//	//'users' => array('clicki@163.com'),
			//),
		);
    }
    
    public function actionLogin() {

		if (VERSION_TYPE === VERSION_TYPE_FREE) {
			if (!user()->isGuest && !user()->getState('demo')) {
				$this->redirect('/manage/', false);
			}
		} else {
			if (!user()->isGuest) {
				$this->redirect('/manage/', false);
			}
		}

        $this->setPageTitle(t('登录'));
        
        $model = new LoginForm('login');

        if (isset($_POST['ajax']) && $_POST['ajax'] === 'leftForm') {
            echo CActiveForm::validate($model);
            app()->end();
        }
        
        if (isset($_POST['LoginForm'])) {
            $model->attributes = $_POST['LoginForm'];
            
            if ($model->validate() && $user = $model->login()) {
				if (VERSION_TYPE === VERSION_TYPE_FREE) {
					user()->setState('demo', false);
					//登录论坛
					$username = @explode('@', $user->email);
					$this->forums($user->id, $username[0], $user->email, $model->password);
				}
				if (isset($_POST['action']) && $_POST['action'] === 'ajax') {
					die("ok");
				} elseif (isset($_POST['action']) && $_POST['action'] === 'mobile') {
					//mobile return json
					$callback = array(
						'sessionid' => session_id(),
						'userid' => $user->id,
						'username' => $user->email,
						'point' => $user->point,
					);
					die(json_encode($callback));
				} else {
					$this->redirect('/manage/', false);
				}
            } else {
                if (isset($_POST['action']) && $_POST['action'] === 'ajax' && $model->hasErrors()) {
                    $errors = array(
                        'email' => $model->getError('email'),
                        'password' => $model->getError('password'),
                    );                    
                    json_encode_end($errors);
                }
            }
        }

        $this->render('login', array('model' => $model));     

    }

	private function forums($userid, $username, $email, $password){
		global $wp_hasher;

		$dbbb = app()->dbbb;
		$bb_userid = $dbbb->createCommand('SELECT * FROM `bb_users` WHERE `user_login` = "' . $email . '"')->queryScalar();
		if ($bb_userid) {
			$this->set_forums($userid, $bb_userid, $username, $email, $password);
			return true;
		} else {
			if ( empty($wp_hasher) ) {
				require_once( YII_PATH . '/../../public/forums/bb-includes/backpress/class.passwordhash.php');
				// By default, use the portable hash from phpass
				$wp_hasher = new PasswordHash(8, TRUE);
			}
			//加密password
			$hp = $wp_hasher->HashPassword($password);
			$bb_data = array(
				'user_login' => $email,
				'user_nicename' => $email,
				'user_email' => $email,
				'user_url' => '',
				'user_pass' => $hp,
				'user_registered' => gmdate('Y-m-d H:i:s'),
				'display_name' => $username,
				'user_status' => 0,
			);
			$command = $dbbb->createCommand();
			if ($command->insert('bb_users', $bb_data)) {
				$bb_userid = $dbbb->createCommand('SELECT * FROM `bb_users` WHERE `user_login` = "' . $email . '"')->queryScalar();
				$usermeta = array(
					'user_id' => $bb_userid,
					'meta_key' => 'bb_capabilities',
					'meta_value' => serialize(array('member'=>1)),
				);
				$command->insert('bb_usermeta', $usermeta);
				$this->set_forums($userid, $bb_userid, $username, $email, $password);
				return true;
			}
		}
		return false;
	}
    
	private function set_forums($userid, $bb_userid, $username, $email, $password){
		$timestamp = time();
		$scheme = '';
		$cookiepath = '/';
		//bb cookie
		$pass_frag = substr($password, 8, 4 );
		$key = hash_hmac('md5',$email . $pass_frag . '|' . $timestamp, $scheme);
		$hash = hash_hmac('md5', $email . '|' . $timestamp, $key);
		$cookie = $email . '|' . $timestamp . '|' . $hash;
		$authkey = md5( uniqid( microtime() ) );
		$authKey = md5($authkey.$_SERVER['HTTP_USER_AGENT']);
		$authCode = encode("{$userid}\t{$bb_userid}\t{$password}",$authKey);
		$life = 0;
		$timeCycle = $life ==0?0:$life+$timestamp;
		$logged_cookie_name = 'bbpress_logged_in_'.md5(SITEURL.'/forums/');
		$admin_cookie_name = 'bbpress_'.md5(SITEURL.'/forums/');
		$_SESSION['logged_cookie_name'] = $logged_cookie_name;
		$_SESSION['admin_cookie_name'] = $logged_cookie_name;
		setcookie($logged_cookie_name,$cookie,$timeCycle,$cookiepath);
		setcookie($admin_cookie_name,$cookie,$timeCycle,$cookiepath);
		setcookie('logged_in_nick',$email,$timeCycle,$cookiepath);
		setcookie('global_auth', $authCode, $timeCycle,$cookiepath);
	}

    public function actionResendmail() {
        if (isset($_POST['id'])) {
            $user = Users::model()->findByAttributes(array('id'=>$_POST['id']));
            if ($user !== NULL) {
                $session = app()->session;
                if (!$session->autoStart) {
                    $session->open();
				}
                //重发次数
                $resend_count = isset($session['resend']) ? $session['resend'] : 0;
                //重发时间间隔
                $now = time();
                $resend_time = isset($session['resend_time']) ? $session['resend_time'] : $now;
                $resend_first_time = isset($session['resend_first_time']) ? $session['resend_first_time'] : $now;
                //1小时后才重发
                if (time() - $resend_first_time < 3600) {
                    echo t('激活链接已经发至你的邮箱!请查收....');      
                } else {
                    $session['resend_first_time'] = $resend_first_time - 3600;
                    if ($now - $resend_time > 24*3600) {
                        $resend_time = $now;
                        $resend_count = 0;
                    }
                    if (($resend_count <= $this->max_resend) && (time() - $resend_time > $this->max_timeout)) {   //重发邮件
                        $this->sendReg($user->email, $user->checksum, $user->id);
                        $resend_count++;
                        $session['resend'] = $resend_count;
                        $session['resend_time'] = time();
                        
                        echo t('激活邮件已经重发,请查收!');
                    } else {
                        echo t('每天限定重发3次,每次间隔15分钟!');
                    }
                }
            }
        } else {
            echo t('激活邮件重发失败!');
        }

    }

	/**
	 * 申请clicki帐号
	 */
	public function actionApply_Account() {
        $model = new LoginForm('apply');
        
        if (isset($_POST['ajax']) && $_POST['ajax'] === 'leftForm') {
            echo CActiveForm::validate($model);
            app()->end();
        }
        
        if (isset($_POST['LoginForm'])) {
            $model->attributes = $_POST['LoginForm'];
            if ($model->validate()) {
				//表单验证通过, 1.检查是否已经注册的用户? 2.检查是否已经提交申请的
				if ($model->registed()) {
					$apply_msg = "该邮箱已经注册,请登录!";
				} elseif ($model->waiting() == 0) {
					$apply_msg = "请耐心等待审核,注意查收邮件! <a href='/main'>进入演示</a>";
				} elseif ($model->waiting() > 0) {
					$apply_msg = "请耐心等待审核,注意查收邮件! <a href='/main'>进入演示</a>";
				} elseif ($model->apply()) {
					$apply_msg = "申请提交成功。我们将会在三个工作日内将审核结果发送到" .$model->email. "。请注意查收!";
				} else {
					$apply_msg = "未知错误,请联系客服.";
				}
				user()->setFlash("apply_msg", $apply_msg);
			}
        }
        
		$this->setPageTitle("申请账号");
        $this->render('apply', array('model' => $model));
	}
    
    public function actionReg($checksum = null) {
		$apply_user = Apply_account::model()->findByAttributes(array('checksum' => $checksum, 'status' => 1));
		$model = new LoginForm('reg');
		if ($apply_user) {
			$model->email = $apply_user->email;
			$model->checksum = $apply_user->checksum;
			user()->setFlash("apply_user", true);
		}

		if (isset($_POST['ajax']) && $_POST['ajax'] === 'leftForm') {
			echo CActiveForm::validate($model);
			app()->end();
		}

		if (isset($_POST['LoginForm'])) {
			$model->attributes = $_POST['LoginForm'];

			if ((($apply_user && $apply_user->email == $model->email) || (!$apply_user && $invitation = $model->checkInviteCode()))) {
				if ($model->validate() && ($user = $model->createUser()) && ($user = $model->login())) {
					if ($apply_user) {
						//注册成功,更新申请状态,申请的用户
						$apply_user->status = 2;
						$apply_user->update();
					} else {
						//邀请的用户
						$invitation->use_userid = $user->id;
						$invitation->use_time = date('Y-m-d H:i:s', time());
						$invitation->status = 1;
						$invitation->update();
						//邀请码拥有者加积分
						$own_user = Users::model()->findByPk($invitation->owner);
						$own_user->point = $own_user->point + $invitation->point;
						$own_user->update();
					}
					$session = app()->session;
					if (!$session->autoStart) {
						$session->open();
					}
					if (VERSION_TYPE === VERSION_TYPE_FREE) {
						//注册论坛
						$username = @explode('@', $user->email);
						$this->forums($user->id, $username[0], $user->email, $model->password);
					}
					$session['email'] = $user->email;
					$session['id'] = $user->id;
					$session['status'] = $user->status;

					//注册完成,注册邮件写入邮件队列
					$date = date('Y-m-d H:i:s', time());
					$body = "<p>亲爱的%mail%, 您好：
						<p>欢迎您注册Clicki，请牢记您在本站的用户名、密码以及注册邮箱。
						<p>用户名：%mail%
						<p>
						<p>如果您有什么疑问或建议，欢迎给我们提供，客服QQ：1913292563 ,感谢您对Clicki的支持!
						<p>==========================================================
						<p>
						<p>Clicki - 专业的用户行为统计系统：<a href='http://www.clicki.cn'>http://www.clicki.cn</a>
						<p>{$date}
					<p>
					<p style='color:gray'>此邮件为系统自动发出的邮件，请勿回复。";
					//MailQueue::model()->add_queue($user->id, $user->email, "欢迎使用Clicki - 专业的用户行为统计系统", $body);

					$this->redirect('/manage/', false);
					app()->end();
				}
			} elseif ($apply_user  && $apply_user->email != $model->email) {
				$model->addError("checksum", "邀请码和申请的邮箱不一致!");
			}
		}

		$this->render('reg', array('model' => $model));
	}


	/*
	 * 忘记密码
	 */
	public function actionForgot() {
        $model = new LoginForm();
        if (isset($_POST['ajax']) && $_POST['ajax'] === 'leftForm') {
            echo CActiveForm::validate($model);
            app()->end();
        }
        
        if (isset($_POST['LoginForm'])) {
            $model->attributes = $_POST['LoginForm'];
  
            if ($model->validate()) {
				$user = Users::model()->findByAttributes(array('email' => $model->email));
				if ($user) {
					//先更新checksum
					$user->checksum = Users::generate_checksum($user->email, time()); 
					$user->last_time = date('Y-m-d H:i:s', time());
					if ($user->update()) {
						$is_send = $this->sendForgot($user->email, $user->checksum, $user->id);
						if ($is_send) {
							user()->setFlash('message', '邮件已经发送,请登录邮箱进行下一步.');
						} else {
							user()->setFlash('message', '邮件发送失败.');
						}
					}
				} else {
					user()->setFlash('message', '账号不存在.');
				}
            }
        }
		$this->setPageTitle(t('忘记密码'));
		$this->render('forgot', array('model' => $model));
	}
    
    /**
     * 退出
     *
     */
    public function actionLogout() {
        app()->session->clear();
        user()->logout();
		if (VERSION_TYPE === VERSION_TYPE_FREE)
			$this->redirect(param('bbLogoutUrl'));
		else
			$this->redirect(app()->homeUrl);
    }
    
    public function actionRegSuccess() {
        $this->render('regsuccess');
    }
    
    
    /**
     * 验证账号,激活账号..
     *
     */
    public function actionCheckacc() {
//      $active = array('noexists', 'exists', 'active', 'remail');
        
        $active = '';
        if (isset($_GET['checksum'])) {
            $user = Users::model()->findByAttributes(array('checksum' => strtolower($_GET['checksum'])));
            if ($user === null) {
                //checksum不存在,账号不存在.
                $active = 'noexists';
            } elseif ($user->status) {
                //已激活
                $active = 'exists';
            } elseif (!$user->status) {
            //    if ( Users::is_checksum_effective($user->create_time) )
           //     {
                    //未激活且有效,变更status
                    $active = 'active';
                    $user->status = 1;
           //     }
            /***********************
               else 
                {
                   //未激活且无效,则重新生成checksum,重发邮件
                    $user->checksum = Users::generate_checksum($user->email, $user->last_time);
                    $user->last_time = date('Y-m-d H:i:s', time());
                    $this->sendReg($user->email, $user->checksum, $user->id);           
                    $active = 'remail';      
            
                }
           *******************/

                //存入数据库
                $user->update(null);
            }
        }
        $this->render('checkacc', array('active' => $active));
    }


	public function actionSetPassword($id = 0, $checksum = NULL, $passwd = NULL){
		if (!$id) $id = isset(user()->id) ? user()->id : 0;
		$user = Users::model()->findByPk($id);
		$model = new LoginForm('reg');
		$flag = false;
		$reset = false;
		if ($user && $user->checksum == $checksum && !$passwd) {
			$flag = true;
			$reset = true;
			$this->setPageTitle(t('重置密码'));
		} elseif (user()->id) {
			if (VERSION_TYPE === VERSION_TYPE_FREE && isset(user()->demo) && !user()->demo && user()->id == $id) {
				$flag = true;
				$this->setPageTitle(t('修改密码'));
			} elseif (VERSION_TYPE === VERSION_TYPE_PRO && user()->id == $id) {
				$flag = true;
				$this->setPageTitle(t('修改密码'));
			} else {
				user()->setFlash('message', '非法请求!');
				$user = new Users();
				$user->email = "unknown";
			}
		} else {
			user()->setFlash('message', '链接已经失效!<a href="' .url('user/forgot'). '">重发</a>');
			$user = new Users();
			$user->email = "unknow@miaozhen.com";
		}
		if ($flag) {
			if ($passwd || isset($_POST['LoginForm'])) {
				if (!$reset && $passwd)
					$_POST['LoginForm'] = array('password' => $passwd);
				$model->attributes = $_POST['LoginForm'];
				if ($user->checksum != $checksum) {
					$result = array(
						'success' => false,
						'message' => '非法请求',
					);
				} elseif ($model->validate()) {
					$user->password = $user->hashPassword($model->password);
					//再更新checksum
					$user->checksum = Users::generate_checksum($user->email, time()); 
					$user->last_time = date('Y-m-d H:i:s', time());

					if (VERSION_TYPE === VERSION_TYPE_FREE) {
						//修改论坛密码
						global $wp_hasher;

						$dbbb = app()->dbbb;
						if ( empty($wp_hasher) ) {
							require_once( YII_PATH . '/../../public/forums/bb-includes/backpress/class.passwordhash.php');
							// By default, use the portable hash from phpass
							$wp_hasher = new PasswordHash(8, TRUE);
						}
						//加密password
						$hp = $wp_hasher->HashPassword($model->password);
						$command = $dbbb->createCommand();
						$command->update('bb_users', array('user_pass' => $hp), "user_login='" . $user->email . "'");
					}

					if ($user->update()) {
						app()->session->clear();
						user()->logout();
						$result = array(
							'success' => true,
							'message' => '密码重置成功!<a href="' .url('user/login'). '">重新登录</a>',
						);
					} else {
						if (user()->id) {
							$result = array(
								'success' => false,
								'message' => '密码重置失败!',
							);
						} else {
							$result = array(
								'success' => false,
								'message' => '密码重置失败!<a href="' .url('user/forgot'). '">重发</a>',
							);
						}
					}
				} elseif (!$reset) {
					$errors = $model->getErrors('password');
					$result = array(
						'success' => false,
						'message' => $errors[0],
					);
				}
				if (!$reset)
					json_encode_end($result);
				else
					user()->setFlash("message", $result["message"]);
			}
		}
		if ($reset)
			$this->render('resetpassword', array('user' => $user, 'model' => $model));
		else {
			$this->layout = 'x';
			$this->render('setpassword', array('user' => $user, 'model' => $model));
		}
	}
    
    /**
     * 发送email
     *
     * @param string $email
     * @param string $checksum
     */
    private function sendReg($email, $checksum, $id) {
        $link = aurl('user/checkacc', array(
            'id'    =>  $id,
            'checksum'  =>  $checksum
        ));
        $headers = 'From: '.param('adminEmail')."\r\nReply-To".param('adminEmail');
        $subject = t('欢迎注册'.param('sitename').' - 激活信息');
        $message = "亲爱的用户{$email},请点击下面的链接完成激活<br /><br /><a href=\"{$link}\">{$link}</a>";
        $message .= '<br /><br />如果页面无法跳转,请将上面的地址复制到你的浏览器(如IE)的地址栏继续';
		return $this->send($email, $subject, $message);
    }

    private function sendForgot($email, $checksum, $id) {
        $link = aurl('user/setpassword', array(
            'id'    =>  $id,
            'checksum'  =>  $checksum
        ));
        $headers = 'From: '.param('adminEmail')."\r\nReply-To".param('adminEmail');
        $subject = t('找回密码 - 忘记密码');
        $message = "亲爱的用户{$email},请点击下面的链接完成找回密码<br /><br /><a href=\"{$link}\">{$link}</a>";
        $message .= '<br /><br />如果页面无法跳转,请将上面的地址复制到你的浏览器(如IE)的地址栏继续';
		return $this->send($email, $subject, $message);
    }

	private function send($email, $subject, $content){
        $mailer = Yii::createComponent('ext.mailer.EMailer');
        $mailer->Host = param('stmpHost');
        $mailer->IsSMTP();
        $mailer->From = param('adminEmail');
        $mailer->AddReplyTo(param('adminEmail'));
        $mailer->AddAddress($email);
        $mailer->FromName = param('cookieDomain');
        $mailer->CharSet = 'utf-8';
        $mailer->ContentType = 'text/html';
        $mailer->Subject = $subject;
        $mailer->Body = $content;
        return $mailer->Send();
	}
}
