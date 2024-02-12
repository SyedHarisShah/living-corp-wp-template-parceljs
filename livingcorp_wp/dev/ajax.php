<?php
 function search(){
  global $wpdb; // this is how you get access to the database
  $argus = array(
    'post_type' => array('proyecto','page','post'),
    'post_per_page' => -1,
    'orderby' => 'post_type',
     's' => $_POST['search'],
    // 's' => 'nueva',
    );
    $postes = new WP_query($argus);
    if($postes->max_num_pages < 1){

    }
    else{
      // $posts = [];
      // $proyecto = [];
      // $paginas = [];
      // $servicios = [];
      $actualp = '';
      $contp = 0;
      $html ='';
      $search = strtolower($_POST['search']);
      // $search = 'nueva';
      if($postes->have_posts()){
        while ($postes->have_posts()){
          $postes->the_post();
          if(get_post_type()!=$actualp){
            $actualp = get_post_type();
            if($contp!=0){
              $html.='</div>';
            }
            if($actualp == 'page'){
              $showtext = 'Páginas';
            
            }
            elseif($actualp == 'post'){
              $showtext = 'Blog';

            }
            elseif($actualp == 'proyecto'){
              $showtext = 'Proyectos';

            }
            $html.='<div class="searchcontainer__el"><p>'.$showtext.'</p>';
            $contp++;
          }
          $title = str_replace($search,'<span>'.$search.'</span>',strtolower(get_the_title()));
          $html.='<a class="ajaxLoad" href="'.get_permalink().'">'.$title.'</a>';
        }
        $html.='</div>';
      }
          $tax=get_tax_by_search($search);
          if($tax){
            $html.=$tax;
          }
          print_r($html);
    }
    wp_die();
}

add_action( 'wp_ajax_search', 'search');
add_action( 'wp_ajax_nopriv_search', 'search');


 function send_mail(){


     $nombre = $_POST['name'];
     $surname = $_POST['asunto'];
     $email = $_POST['email'];
     $company = $_POST['telefono'];
     $message = $_POST['mensaje'];
     $asunto = 'Formulario contacto';

     // $destinatario=get_field('emailforms','options');
     $destinatario = get_field('email_form','options');
//     if(wp_count_posts('form')->publish){
//       $titlenum= wp_count_posts('form')->publish;
//     }
//     else{
//       $titlenum=1;
//     }
//     $my_post = array(
//       'post_title'=> 'Formulario nº'.$titlenum,
//       'post_type'=> 'form',
//       'post_status'=> 'publish'
//    );
//
//    $post_id = wp_insert_post( $my_post );

//    update_field( 'nombre', $nombre, $post_id );
//    update_field( 'email', $email, $post_id );
//    update_field( 'mensaje', $mensaje, $post_id );
     $cuerpo = '

         <html>
         <head>
            <title>Fellas Formulario contacto</title>
         </head>
         <body>

              Nombre: '.$nombre.' <br /><br />
              Asunto: '.$surname.' <br /><br />
             Email: '.$email.' <br /><br />
             Teléfono: '.$company.' <br /><br />
             Mensaje: '.$message.' <br /><br />

         </body>
         </html>

     ';

     //para el envío en formato HTML
     $headers = "MIME-Version: 1.0\r\n";
     //$headers .= "Content-type: text/html; charset=iso-8859-1\r\n";
     $headers .= "Content-type: text/html; charset=UTF-8\r\n";

     //dirección del remitente
     $headers .= "From: ".$email."\r\n";


     //ruta del mensaje desde origen a destino
     $headers .= "Return-path: ".$email."\r\n";

     wp_mail($destinatario,$asunto,$cuerpo,$headers);


 	wp_die(); // this is required to terminate immediately and return a proper response
 }


 add_action( 'wp_ajax_send_mail', 'send_mail');
 add_action( 'wp_ajax_nopriv_send_mail', 'send_mail');


function upload_user_file( $file = array() ) {
  require_once( ABSPATH . 'wp-admin/includes/admin.php' );
  $file_return = wp_handle_upload( $file, array('test_form' => false ) );
  if( isset( $file_return['error'] ) || isset( $file_return['upload_error_handler'] ) ) {
      return false;
  } else {
      $filename = $file_return['file'];
      $attachment = array(
          'post_mime_type' => $file_return['type'],
          'post_title' => preg_replace( '/\.[^.]+$/', '', basename( $filename ) ),
          'post_content' => '',
          'post_status' => 'inherit',
          'guid' => $file_return['url']
      );
      $attachment_id = wp_insert_attachment( $attachment, $file_return['url'] );
      require_once(ABSPATH . 'wp-admin/includes/image.php');
      $attachment_data = wp_generate_attachment_metadata( $attachment_id, $filename );
      wp_update_attachment_metadata( $attachment_id, $attachment_data );
      if( 0 < intval( $attachment_id ) ) {
        //print_r($attachment_id);
        return $attachment_id;
      }
  }
  return false;
}
function post_load(){

    global $wpdb; // this is how you get access to the database
    $content='';
    $URI = get_template_directory_uri();
    $Iarrow = take_file($URI.'/svg/arrow.svg');
    $contentfinal = '';
    if($_POST['type']=='gallery'){
      $type = 0;
    }
    else{

      $type = 1;
    }
    if($_POST['change']==1){
      if($type==0){
        $contentfinal.='<div class="content__projects__gallery gallery">';
      }
      else{
        $contentfinal.='<div class="content__projects__list list">';

      }
    }
    if($_POST['cat']==0){
      $args= array('post_type' => 'project', 'posts_per_page' => -1, 'post_status' => 'publish');
    }
    else{
      $args= array('post_type' => 'project', 'posts_per_page' => -1, 'post_status' => 'publish', 'tax_query' => array('relation' => 'OR'));
      array_push($args['tax_query'],array('taxonomy' => 'Type', 'field' => 'term_id', 'terms' => array($_POST['cat']) ));
    }
    $newquery= new WP_query( $args );
    $cont=0;
    $contp = 0;
    
    if ( $newquery->have_posts() ) {
      while ( $newquery->have_posts() ) {
      $newquery->the_post();
      if($type==0){
        $contentfinal.='<a class="gallery__el ajaxLoad" href="'.get_permalink().'">
        <div class="gallery__el__image"><img class="gallery__el__img" src="'.get_field('imagen_archive').'"></div>
        <div class="gallery__el__info">
            <h3 class="el__title title4">'.get_the_title().'</h3>
            <div class="arrow">'.$Iarrow.'
            </div>
          </div>
        </a>';
      }
      else{
        $contentfinal.='<a class="list__el ajaxLoad" href="'.get_permalink().'">
        
            <h3 class="el__title title4">'.get_the_title().'</h3>
            <div class="arrow">'.$Iarrow.'</div>
        </a>';
      }
        $cont++;
            } // endwhile;
          } // endif;
          if($_POST['change']==1){
            $contentfinal.='</div>';
          }
     print_r($contentfinal);
  wp_die(); // this is required to terminate immediately and return a proper response
      
  }
  
  
  add_action( 'wp_ajax_post_load', 'post_load');
  add_action( 'wp_ajax_nopriv_post_load', 'post_load');

?>