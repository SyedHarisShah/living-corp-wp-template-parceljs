<?php
add_action( 'rest_api_init', function () {

register_rest_route( 'csskiller/v1', '/login/', array(
        'methods' => 'POST',
        'callback' => 'get_rest_login',
        //'permission_callback' => function () {
        //  return current_user_can( 'administrator' );
        //}
    ) );
		   
register_rest_route( 'csskiller/v1', '/getuser/', array(
        'methods' => 'POST',
        'callback' => 'get_rest_user',
        //'permission_callback' => function () {
        //  return current_user_can( 'administrator' );
        //}
    ) );
register_rest_route( 'csskiller/v1', '/mailchimp/', array(
        'methods' => 'GET',
        'callback' => 'get_mailchimp',
        //'permission_callback' => function () {
        //  return current_user_can( 'administrator' );
        //}
    ) );
	register_rest_route( 'csskiller/v1', '/forgetpassword/', array(
        'methods' => 'GET',
        'callback' => 'get_forgetpassword',
        //'permission_callback' => function () {
        //  return current_user_can( 'administrator' );
        //}
    ) );
	register_rest_route( 'csskiller/v1', '/register/', array(
        'methods' => 'POST',
        'callback' => 'get_register',
        //'permission_callback' => function () {
        //  return current_user_can( 'administrator' );
        //}
    ) );
	
	register_rest_route( 'csskiller/v1', '/editinfo/', array(
        'methods' => 'POST',
        'callback' => 'set_edit',
        //'permission_callback' => function () {
        //  return current_user_can( 'administrator' );
        //}
    ) );
	register_rest_route( 'csskiller/v1', '/setpass/', array(
        'methods' => 'POST',
        'callback' => 'set_pass',
        //'permission_callback' => function () {
        //  return current_user_can( 'administrator' );
        //}
    ) );
	register_rest_route( 'csskiller/v1', '/preferences/', array(
        'methods' => 'POST',
        'callback' => 'set_preferences',
        //'permission_callback' => function () {
        //  return current_user_can( 'administrator' );
        //}
    ) );
	
	register_rest_route( 'csskiller/v1', '/logout/', array(
        'methods' => 'GET',
        'callback' => 'set_logout',
        //'permission_callback' => function () {
        //  return current_user_can( 'administrator' );
        //}
    ) );
	register_rest_route( 'csskiller/v1', '/recoverpass/', array(
        'methods' => 'GET',
        'callback' => 'do_password_reset',
        //'permission_callback' => function () {
        //  return current_user_can( 'administrator' );
        //}
    ) );
	register_rest_route( 'csskiller/v1', '/sentjob/', array(
        'methods' => 'POST',
        'callback' => 'set_sentjob',
        //'permission_callback' => function () {
        //  return current_user_can( 'administrator' );
        //}
    ) );
	register_rest_route( 'csskiller/v1', '/sendform/', array(
        'methods' => 'POST',
        'callback' => 'set_sendcontact',
        //'permission_callback' => function () {
        //  return current_user_can( 'administrator' );
        //}
    ) );
} );
function get_rest_user($request){
	$acf=get_fields('user_'.get_current_user_id());
		$nonce = wp_create_nonce("wp_rest");
	$us = wp_get_current_user();
    $return = array('user' => $us,
					'nonce'=> $nonce,
				'acf' => $acf);
		return new WP_REST_Response($return, 200);
}
function get_forgetpassword($request){
	$email=$request['email'];
	if(!email_exists($email)){
		return new WP_REST_Response('300', 300);
		
	}
	else{
		retrieve_password($email);
		return new WP_REST_Response('200', 200);
	}
}
function get_rest_login($request){
             $creds = array();
	
	$nonce = wp_create_nonce("wp_rest");
	if(!is_email($request['username'])){
		$us=$request['username'];
	}
	else{
		$us=get_user_by('email',$request['username'])->user_login;
	}
    $creds['user_login'] = $us;
    $creds['user_password'] =  urldecode($request["password"]);
    $creds['remember'] = true;
	$user = wp_signon( $creds, true );
       if ( is_wp_error($user) ){
		   
            return $user;
	   }
	else{
		$acf=get_fields('user_'.$user->ID);
            return array('user' => $user,
				'acf' => $acf,
                'nonce' => $nonce);
	}

}

