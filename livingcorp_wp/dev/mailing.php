<?php
//add_action( 'phpmailer_init', 'wpse9498170_phpmailer_init' );
function wpse9498170_phpmailer_init( PHPMailer $phpmailer ) {
    $phpmailer->Host = 'living-corporate.com';
    $phpmailer->Port = 25; // could be different
    $phpmailer->Username = 'info@living-corporate.com'; // if required
    $phpmailer->Password = 'Smtptest12$A'; // if required
    $phpmailer->SMTPAuth = true; // if required
    $phpmailer->SMTPSecure = 'ssl'; // enable if required, 'tls' is another possible value

    $phpmailer->IsSMTP();
}
function prepare_email($email,$pass){
	$sitename = get_bloginfo('name');
	$siteurl = get_site_url();
	$adminmail = 'info@living-corporate.com';
	
      $asunto = 'Welcome to '.$sitename;
	$cuerpo = '

         <html>
         <head>
			<meta http-equiv="Content-Type" />
            <title>'.$asunto.'</title>
			<link rel="preconnect" href="https://fonts.googleapis.com">
		<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
		<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet">
         <style>
		 body{
		 
		 padding:0;
		 font-family: "Roboto", sans-serif;
		 }
		 #wrapper {
		background-color: #fff;
		margin: 0;
		padding: 70px 0;
		-webkit-text-size-adjust: none !important;
		width: 100%;
		font-size:18px;
		}
		#template_container{
			background:#FEF9F3;
			color:black;
			margin:0 auto;
		}
		#template_container p{
			color:black;
			text-align:left;
			padding: 16px 16px;
		font-size:18px;
		}
		
		#template_container a{
			font-weight:700;
			color:black;
		}
		
		 </style>
		 </head>
         <body marginwidth="0" topmargin="0" marginheight="0" offset="0">
			<table border="0" cellpadding="0" cellspacing="0" width="600" id="template_container">
			
			<tr>
					<td align="center" valign="top">
						<div id="template_header_image">
						<img src="'.get_template_directory_uri().'/public/mailing/regrecover.jpg"/>
						</div>
					</td>
			</tr>

			<tr>
					<td align="center" valign="top">
					<h1 style="color:black;padding:0 24px;margin-top:24px;text-align:left;font-size:24px;font-weight:700;margin-bottom:24px;">WELCOME TO LIVING CORPORATE</h1>
             <p style="color:black">Thank you for registering with '.$sitename.'. Your account has been set up and you can log in using the following details -<br /><br />'
            .'<strong>Username:</strong> '.$email
            .'<br /><strong>Password:</strong> '.$pass
            .'<br /><br />Once you have logged in, please ensure that you visit the Site Admin and change you password so that you don\'t forget it in the future.</p>
					</td>
			</tr>
	</table>
         </body>
         </html>
     ';

     //para el envío en formato HTML
     $headers = "MIME-Version: 1.0\r\n";
     //$headers .= "Content-type: text/html; charset=iso-8859-1\r\n";
     $headers .= "Content-type: text/html; charset=UTF-8\r\n";

     //dirección del remitente


     //ruta del mensaje desde origen a destino
		$headers .= "From: ".$adminmail."\r\n";
     $headers .= "Return-path: ".$adminmail."\r\n";
     wp_mail($email,$asunto,$cuerpo,$headers);
}
function contact_email($request){
	$sitename = get_bloginfo('name');
	$siteurl = get_site_url();
	$email = get_field('emailcontact','options');
	$adminmail='info@living-corporate.com';
      $asunto = $sitename.': Contact form';
	$cuerpo = '

         <html>
         <head>
			<meta http-equiv="Content-Type" />
            <title>'.$asunto.'</title>
			<link rel="preconnect" href="https://fonts.googleapis.com">
		<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
		<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet">
         <style>
		 body{
		 
		 padding:0;
		 font-family: "Roboto", sans-serif;
		 }
		 #wrapper {
		background-color: #fff;
		margin: 0;
		padding: 70px 0;
		-webkit-text-size-adjust: none !important;
		width: 100%;
		font-size:18px;
		}
		#template_container{
			background:#FEF9F3;
			color:black;
			margin:0 auto;
		}
		#template_container p{
			color:black;
			text-align:left;
			padding: 16px 16px;
		font-size:18px;
		}
		
		#template_container a{
			font-weight:700;
			color:black;
		}
		
		 </style>
		 </head>
         <body marginwidth="0" topmargin="0" marginheight="0" offset="0">
			<table border="0" cellpadding="0" cellspacing="0" width="600" id="template_container">
			
			<tr>
					<td align="center" valign="top">
						<div id="template_header_image">
						<img src="'.get_template_directory_uri().'/public/mailing/regrecover.jpg"/>
						</div>
					</td>
			</tr>

			<tr>
					<td align="center" valign="top">
					<h1 style="color:black;padding:0 24px;margin-top:24px;text-align:left;font-size:24px;font-weight:700;margin-bottom:24px;">'.$asunto.'</h1>
             <p style="color:black">'
            .'<strong>Name:</strong> '.$request['name']
            .'<br /><strong>Email:</strong> '.$request['email']
            .'<br /><strong>Topic:</strong> '.$request['topic']
            .'<br /><strong>Message:</strong> '.$request['message']
            .'</p>
					</td>
			</tr>
	</table>
         </body>
         </html>
     ';

     //para el envío en formato HTML
     $headers = "MIME-Version: 1.0\r\n";
     //$headers .= "Content-type: text/html; charset=iso-8859-1\r\n";
     $headers .= "Content-type: text/html; charset=UTF-8\r\n";

     //dirección del remitente


     //ruta del mensaje desde origen a destino
		$headers .= "From: ".$adminemail."\r\n";
     $headers .= "Return-path: ".$adminemail."\r\n";
     wp_mail($email,$asunto,$cuerpo,$headers);
}

