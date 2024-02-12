<?php
require_once(ABSPATH.'wp-admin/includes/user.php');
add_action( 'rest_api_init', function () {

register_rest_route( 'csskiller/v1', '/login/', array(
        'methods' => 'POST',
        'callback' => 'get_rest_login',
        //'permission_callback' => function () {
        //  return current_user_can( 'administrator' );
        //}
    ) );
register_rest_route( 'csskiller/v1', '/linkedin-login/', array(
        'methods' => 'POST',
        'callback' => 'get_rest_linkedin_login',
        //'permission_callback' => function () {
        //  return current_user_can( 'administrator' );
        //}
    ) );
register_rest_route( 'csskiller/v1', '/linkedin-register/', array(
        'methods' => 'POST',
        'callback' => 'get_rest_linkedin_register',
        //'permission_callback' => function () {
        //  return current_user_can( 'administrator' );
        //}
    ) );
register_rest_route( 'csskiller/v1', '/linkedin-connect/', array(
        'methods' => 'POST',
        'callback' => 'get_rest_linkedin_connect',
        //'permission_callback' => function () {
        //  return current_user_can( 'administrator' );
        //}
    ) );
register_rest_route( 'csskiller/v1', '/linkedin-disconnect/', array(
        'methods' => 'POST',
        'callback' => 'get_rest_linkedin_disconnect',
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
	
	register_rest_route( 'csskiller/v1', '/klaviyo/', array(
        'methods' => 'GET',
        'callback' => 'get_klaviyo',
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
	
	register_rest_route( 'csskiller/v1', '/add-interest/', array(
        'methods' => 'POST',
        'callback' => 'set_interest',
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

	register_rest_route( 'csskiller/v1', '/delete-account/', array(
        'methods' => 'POST',
        'callback' => 'set_delete_account',
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
	$user = wp_get_current_user();
	$linkedin_id = get_user_meta($user->ID, 'linkedin_id', true);
	$linkedin_id = !empty($linkedin_id) ? $linkedin_id : '';

	$topics = get_field('field_6282282955654', 'user_'.$user->ID);
	$topics_arr = explode(",", $topics);
	$tags_arr = [];

	foreach($topics_arr as $topic){
		global $wpdb;

		$sql = "SELECT p.post_name
		  	FROM $wpdb->posts p LEFT JOIN $wpdb->postmeta pm
		  	ON ( p.ID = pm.post_id AND pm.meta_key = 'topics_a' )
        	WHERE pm.meta_value LIKE '%$topic%' and p.post_type = 'tag'";
	
		$arr = $wpdb->get_col($sql);

		$tags_arr = array_unique(array_merge($tags_arr, $arr), SORT_REGULAR);
	}
	
	// update topics
	$tags = !empty($tags_arr) ? $tags_arr : [];

    $return = array('user' => $user,
					'nonce'=> $nonce,
					'linkedin_id'=> $linkedin_id,
					'tags'=> $tags,
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
		$linkedin_id = get_user_meta($user->ID, 'linkedin_id', true);
		$linkedin_id = !empty($linkedin_id) ? $linkedin_id : '';

		$acf=get_fields('user_'.$user->ID);
            return array('user' => $user,
				'acf' => $acf,
                'nonce' => $nonce,
				'linkedin_id'=> $linkedin_id
			);
	}

}

function get_rest_linkedin_login($request){
	$api_url = "https://api.linkedin.com";

	//get access token
    $request_args = array(
        'method'      => 'POST',
        'timeout'     => 20,
        'headers'     => [
			'Content-Type' => 'application/x-www-form-urlencoded',
        ],
		'body' => $_POST
    );

    $request = wp_remote_post("${api_url}/oauth/v2/accessToken", $request_args );
	$status_code = $request['response']['code'];
	$access_token = json_decode(wp_remote_retrieve_body( $request ), true);
	$access_token = isset($access_token['access_token']) ? $access_token['access_token'] : '';

	//is auth code valid?
	if($status_code !== 200 || empty($access_token)){
		return new WP_REST_Response("invalid_auth", 401);
	}

	//get profile
    $request_args = array(
        'method'      => 'GET',
        'timeout'     => 20,
        'headers'     => [
			'Authorization' => "Bearer $access_token",
        ],
    );

    $request = wp_remote_get("${api_url}/v2/me", $request_args );
    $response = is_wp_error( $request ) ? [] : json_decode(wp_remote_retrieve_body( $request ), true);

	//profile data retrieved now handle errors

	//check if user with linkedin id exists and has linkedin connected
	$linkedin_id = $response['id'];

	global $wpdb;
    $db_prefix = $wpdb->prefix;

	//check linkedin_id and get user_id
	$user_id = $wpdb->get_var($wpdb->prepare("SELECT user_id FROM $wpdb->usermeta where meta_key = 'linkedin_id' and meta_value = '%s'", $linkedin_id));
    $user_id = !empty($user_id) ? $user_id : 0;

	if(empty($user_id)){
		return new WP_REST_Response("account_doesnt_exist", 401);
	}

	//get email
	$email = $wpdb->get_var($wpdb->prepare("SELECT user_email FROM $wpdb->users where ID = '%d'", $user_id));
    $email = !empty($email) ? sanitize_email($email) : "";

	if(empty($email)){
		return new WP_REST_Response("account_doesnt_exist", 401);
	}

	//log in without password return auth'd user
	$user = get_user_by('email', $email );
	
	if(is_wp_error($user)){
		return new WP_REST_Response($user, 401);
	}

	$nonce = wp_create_nonce("wp_rest");
	wp_clear_auth_cookie();
	wp_set_current_user($user->ID);
	wp_set_auth_cookie($user->ID);
	$acf=get_fields('user_'.$user->ID);

	return new WP_REST_Response(['user' => $user, 'acf' => $acf,'nonce' => $nonce,'linkedin_id'=> $linkedin_id], 200);
}

function get_rest_linkedin_register($request){
	$api_url = "https://api.linkedin.com";

	//get access token
    $request_args = array(
        'method'      => 'POST',
        'timeout'     => 20,
        'headers'     => [
			'Content-Type' => 'application/x-www-form-urlencoded',
        ],
		'body' => $_POST
    );

    $request = wp_remote_post("${api_url}/oauth/v2/accessToken", $request_args );
	$status_code = $request['response']['code'];
	$access_token = json_decode(wp_remote_retrieve_body( $request ), true);
	$access_token = isset($access_token['access_token']) ? $access_token['access_token'] : '';

	//is auth code valid?
	if($status_code !== 200 || empty($access_token)){
		return new WP_REST_Response("invalid_auth", 401);
	}

	//get email (only for sign up not needed for login)
    $request_args = array(
        'method'      => 'GET',
        'timeout'     => 20,
        'headers'     => [
			'Authorization' => "Bearer $access_token",
        ],
    );

    $request = wp_remote_get("${api_url}/v2/emailAddress?q=members&projection=(elements*(handle~))", $request_args );
    $emailAddress = is_wp_error( $request ) ? [] : json_decode(wp_remote_retrieve_body( $request ), true)['elements'][0]['handle~']['emailAddress'];

	//get profile
    $request_args = array(
        'method'      => 'GET',
        'timeout'     => 20,
        'headers'     => [
			'Authorization' => "Bearer $access_token",
        ],
    );

    $request = wp_remote_get("${api_url}/v2/me", $request_args );
    $response = is_wp_error( $request ) ? [] : json_decode(wp_remote_retrieve_body( $request ), true);

	// add email to response
	$response['emailAddress'] = $emailAddress;

	//profile data retrieved now handle errors

	//check if user with linkedin id exists
	$linkedin_id = $response['id'];

	global $wpdb;
    $db_prefix = $wpdb->prefix;

	//check linkedin_id and get user_id
	$user_id = $wpdb->get_var($wpdb->prepare("SELECT user_id FROM $wpdb->usermeta where meta_key = 'linkedin_id' and meta_value = '%s'", $linkedin_id));
    $user_id = !empty($user_id) ? $user_id : 0;

	if(!empty($user_id)){
		return new WP_REST_Response("account_already_exists", 401);
	}

	//get email
	$email = $wpdb->get_var($wpdb->prepare("SELECT user_email FROM $wpdb->users where ID = '%d'", $user_id));
    $email = !empty($email) ? sanitize_email($email) : "";

	if(!empty($email)){
		return new WP_REST_Response("email_already_exists", 401);
	}

	$email = $response['emailAddress'];
	$first = $response['localizedFirstName'];
	$last = $response['localizedLastName'];

	//sign up user with linkedin info return auth'd user	
	if(email_exists($request['email'])){
		return new WP_REST_Response("email_already_exists", 401);
	}

	$pass = wp_generate_password();
	$userdata = [
		'user_login'    =>   $email,
		'user_email'    =>   $email,
		'user_pass'     => 	 $pass,
		'first_name'    =>   $first,
		'last_name'     =>   $last,
	];

	$user = wp_insert_user( $userdata );

	if ( is_wp_error($user) ){
		return new WP_REST_Response("error_signing_up", 401);
	}

	$us = get_user_by('email',$email)->user_login;
	
	prepare_email($email, $pass);
	$nonce = wp_create_nonce("wp_rest");
	
	$creds['user_login'] = $us;
	$creds['user_password'] =  $pass;
	$creds['remember'] = true;
	$user = wp_signon($creds, true);

	if (is_wp_error($user)){
		return new WP_REST_Response("error_signing_up", 401);
	}

	update_field('field_627f6ec02ba4f', '', 'user_'.$user->ID);
	update_field('field_62841ef93fc75', $first, 'user_'.$user->ID);
	update_field('field_62841f053fc76', $last, 'user_'.$user->ID);
	update_field('field_6282280b55653', false, 'user_'.$user->ID);
	update_user_meta($user->ID, 'linkedin_id', $linkedin_id);
	$acf=get_fields('user_'.$user->ID);

	subscribe_all_lists($email);

	return new WP_REST_Response(['user' => $user, 'acf' => $acf, 'nonce' => $nonce, 'linkedin_id'=> $linkedin_id], 200);
}


function get_rest_linkedin_connect($request){
	$api_url = "https://api.linkedin.com";

	//get access token
    $request_args = array(
        'method'      => 'POST',
        'timeout'     => 20,
        'headers'     => [
			'Content-Type' => 'application/x-www-form-urlencoded',
        ],
		'body' => $_POST
    );

    $request = wp_remote_post("${api_url}/oauth/v2/accessToken", $request_args );
	$status_code = $request['response']['code'];
	$access_token = json_decode(wp_remote_retrieve_body( $request ), true);
	$access_token = isset($access_token['access_token']) ? $access_token['access_token'] : '';

	//is auth code valid?
	if($status_code !== 200 || empty($access_token)){
		return new WP_REST_Response("invalid_auth", 401);
	}

	//get profile
    $request_args = array(
        'method'      => 'GET',
        'timeout'     => 20,
        'headers'     => [
			'Authorization' => "Bearer $access_token",
        ],
    );

    $request = wp_remote_get("${api_url}/v2/me", $request_args );
    $response = is_wp_error( $request ) ? [] : json_decode(wp_remote_retrieve_body( $request ), true);

	//profile data retrieved now handle errors

	if(!isset($response['id'])){
		return new WP_REST_Response("linkedin_api_error", 401);
	}

	//start checking if user with linkedin id exists and has linkedin connected
	$linkedin_id = $response['id'];

	global $wpdb;
    $db_prefix = $wpdb->prefix;

	//check if linkedin_id is connected
	$user_id = $wpdb->get_var($wpdb->prepare("SELECT user_id FROM $wpdb->usermeta where meta_key = 'linkedin_id' and meta_value = '%s'", $linkedin_id));
    $user_id = !empty($user_id) ? $user_id : 0;

	//linkedin already connected to a user
	if(!empty($user_id)){
		return new WP_REST_Response("linkedin_connected_to_user", 401);
	}

	//check if user already has linkedin_id
    $email = isset($_POST['email']) ? sanitize_email($_POST['email']) : "";

	if(empty($email)){
		return new WP_REST_Response("email_not_provided", 401);
	}

	$user_id = $wpdb->get_var($wpdb->prepare("SELECT ID FROM $wpdb->users where user_email = '%s'", $email));

	if(empty($user_id)){
		//error
		return new WP_REST_Response("account_not_found", 401);
	}

	//is there an existing id connected to this account?
	$id_linked = $wpdb->get_var($wpdb->prepare("SELECT meta_value FROM $wpdb->usermeta where meta_key = 'linkedin_id' and user_id = '%d'", $meta_value));

	if(!empty($id_linked)){
		return new WP_REST_Response("linkedin_exists_for_this_user", 401);
	}

	//set user meta for user
	update_user_meta($user_id, 'linkedin_id', $linkedin_id);
	
	return new WP_REST_Response(json_encode($response), 200);
}

function get_rest_linkedin_disconnect($request){
	//check if user already has linkedin_id
	$email = isset($_POST['email']) ? sanitize_email($_POST['email']) : "";
	$success = false;

	if(empty($email)){
		return new WP_REST_Response("email_not_provided", 401);
	}	

	if($userid > 0){
		$user_login = get_user_by('email', $email)->user_login;
		$creds = [];
		$creds['user_login'] =  $user_login;
		$creds['user_password'] = urldecode($_POST["pass"]);
		$user = wp_signon($creds, true);

		//authentication success
		if (is_wp_error($user)){
			return new WP_REST_Response("incorrect_password", 401);
		}
	}

	global $wpdb;
    $db_prefix = $wpdb->prefix;

	//check if linkedin_id is connected
	$user_id = $wpdb->get_var($wpdb->prepare("SELECT ID FROM $wpdb->users where user_email = '%s'", $email));

	if(empty($user_id)){
		return new WP_REST_Response("account_not_found", 401);
	}

	$linkedin_id = $wpdb->get_var($wpdb->prepare("SELECT meta_value FROM $wpdb->usermeta where meta_key = 'linkedin_id' and user_id = '%d'", $user_id));
    $linkedin_id = !empty($linkedin_id) ? $linkedin_id : '';

	//linkedin not connected to a user
	if(empty($linkedin_id)){
		//error
		return new WP_REST_Response("linkedin_not_connected_to_user", 401);
	}

	//remove user meta for user
	$success = delete_user_meta($user_id, 'linkedin_id');

	return new WP_REST_Response($success, 200);
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

// helper
// subscribe an email to all lists
function subscribe_all_lists($email) {
	// get all lists
	$args= [
		'post_type' => 'list',
		'posts_per_page' => -1,
		'post_status' => 'publish',
	];
  
	$wp_query= new WP_query($args);
  
	$lists = [];
  
	if ($wp_query->have_posts()):
		while ($wp_query->have_posts()):
			$wp_query->the_post();
  
			$list = get_field('mailchimp_id');
  
			array_push($lists,$list);
		endwhile;
	endif;
	
	$_GET['email'] = $email;

	foreach ($lists as $list) {
		$_GET['list'] = $list;

		try{
			// sub to each list
			get_mailchimp()->data['body'];
		}
		catch(Exception $e){}
	}

	return new WP_REST_Response(true, 200);
}

function get_klaviyo() {
    // Block spam bots
    
 
    // Configure --------------------------------------
 
    $api_key = '03fb47ab9900e747c89f1491bb2c126d-us13';
    $list_id = $_GET['list'];
 	$email = $_GET['email'];
 	$name = $_GET['name'];
 	$code = $_GET['code'];
    // STOP Configuring -------------------------------
 
    $msg = 'error';
    $api_endpoint = 'https://<dc>.api.mailchimp.com/3.0/';
    list(, $datacenter) = explode( '-', $api_key );
    $api_endpoint = str_replace( '<dc>', $datacenter, $api_endpoint );
    $url = 'https://a.klaviyo.com/api/v2/list/VtLrXi/subscribe?api_key=pk_faca289aec201da661ccde451b467f6018';

    $request_args = array(
        'method'      => 'POST',
        'timeout'     => 20,
        'headers'     => array(
		'Accept' => 'application/json',
		'Content-Type' => 'application/json',
        ),
        'body'        => '{"profiles":[{"email":"'.$email.'","First Name":"'.$name.'","Promotion Code": "'.$code.'"}]}',
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

				update_user_meta($user->ID, 'linkedin_id', '');
				subscribe_all_lists($request['email']);

				return array('acf'=> $acf,'user' => $user, 'nonce' => $nonce, 'linkedin_id'=> '');
			}
		}
	}
	
}

function set_interest($request){
	$userid = $_POST['userid'];
	$tag = $_POST['tag'];
	$remove = isset($_POST['remove']) ? true : false;
	
	$user = get_user_by('ID', $userid);

	if(!$user){
		return new WP_REST_Response('unauthorized', 401);
	}

	$tagid = strval(get_page_by_path($tag, OBJECT, 'tag')->ID);
	$topics = get_field('field_6282282955654', 'user_'.$userid);
	$topics_arr = explode(",", $topics);
	$tag_as_topics = get_field('field_623b2eacd4e26', $tagid);

	foreach($tag_as_topics as $tag){
		$tag = strval($tag);
		
		if(!$remove){
			// add topics as interests
			if(!in_array($tag, $topics_arr)){
				array_push($topics_arr, $tag);
			}
		}
		else{
			// remove topics as interests
			if(in_array($tag, $topics_arr)){
				$key = array_search($tag, $topics_arr);

				if ($key !== false) {
					unset($topics_arr[$key]);
				}
			}
		}
	}
	
	// update topics
	$topics = implode(',', $topics_arr);
	update_field('field_6282282955654', $topics, 'user_'.$userid);

	$acf=get_fields('user_'.$userid);
    $return = array('acf' => $acf);
	return new WP_REST_Response($return, 200);
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

function set_delete_account($request){
	$userid = isset($request['userid']) ? $request['userid'] : 0;
	$success = false;

	if($userid > 0){
		$user_login = get_user_by('ID', $userid)->user_login;
		$creds['user_login'] =  $user_login;
		$creds['user_password'] =  urldecode($request["pass"]);
		$user = wp_signon( $creds, true );

		//authentication success
		if (!is_wp_error($user)){
			$success = wp_delete_user($userid);
		}
	}

	return new WP_REST_Response($success, 200);
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