function get_mailchimp() {
    // Block spam bots
    
 
    // Configure --------------------------------------
 
    $api_key = '03fb47ab9900e747c89f1491bb2c126d-us13';
    $list_id = $_GET['list'];
 	$email = $_GET['email'];
    // STOP Configuring -------------------------------
 
    $msg = 'error';
    $api_endpoint = 'https://<dc>.api.mailchimp.com/3.0/';
    list(, $datacenter) = explode( '-', $api_key );
    $api_endpoint = str_replace( '<dc>', $datacenter, $api_endpoint );
    $url = $api_endpoint.'/lists/' . $list_id . '/members/';
    $body = array(
        'email_address' => sanitize_email( $email ),
        'status' => 'subscribed'
    );
    $request_args = array(
        'method'      => 'POST',
        'timeout'     => 20,
        'headers'     => array(
            'Content-Type' => 'application/json',
            'Authorization' => 'apikey ' . $api_key
        ),
        'body'        => json_encode( $body ),
    );
    $request = wp_remote_post( $url, $request_args );
    $subscribe = is_wp_error( $request ) ? false : json_decode( wp_remote_retrieve_body( $request ) );
    if ( $subscribe ) {
        if ( isset( $subscribe->title ) && 'Member Exists' == $subscribe->title ) {
            $msg = 'exists';
        } elseif ( 'subscribed' == $subscribe->status ) {
            $msg = 'success';
        }
		return new WP_REST_Response($request, 200);
    }else{
		return new WP_REST_Response($request, 200);
	}
}





add_action('login_form_rp', 'redirect_to_custom_password_reset');
add_action('login_form_resetpass', 'redirect_to_custom_password_reset');
function redirect_to_custom_password_reset() {
	if ('GET' == $_SERVER['REQUEST_METHOD']) {
		// Verify key / login combo
		$user = check_password_reset_key($_REQUEST['key'], $_REQUEST['login']);
		if (!$user || is_wp_error($user)) {
			if ($user && $user->get_error_code() === 'expired_key') {
				wp_redirect(home_url('login?login=expiredkey'));
			} else {
				wp_redirect(home_url('login?login=invalidkey'));
			}
			exit;
		}

		$redirect_url = home_url('login');
		$redirect_url = add_query_arg('login', esc_attr($_REQUEST['login']), $redirect_url);
		$redirect_url = add_query_arg('key', esc_attr($_REQUEST['key']), $redirect_url);

		wp_redirect($redirect_url);
		exit;
	}
}


function do_password_reset() {
		$rp_key = $_GET['key'];
		$rp_login = $_GET['login'];

		$user = check_password_reset_key($rp_key, $rp_login);

		if (!$user || is_wp_error($user)) {
			if ($user && $user->get_error_code() === 'expired_key') {
				wp_redirect(home_url('login?login=expiredkey'));
			} else {
				wp_redirect(home_url('login?login=invalidkey'));
			}
			exit;
		}

		if (isset($_GET['pass1'])) {
			if ($_GET['pass1'] != $_GET['pass2']) {
				// Passwords don't match
				//$redirect_url = home_url('member-password-reset');


				return new WP_REST_Response($_GET['pass1'], 300);
			}
			else{
			reset_password($user, $_GET['pass1']);
			
				$creds['user_login'] = $rp_login;
				$creds['user_password'] =  urldecode($_GET['pass1']);
				$creds['remember'] = true;
				$user = wp_signon( $creds, true );
				   if ( is_wp_error($user) ){

						return $user;
				   }
				else{
					$nonce = wp_create_nonce("wp_rest");
					$acf=get_fields('user_'.$user->ID);
						$return = array('user' => $user,
							'acf' => $acf,
							'nonce' => $nonce);
				}
				return new WP_REST_Response($return, 200);
			}

			
			
			// Parameter checks OK, reset password
			//wp_redirect(home_url('signin?password=changed'));//page slug where signin shortcode will be use
		} else {
			echo "Invalid request.";
		}

}
function get_register($request){
	if(email_exists($request['email'])){
		return 300;
	}
	else{
		$pass=wp_generate_password();
	  	$userdata = array(
			'user_login'    =>   $request['email'],
			'user_email'    =>   $request['email'],
			//'user_pass'     =>   $request['password'],
			'user_pass' => $pass,
			'first_name'    =>   $request['first_name'],
			'last_name'     =>   $request['last_name'],
			);
	  $user = wp_insert_user( $userdata );
		if ( is_wp_error($user) ){
			return new WP_REST_Response($user, 200);
		}
		else{
			
			$us=get_user_by('email',$request['email'])->user_login;
			
			prepare_email($request['email'],$pass);
			$nonce = wp_create_nonce("wp_rest");
			
			$creds['user_login'] = $us;
			$creds['user_password'] =  $pass;
			$creds['remember'] = true;
			$user = wp_signon( $creds, true );
			   if ( is_wp_error($user) ){

					return false;
			   }
			else{
        update_field('field_627f6ec02ba4f',$request['pronoun'],'user_'.$user->ID);
        update_field('field_62841ef93fc75',$request['first_name'],'user_'.$user->ID);
        update_field('field_62841f053fc76',$request['last_name'],'user_'.$user->ID);
        update_field('field_6282280b55653',false,'user_'.$user->ID);
        $acf=get_fields('user_'.$user->ID);

        return array('acf'=> $acf,'user' => $user,
          'nonce' => $nonce);
			}

		}
	}
	
}