//prepare_email('angelperezpedrosa@gmail.com','a');
function email_set_content_type(){
return "text/html";
}

add_filter( 'wp_mail_content_type','email_set_content_type' );
add_filter( 'retrieve_password_message', 'retrive_reset_password_msg', 10, 4 );
function retrive_reset_password_msg( $msg, $key, $user_login, $user_data ) {
    $msg  = __( "<div><h1>Hello!</h1>", 'personalize-login' ) . "\r\n\r\n";
    $msg  = __( "<p>You asked us to reset your password for your account using the email address", 'personalize-login' ) . "\r\n\r\n";
    $msg .= sprintf( __( "%s.</p>", 'personalize-login' ), $user_login ) . "\r\n\r\n";
    $msg .= __( "<a href='", 'personalize-login' ) . "\r\n\r\n";
    $msg .= site_url( "wp-login.php?action=rp&key=$key&login=" . rawurlencode( $user_login ), 'login' ) . "\r\n\r\n";
    $msg .= __( "'></a></div>", 'personalize-login' ) . "\r\n\r\n";
	
	
	$msg  = '
	<style>
		 body{
		 
		 padding:0;
		 font-family: "Roboto", sans-serif;
		 }
		 #wrapper {
		background-color: #fff;
		margin: 0;
		padding: 70px 0;
		-webkit-text-size-adjust: none !important;
		width: 100%;
		font-size:18px;
		}
		#template_container{
			background:#FEF9F3;
			color:black;
			margin:0 auto;
		}
		#template_container p{
			color:black;
			text-align:left;
			padding: 16px 16px;
		font-size:18px;
		}
		
		#template_container a{
			font-weight:700;
			color:black;
		}
		
		 </style>
		 </head>
			<table border="0" cellpadding="0" cellspacing="0" width="600" id="template_container">
			
			<tr>
					<td align="center" valign="top">
						<div id="template_header_image">
						<img src="'.get_template_directory_uri().'/public/mailing/regheader.jpg"/>
						</div>
					</td>
			</tr>

			<tr>
					<td  valign="top">
	
	<h1 style="color:black;padding:0 24px;margin-top:24px;text-align:left;font-size:24px;font-weight:700;margin-bottom:24px;">Hello!</h1>';
  $msg .= '<p style="color:black">You asked us to reset your password for your account using the email address</p>'.$user_login;
  $msg .= '<p style="color:black"> To reset your password, visit the following address:';

  $msg .= '<p style="color:black">'.site_url( "wp-login.php?action=rp&key=$key&login=".rawurlencode($user_login),'login').'</p>' ;
  $msg .= '<p style="color:black">Thanks!</p>';
	$msg .= '</td>
			</tr>
	</table>
     ';
    return $msg;
}

