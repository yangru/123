<?php

/**
 * 显示登录用户信息
 *
 */
class UserToolbar extends CWidget
{
    public function run()
    {	   
 /*       if ( ( NULL !== user()->getState('email') ) AND ( '0' === user()->getState('status') )  ) 
	    {
	        Yii::app()->getRequest()->redirect(aurl('/user/regsuccess'));
	    }
*/  
        $this->render('usertoolbar', $this->get_user_toolbar());
    }

    public function get_user_toolbar()
	{
	     if (user()->isGuest || user()->getState('demo')) {
	        $data = array(
	           'guest' => true,
	        );
	    } else {
	        $data = array(
	           'user_name' => user()->getState('user_name'),
	           'email' => user()->getState('email'),
	           'create_time' => user()->getState('create_time'),
	           'guest' => false,
	        );
	    }
	    
	    return $data;
	}
}