function set_preferences($request){
	$user = $request['userid'];
	update_field('field_628227ee55650',$request['option_0'],'user_'.$user);
	update_field('field_628227f655651',$request['option_1'],'user_'.$user);
	update_field('field_628227fc55652',$request['option_2'],'user_'.$user);
	update_field('field_6282282955654',$request['topics'],'user_'.$user);
	update_field('field_6282280b55653',true,'user_'.$user);
	
	$userob=wp_get_current_user();
	$acf=get_fields('user_'.$user);
    $return = array('user' => $userob,
				'acf' => $acf);
	return new WP_REST_Response($return, 200);
}


function set_pass($request){
	if($request['pass1'] != $request['pass2']){
		return new WP_REST_Response('300', 300);
		
	}
	else{
		$resp = wp_update_user([
			'ID' => $request['userid'],
			'user_pass' => $request['pass1'],
			]);
		
		$us= get_user_by('id',$request['userid']);
		
	$acf=get_fields('user_'.$request['userid']);
		$nonce = wp_create_nonce("wp_rest");
		$return = array('user' => $us,
					'nonce'=> $nonce,
				'acf' => $acf);
		
	return new WP_REST_Response($return, 200);
	}
}
function set_edit($request){
	$user = $request['userid'];
	$userob=wp_get_current_user();
	if($userob->data->user_email!=$request['email'] && !email_exists($request['email'])){
		
		return new WP_REST_Response('300', 300);
	}
	else{
	update_field('field_62841ef93fc75',$request['first_name'],'user_'.$user);
	update_field('field_62841f053fc76',$request['last_name'],'user_'.$user);
	update_field('field_627f6ec02ba4f',$request['pronoun'],'user_'.$user);
	wp_update_user([
    'ID' => $request['userid'], // this is the ID of the user you want to update.
    'first_name' => $request['firstname'],
    'last_name' => $request['lastname'],
	'user_login' => $request['email'],
	'user_email' => $request['email'],
	]);
	$us= get_user_by('id',$request['userid']);
	$acf=get_fields('user_'.$request['userid']);
		$nonce = wp_create_nonce("wp_rest");
    $return = array('user' => $us,
					'nonce'=> $nonce,
				'acf' => $acf);
	return new WP_REST_Response($return, 200);
	}
}



function set_logout($request){
	wp_logout();
	return new WP_REST_Response(false, 200);
}


function set_sentjob($request){
	$field=get_field('jobs','user_'.$request['userid']);
	if($field!=''){
		
		update_field('field_62852fad5f410',$field.','.$request['jobid'],'user_'.$request['userid']);
	}
	else{
		
		update_field('field_62852fad5f410',$request['jobid'],'user_'.$request['userid']);
		
		
	}
	if($_FILES){
		$files = $_FILES;
	}
	else{
		$files = false;
	}
	$ar=apply_email($request,$files);
	return new WP_REST_Response($ar, 200);
}
function set_sendcontact($request){
	$ar=contact_email($request);
	return new WP_REST_Response($ar, 200);
	
}
?>