function apply_email($request,$files){
$sitename = get_bloginfo('name');
	$siteurl = get_site_url();
	$adminmail = 'info@living-corporate.com';
	if($request==''){
		
	}
	
	$job = get_post($request['jobid']);
    $asunto = 'Apply to '.$job->post_title;
	$email = get_field('email_form',$request['jobid']);
	$attachment= '';
	foreach( $files as $file )
      {
           if( is_array( $file ) ) {
                 $attach_id =upload_user_file($file);  //Call function
                 //update_post_meta($pid,'_thumbnail_id',$attach_id);
			   $urlnew=wp_get_attachment_url($attach_id);
			   //print_r($urlnew);
           }
      }
        $file_tmp_name    = $files['file']['tmp_name'];
         $file_name        = $files['file']['name'];
         $file_size        = $files['file']['size'];
         $file_type        = $files['file']['type'];
         $file_error       = $files['file']['error'];
         if ($file_error>0) {
           print_r('file error');
              $mymsg = array(
                  1=>"The uploaded file exceeds the upload_max_filesize directive in php.ini",
                  2=>"The uploaded file exceeds the MAX_FILE_SIZE directive that was specified in the HTML form",
                  3=>"The uploaded file was only partially uploaded",
                  4=>"No file was uploaded",
                  6=>"Missing a temporary folder"
              );
 
              $output = json_encode(array('type'=>'error', 'text' => $mymsg[$file_error]));
              die($output);
          }
          $imageFileType = pathinfo(WP_CONTENT_DIR.'/uploads/test/'.basename($files['file']['name'],PATHINFO_EXTENSION) );
 
               if (   $imageFileType['extension'] != 'pages'
                   && $imageFileType['extension'] != 'pdf'
                   && $imageFileType['extension'] != 'jpg'
                   && $imageFileType['extension'] != 'jpeg'
                   && $imageFileType['extension'] != 'doc'
                   && $imageFileType['extension'] != 'png' ) {
                     print_r('not accepted');
                   die('File not accepted');
               }
                if ( !file_exists(WP_CONTENT_DIR."/uploads/test" ) ) {
               mkdir(WP_CONTENT_DIR."/uploads/test", 0777, true);
           }
           $attachment = WP_CONTENT_DIR.'/uploads/test/'.basename($files['file']['name']);
           move_uploaded_file($files["file"]["tmp_name"], $attachment);
           $attachmentArray = array(WP_CONTENT_DIR.'/uploads/test/'.basename($files['file']['name']));
 
	$cuerpo = '

         <html>
         <head>
			<meta http-equiv="Content-Type" />
            <title>'.$asunto.'</title>
			<link rel="preconnect" href="https://fonts.googleapis.com">
		<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
		<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet">
         <style>
		 body{
		 
		 padding:0;
		 font-family: "Roboto", sans-serif;
		 }
		 #wrapper {
		background-color: #fff;
		margin: 0;
		padding: 70px 0;
		-webkit-text-size-adjust: none !important;
		width: 100%;
		font-size:18px;
		}
		#template_container{
			background:#FEF9F3;
			color:black;
			margin:0 auto;
		}
		#template_container p{
			color:black;
			text-align:left;
			padding: 16px 16px;
		font-size:18px;
		}
		
		#template_container a{
			font-weight:700;
			color:black;
		}
		
		 </style>
		 </head>
         <body marginwidth="0" topmargin="0" marginheight="0" offset="0">
			<table border="0" cellpadding="0" cellspacing="0" width="600" id="template_container">
			
			<tr>
					<td align="center" valign="top">
						<div id="template_header_image">
						<img src="'.get_template_directory_uri().'/public/mailing/regrecover.jpg"/>
						</div>
					</td>
			</tr>

			<tr>
					<td align="center" valign="top">
					<h1 style="color:black;padding:0 24px;margin-top:24px;text-align:left;font-size:24px;font-weight:700;margin-bottom:24px;">'.$asunto.'</h1>'
            .'<p style="color:black"><strong>Name:</strong> '.$request['name']
            .'<br /><br /><strong>Email:</strong> '.$request['email']
            .'<br /><br /><strong>Message:</strong> '.$request['message']
			.'<br/><br /><strong>Resume:</strong> <a href="'.$urlnew.'">Link</a>'
            .'.</p>
					</td>
			</tr>
	</table>
         </body>
         </html>
     ';

     //para el envío en formato HTML
     //$headers .= "Content-type: text/html; charset=iso-8859-1\r\n";
     $headers .= "Content-type: text/html; charset=UTF-8\r\n";

     //dirección del remitente


     //ruta del mensaje desde origen a destino
		$headers = "From: ".$adminmail."\r\n";
     $headers .= "Return-path: ".$adminmail."\r\n";
     $newArray = array($urlnew);
     wp_mail($email,$asunto,$cuerpo,$headers,$urlnew);
	return array($attach_id,$urlnew,$urlnew);
    }
