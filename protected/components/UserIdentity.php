<?php

/**
 * UserIdentity represents the data needed to identity a user.
 * It contains the authentication method that checks if the provided
 * data can identity the user.
 */
class UserIdentity extends CUserIdentity
{
        
	/**
	 * Authenticates a user.
	 * The example implementation makes sure if the username and password
	 * are both 'demo'.
	 * In practical applications, this should be changed to authenticate
	 * against some persistent user identity storage (e.g. database).
	 * @return boolean whether authentication succeeds.
	 */
	
	public function authenticate()
	{
	    if ( $this->isAuthenticated )
	    {
	        return true;
	    }
	    
	    // $criteria = new CDbCriteria;
	    // $criteria->addColumnCondition(array('email'=>strtolower($this->username)));
	    // $user = Users::model()->find($criteria);
	    $user = Users::model()->findByAttributes(array('user_name'=>strtolower($this->username)));	    
	    
		if ( $user === null )
		{
		    $this->errorCode = self::ERROR_USERNAME_INVALID;
		}
		else if ( ! $user->validatePassword($this->password) )
		{
		    $this->errorCode = self::ERROR_PASSWORD_INVALID;
		}
		else if ($user->status == 1)
		{
		    $this->errorCode = self::ERROR_NONE;		    		    
		    $this->set_user_states($user);
		}
		else 
		{
		    $this->errorCode = self::ERROR_UNKNOWN_IDENTITY;
		}
		return $this->errorCode == self::ERROR_NONE;
	}
	
	public function set_user_states($user)
	{
		$this->setState('user_name', $user->user_name);
	    $this->setState('email', $user->email);
	    $this->setState('id', $user->id);
	    $this->setState('status', $user->status);
	    $this->setState('create_time', $user->create_time);
	    $this->setState('level', $user->level);	   
	    $this->setState('top_uid', $user->top_uid);	    
        $this->setState('site_id', Users::getUserDefaultSiteId($user->id));
	}	
	
}