function apply_emailnew($request,$files){
	$sitename = get_bloginfo('name');
	$siteurl = get_site_url();
	$adminmail = 'info@living-corporate.com';
	if($request==''){
		
	}
	
	$job = get_post($request['jobid']);
    $asunto = 'Apply to '.$job->post_title;
	$email = get_field('email_form',$request['jobid']);
	$attachment= '';
	$file = $files[0];
	$allowed =  array('gif','png' ,'jpg', 'doc', 'docx', 'odt', 'pdf', 'zip', 'rar', '7zip');
            $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
            if(in_array($ext,$allowed) ) {
                move_uploaded_file( $file['tmp_name'], WP_CONTENT_DIR.'/uploads/'.basename( $file['name'] ) );
                $anexo = WP_CONTENT_DIR.'/uploads/'.basename( $file['name'] );
			}
 
	$cuerpo = '

         <html>
         <head>
			<meta http-equiv="Content-Type" />
            <title>'.$asunto.'</title>
			<link rel="preconnect" href="https://fonts.googleapis.com">
		<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
		<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet">
         <style>
		 body{
		 
		 padding:0;
		 font-family: "Roboto", sans-serif;
		 }
		 #wrapper {
		background-color: #fff;
		margin: 0;
		padding: 70px 0;
		-webkit-text-size-adjust: none !important;
		width: 100%;
		font-size:18px;
		}
		#template_container{
			background:#FEF9F3;
			color:black;
			margin:0 auto;
		}
		#template_container p{
			color:black;
			text-align:left;
			padding: 16px 16px;
		font-size:18px;
		}
		
		#template_container a{
			font-weight:700;
			color:black;
		}
		
		 </style>
		 </head>
         <body marginwidth="0" topmargin="0" marginheight="0" offset="0">
			<table border="0" cellpadding="0" cellspacing="0" width="600" id="template_container">
			
			<tr>
					<td align="center" valign="top">
						<div id="template_header_image">
						<img src="'.get_template_directory_uri().'/public/mailing/regrecover.jpg"/>
						</div>
					</td>
			</tr>

			<tr>
					<td align="center" valign="top">
					<h1 style="color:black;padding:0 24px;margin-top:24px;text-align:left;font-size:24px;font-weight:700;margin-bottom:24px;">'.$asunto.'</h1>'
            .'<p style="color:black"><strong>Name:</strong> '.$request['name']
            .'<br /><br /><strong>Email:</strong> '.$request['email']
            .'<br /><br /><strong>Message:</strong> '.$request['message']
			.'<br/><br /><strong>Resume:</strong> <a href="'.$anexo.'">Link</a>'
            .'.</p>
					</td>
			</tr>
	</table>
         </body>
         </html>
     ';

     //para el envío en formato HTML
     $headers = "MIME-Version: 1.0\r\n";
     //$headers .= "Content-type: text/html; charset=iso-8859-1\r\n";
     $headers .= "Content-type: text/html; charset=UTF-8\r\n";

     //dirección del remitente


     //ruta del mensaje desde origen a destino
		$headers .= "From: ".$adminmail."\r\n";
     $headers .= "Return-path: ".$adminmail."\r\n";
     wp_mail($email,$asunto,$cuerpo,$headers,$anexo);
	unlink($anexo);
	return array($attach_id,$urlnew,$newArray);
    }
?>