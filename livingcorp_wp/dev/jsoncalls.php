<?php

class all_terms
{
  public function __construct()
  {
    $namespace = 'wp/v2';
    register_rest_route($namespace, '/all-terms', array(
      'methods' => 'GET',
      'callback' => array($this, 'get_all_terms'),
    )
    );


  }

  public function get_all_terms($object)
  {
    $return = array();
    // $return['categories'] = get_terms('category');
    //        $return['tags'] = get_terms('post_tag');
    // Get taxonomies
    $args = array(
      'public' => true,
      '_builtin' => false
    );
    $output = 'names'; // or objects
    $operator = 'and'; // 'and' or 'or'
    $taxonomies = get_taxonomies($args, $output, $operator);
    foreach ($taxonomies as $key => $taxonomy_name) {
      if ($taxonomy_name = $_GET['term']) {
        $return = get_terms($taxonomy_name);
      }
    }
    return new WP_REST_Response($return, 200);
  }


}

class getlists
{
  public function __construct()
  {
    $namespace = 'wp/v2';
    register_rest_route($namespace, '/getlists', array(
      'methods' => 'GET',
      'callback' => array($this, 'getlists'),
    )
    );


  }

  public function getlists($object)
  {
    $return = (object) [
      'posts' => array()
    ];

    $args = array(
      'post_type' => 'list',
      'posts_per_page' => -1,
      'post_status' => 'publish',

    );
    $wp_query = new WP_query($args);
    if ($wp_query->have_posts()):
      while ($wp_query->have_posts()):
        $wp_query->the_post();
        $object = (object) [
          'title' => get_the_title(),
          'description' => get_field('description_a'),
          'image' => get_field('image_a'),
          'list' => get_field('mailchimp_id'),
          'id' => get_the_ID()
        ];
        if (get_field('subtitle')) {

          $object->subtitle = get_field('subtitle');
        } else {

          $object->subtitle = ' ';
        }
        array_push($return->posts, $object);
      endwhile;
    endif;

    return new WP_REST_Response($return, 200);
  }


}



class getjobs
{
  public function __construct()
  {
    $namespace = 'wp/v2';
    register_rest_route($namespace, '/getjobs', array(
      'methods' => 'GET',
      'callback' => array($this, 'getjobs'),
    )
    );


  }

  public function getjobs($object)
  {
    $return = (object) [
      'posts' => array(),
      'total' => 0,
    ];

    if ($_GET['jobsids']) {
      $val = explode(',', $_GET['jobsids']);

      $args = array(
        'post_type' => 'job',
        'posts_per_page' => -1,
        'post_status' => 'publish',
        'post__in' => $val
      );
    } else {
      $args = array(
        'post_type' => 'job',
        'posts_per_page' => -1,
        'post_status' => 'publish',
        'tax_query' => array('relation' => 'AND')
      );
    }
    $return->total = $location;
    if ($_GET['industry']) {
      $industry = $_GET['industry'];
      $industry = explode(',', $industry);
      array_push($args['tax_query'], array('taxonomy' => 'industry', 'field' => 'term_id', 'terms' => $industry));
    }

    if ($_GET['location']) {
      $location = $_GET['location'];
      $location = explode(',', $location);
      array_push($args['tax_query'], array('taxonomy' => 'location', 'field' => 'term_id', 'terms' => $location));
    }
    $wp_query = new WP_query($args);
    $return->total = $wp_query->post_count;
    if ($wp_query->have_posts()):
      while ($wp_query->have_posts()):
        $wp_query->the_post();
        $object = (object) [
          'link' => get_permalink(),
          'title' => get_the_title(),
          'description' => get_field('description_a'),
          'logo' => get_field('client_logo_a'),
          'client' => get_field('client_a'),
          'date' => get_the_date(),
          'id' => get_the_ID()
        ];
        $loc = get_the_terms(get_the_ID(), 'location');
        if ($loc) {
          $object->location = $loc[0]->name;
        }

        array_push($return->posts, $object);
      endwhile;
    endif;

    return new WP_REST_Response($return, 200);
  }


}

class getsearch
{
  public function __construct()
  {
    $namespace = 'wp/v2';
    register_rest_route($namespace, '/getsearch', array(
      'methods' => 'GET',
      'callback' => array($this, 'getsearch'),
    )
    );


  }

  public function getsearch($object)
  {
    $search = strtolower($_GET['search']);
    $return = (object) [
      'post' => array(),
      'search' => $search
    ];
    if ($search == '') {
      return new WP_REST_Response($return, 200);
    }
    $args = array(
      'post_type' => array('post', 'network', 'show', 'podcast'),
      'posts_per_page' => -1,
      'post_status' => 'publish',
      'meta_query' => array(
        'relation' => 'AND',
        array(
          'key' => 'description_a',
          'value' => $search,
          'compare' => 'LIKE',
        ),

      ),
    );
    $argstitle = array(
      'post_type' => array('post', 'network', 'show', 'podcast'),
      'posts_per_page' => -1,
      'post_status' => 'publish',
      's' => $search

    );


    //-   'meta_query'	=> array(
    //- 	'relation'		=> 'AND',
    //- 	array(
    //- 		'key'	 	=> 'color',
    //- 		'value'	  	=> array('red', 'orange'),
    //- 		'compare' 	=> 'IN',
    //- 	),
    //- 	array(
    //- 		'key'	  	=> 'featured',
    //- 		'value'	  	=> '1',
    //- 		'compare' 	=> 'LIKE',
    //- 	),
    //- ),
    $querys = new WP_query($argstitle);
    $queryacf = new WP_query($args);
    $wp_query = new WP_query();
    $wp_query->posts = array_merge($querys->posts, $queryacf->posts);
    $wp_query->post_count = $querys->post_count + $queryacf->post_count;
    if ($wp_query->have_posts()):
      while ($wp_query->have_posts()):
        $wp_query->the_post();
        $object = (object) [
          'link' => get_permalink(),
          'title' => get_the_title(),
          'description' => get_field('description_a'),
          'image' => get_field('image_a'),
          'date' => get_the_date(),
          'duration' => get_field('duration_a'),
          'id' => get_the_ID()
        ];
        $pt = get_post_type();
        $object->type = $pd;
        if ($pt == 'post') {
          $object->type = 'post';
          array_push($return->post, $object);

        } elseif ($pt == 'network') {
          $object->type = 'podcast';
          $meta = array(
            'permalink' => get_permalink($post["parent"]),
            'name' => get_the_title($post["parent"]),
            'featuring' => get_field('featuring_a', $post["parent"])
          );
          $object->parent = $meta;
          array_push($return->post, $object);
        } elseif ($pt == 'podcast') {
          $object->type = 'podcast';
          $meta = array(
            'permalink' => get_permalink($post["parent"]),
            'name' => get_the_title($post["parent"]),
            'featuring' => get_field('featuring_a', $post["parent"])
          );
          $object->parent = $meta;
          array_push($return->post, $object);

        } elseif ($pt == 'show') {
          $object->type = 'show';
          $meta = array(
            'permalink' => get_permalink($post["parent"]),
            'name' => get_the_title($post["parent"]),
          );
          $object->parent = $meta;
          array_push($return->post, $object);

        }
        if (get_author_name() != '') {
          $object->author = get_author_name();

        } else {
          $object->author = get_the_author();

        }
      endwhile;
    endif;

    return new WP_REST_Response($return, 200);
  }


}

function getcpt($type, $tags, $pos)
{
  if ($pos == 1) {
    $argspods = array(
      'post_type' => $type,
      'posts_per_page' => 6,
      'post_status' => 'publish',
      'meta_query' => array(
        'relation' => 'OR',


      ),
    );
  } else {
    $argspods = array(
      'post_type' => $type,
      'posts_per_page' => 6,
      'post_parent__not_in' => array(0),
      'post_status' => 'publish',
      'meta_query' => array(
        'relation' => 'OR',


      ),
    );
  }


  foreach ($tags as $t) {
    array_push(
      $argspods['meta_query'],
      array(
        'key' => 'tags',
        'value' => $t,
        'compare' => 'LIKE'
      )
    );
  }

  $cont = 0;
  $return = array();
  $podsquery = new WP_query($argspods);
  if ($podsquery->have_posts()):
    while ($podsquery->have_posts()):
      $podsquery->the_post();

      $object = (object) [
        'link' => get_permalink(),
        'title' => get_the_title(),
        'description' => get_field('description_a'),
        'image' => get_field('image_a'),
        'date' => get_the_date(),
        'duration' => get_field('duration_a'),
        'id' => get_the_ID(),
        'parentid' => wp_get_post_parent_id()
      ];
      $pt = get_post_type();
      $object->type = $pt;
      if (get_field('featuring_a')) {
        $object->featuring = get_field('featuring_a');

      }
      if ($object->parentid != 0) {

        $meta_data = array(
          'permalink' => get_permalink($object->parentid),
          'name' => get_the_title($object->parentid),
          'featuring' => get_field('featuring_a', $object->parentid)
        );
        $object->parent = $meta_data;
      }

      array_push($return, $object);
      $cont++;
    endwhile;
  endif;
  $podsnotin = array();
  foreach ($return as $p) {
    array_push($podsnotin, $p->id);
  }
  if ($cont < 6) {
    if ($pos == 1) {
      $argspods = array(
        'post_type' => $type,
        'posts_per_page' => 6 - $cont,
        'post_status' => 'publish',
        'post__not_in' => $podsnotin
      );
    } else {
      $argspods = array(
        'post_type' => $type,
        'posts_per_page' => 6 - $cont,
        'post_parent__not_in' => array(0),
        'post_status' => 'publish',
        'post__not_in' => $podsnotin
      );
    }

    $podsquery = new WP_query($argspods);
    if ($podsquery->have_posts()):
      while ($podsquery->have_posts()):
        $podsquery->the_post();
        $object = (object) [
          'link' => get_permalink(),
          'title' => get_the_title(),
          'description' => get_field('description_a'),
          'image' => get_field('image_a'),
          'date' => get_the_date(),
          'duration' => get_field('duration_a'),
          'id' => get_the_ID(),
          'parentid' => wp_get_post_parent_id()
        ];
        $pt = get_post_type();
        $object->type = $pt;
        if ($object->parentid != 0) {

          $meta_data = array(
            'permalink' => get_permalink($object->parentid),
            'name' => get_the_title($object->parentid),
            'featuring' => get_field('featuring_a', $object->parentid)
          );
          $object->parent = $meta_data;
        }
        array_push($return, $object);
        $cont++;
      endwhile;
    endif;
  }
  return $return;
}

class gettags
{
  public function __construct()
  {
    $namespace = 'wp/v2';
    register_rest_route($namespace, '/gettags', array(
      'methods' => 'GET',
      'callback' => array($this, 'gettags'),
    )
    );


  }
  public function gettags($object)
  {
    $po = $_GET['post'];
    $tags = get_field('tags', $po);
    $argstags = array(
      'post_type' => 'tag',
      'posts_per_page' => -1,
      'post_status' => 'publish',
      'post__in' => $tags

    );
    $return = array();

    $tagsquery = new WP_query($argstags);
    if ($tagsquery->have_posts()):
      while ($tagsquery->have_posts()):
        $tagsquery->the_post();
        $object = (object) [
          'id' => get_the_ID(),
          'title' => get_the_title()
        ];
        array_push($return, $object);
      endwhile;
    endif;
    return new WP_REST_Response($return, 200);

  }
}

class gettopics
{
  public function __construct()
  {
    $namespace = 'wp/v2';
    register_rest_route($namespace, '/gettopics', array(
      'methods' => 'GET',
      'callback' => array($this, 'gettopics'),
    )
    );


  }
  public function gettopics($object)
  {
    $top = $_GET['topics'];
    // $top = '17,18';
    $top = explode(',', $top);
    $return = (object) [
      'posts' => array(),
      'shows' => array(),
      'pods' => array(),
      'tags' => array(),
      'topics' => $top
    ];
    $argstags = array(
      'post_type' => 'tag',
      'posts_per_page' => -1,
      'post_status' => 'publish',
      'meta_query' => array(
        'relation' => 'OR'
      ),

    );
    foreach ($top as $t) {
      array_push(
        $argstags['meta_query'],
        array(
          'key' => 'topics_a',
          'value' => $t,
          'compare' => 'LIKE'
        )
      );
    }

    $tagsquery = new WP_query($argstags);
    if ($tagsquery->have_posts()):
      while ($tagsquery->have_posts()):
        $tagsquery->the_post();
        $object = (object) [
          'id' => get_the_ID()
        ];
        array_push($return->tags, get_the_ID());
      endwhile;
    endif;



    $return->pods = getcpt(array('podcast'), $return->tags, 0);
    $return->posts = getcpt(array('post'), $return->tags, 1);
    $return->shows = getcpt(array('show'), $return->tags, 2);
    return new WP_REST_Response($return, 200);
  }


}

function lc_not_collective_meta_query() {
  return [
    'relation' => 'OR',
    [
      'key' => 'add_to_collective',
      'value' => 1,
      'compare' => '!=',
    ],
    [
      'key' => 'add_to_collective',
      'value' => 1,
      'compare' => 'NOT EXISTS',
    ]
  ];
}

class getrandom
{
  public function __construct()
  {
    $namespace = 'wp/v2';
    register_rest_route($namespace, '/getrandom', array(
      'methods' => 'GET',
      'callback' => array($this, 'getrandom'),
    )
    );


  }

  public function getrandom($object)
  {
    $return = (object) [
      'posts' => array(),
      'maxpages' => ''
    ];
    $posts = array();
    $type = $_GET['type'];
    $perpage = $_GET['perpage'];
    $notin = $_GET['notin'];
    $args = array(
      'post_type' => $type,
      'orderby' => 'rand',
      'posts_per_page' => $perpage,
      'post_status' => 'publish',
      'post__not_in' => array($notin),
    );

    //-   'meta_query'	=> array(
    //- 	'relation'		=> 'AND',
    //- 	array(
    //- 		'key'	 	=> 'color',
    //- 		'value'	  	=> array('red', 'orange'),
    //- 		'compare' 	=> 'IN',
    //- 	),
    //- 	array(
    //- 		'key'	  	=> 'featured',
    //- 		'value'	  	=> '1',
    //- 		'compare' 	=> 'LIKE',
    //- 	),
    //- ),
    $query = new WP_query($args);

    if ($query->have_posts()):
      while ($query->have_posts()):
        $query->the_post();
        $object = (object) [
          'link' => get_permalink(),
          'title' => get_the_title(),
          'description' => get_field('description_a'),
          'image' => get_field('image_a'),
          'date' => get_the_date(),
          'duration' => get_field('duration_a'),
          'id' => get_the_ID()
        ];
        if ($parent != 0) {
          if ($type == 'podcast') {
            $meta = array(
              'permalink' => get_permalink($parent),
              'name' => get_the_title($parent),
              'featuring' => get_field('featuring_a', $parent)
            );
            $object->featuring = get_field('featuring_a');
            $object->parent = $meta;
          } elseif ($type == 'show') {
            $meta = array(
              'permalink' => get_permalink($parent),
              'name' => get_the_title($parent),
              'featuring' => get_field('featuring_a', $parent)
            );
            $object->parent = $meta;
          } elseif ($type == 'network') {
            $meta = array(
              'permalink' => get_permalink($parent),
              'name' => get_the_title($parent),
              'featuring' => get_field('featuring_a', $parent),
              'color' => get_field('color_a', $parent),
              'logo' => get_field('logo_a', $parent),
            );
            $object->parent = $meta;
          }
        } else {

        }
        if (get_author_name() != '') {
          $object->author = get_author_name();

        } else {
          $object->author = get_the_author();

        }
        array_push($return->posts, $object);
      endwhile;
    endif;
    $return->maxpages = $query->max_num_pages;
    return new WP_REST_Response($return, 200);
  }

}

class getposts
{
  public function __construct()
  {
    $namespace = 'wp/v2';
    register_rest_route($namespace, '/getposts', array(
      'methods' => 'GET',
      'callback' => array($this, 'getposts'),
    )
    );
  }

  public function getposts($object)
  {
    $return = (object) [
      'posts' => array(),
      'maxpages' => ''
    ];
    
    $posts = array();
    $type = $_GET['type'];
    $page = $_GET['page'];
    $perpage = $_GET['perpage'];

    if ($_GET['parent'] != 0) {
      $parent = $_GET['parent'];

      if ($parent == -1) {
        $parent = 0;
      }

      $args = array(
        'post_type' => $type,
        'posts_per_page' => $perpage,
        'paged' => $page,
        'post_parent' => $parent,
        'post_status' => 'publish',
        'meta_query' => lc_not_collective_meta_query(),
        // 'order' => 'DESC',
        // 'orderby' => 'date',
      );
    } else {
      $args = array(
        'post_type' => $type,
        'posts_per_page' => $perpage,
        'paged' => $page,
        'post_status' => 'publish',
        'meta_query' => lc_not_collective_meta_query(),
        // 'order' => 'DESC',
        // 'orderby' => 'date',
      );
    }

    if ($type == 'tag' && isset($_GET['tag_id'])) {
      $tag_id = $_GET['tag_id'];

      global $wpdb;

      $sql = "SELECT p.ID
        FROM $wpdb->posts p LEFT JOIN $wpdb->postmeta pm
        ON ( p.ID = pm.post_id AND pm.meta_key = 'tags' )
        WHERE meta_value LIKE '%$tag_id%' AND p.post_type != 'revision'";

      $id_list = $wpdb->get_col($sql);
      
      $args = [
        'post__in' => $id_list,
        'posts_per_page' => $perpage,
        'paged' => $page,
        'post_type' => 'any',
        // 'order' => 'DESC',
        // 'orderby' => 'date',
        'post_status' => 'publish',
      ];
    }

    //-   'meta_query'	=> array(
    //- 	'relation'		=> 'AND',
    //- 	array(
    //- 		'key'	 	=> 'color',
    //- 		'value'	  	=> array('red', 'orange'),
    //- 		'compare' 	=> 'IN',
    //- 	),
    //- 	array(
    //- 		'key'	  	=> 'featured',
    //- 		'value'	  	=> '1',
    //- 		'compare' 	=> 'LIKE',
    //- 	),
    //- ),
    $query = new WP_query($args);

    if ($query->have_posts()):
      while ($query->have_posts()):
        $query->the_post();
        $object = (object) [
          'link' => get_permalink(),
          'title' => get_the_title(),
          'description' => get_field('description_a'),
          'image' => get_field('image_a'),
          'date' => get_the_date(),
          'duration' => get_field('duration_a'),
          'id' => get_the_ID()
        ];
        if ($parent != 0) {
          if ($type == 'podcast') {
            $meta = array(
              'permalink' => get_permalink($parent),
              'name' => get_the_title($parent),
              'featuring' => get_field('featuring_a', $parent)
            );
            $object->featuring = get_field('featuring_a');
            $object->parent = $meta;
          } if ($type == 'learn') {
            $meta = array(
              'permalink' => get_permalink($parent),
              'name' => get_the_title($parent),
              'featuring' => get_field('featuring_a', $parent)
            );
            $object->featuring = get_field('featuring_a');
            $object->parent = $meta;
          } elseif ($type == 'show') {
            $meta = array(
              'permalink' => get_permalink($parent),
              'name' => get_the_title($parent),
              'featuring' => get_field('featuring_a', $parent)
            );
            $object->parent = $meta;
          } elseif ($type == 'network') {
            $meta = array(
              'permalink' => get_permalink($parent),
              'name' => get_the_title($parent),
              'featuring' => get_field('featuring_a', $parent),
              'color' => get_field('color_a', $parent),
              'logo' => get_field('logo_a', $parent),
            );
            $object->parent = $meta;
          }
        } else {
          if ($type == 'podcast') {
            $pages = get_pages(array('child_of' => get_the_ID(), 'post_type' => 'podcast'));
            $count = count($pages);
            $object->sons = $count . ' episodes';

          }
          if ($type == 'learn') {
            $pages = get_pages(array('child_of' => get_the_ID(), 'post_type' => 'learn'));
            $count = count($pages);
            $object->sons = $count . ' episodes';

          }

          if ($type == 'network') {
            $object->color = get_field('color_a');
            $object->logo = get_field('logo_a');
          }

        }
        if (get_author_name() != '') {
          $object->author = get_author_name();

        } else {
          $object->author = get_the_author();

        }
        array_push($return->posts, $object);
      endwhile;
    endif;
    if ($query->max_num_pages == 0) {
      $return->maxpages = 1;

    } else {

      $return->maxpages = $query->max_num_pages;
    }

    return new WP_REST_Response($return, 200);
  }


}

class sendform
{
  public function __construct()
  {
    $namespace = 'wp/v2';
    register_rest_route($namespace, '/sendform', array(
      'methods' => 'POST',
      'callback' => array($this, 'sendform'),
    )
    );


  }

  public function sendform($object)
  {
    $nombre = $_POST['nombre'];
    $email = $_POST['email'];
    $telefono = $_POST['telefono'];
    $message = $_POST['mensaje'];
    $asunto = 'AWMA Formulario contacto';

    $destinatario = get_field('email_form', 'options');
    $cuerpo = '

         <html>
         <head>
            <title>' . $asunto . '</title>
         </head>
         <body>

             Nombre: ' . $nombre . ' <br /><br />
             Email: ' . $email . ' <br /><br />
             Teléfono: ' . $telefono . ' <br /><br />
             Mensaje: ' . $message . ' <br /><br />

         </body>
         </html>
     ';

    //para el envío en formato HTML
    $headers = "MIME-Version: 1.0\r\n";
    //$headers .= "Content-type: text/html; charset=iso-8859-1\r\n";
    $headers .= "Content-type: text/html; charset=UTF-8\r\n";

    //dirección del remitente
    $headers .= "From: " . $email . "\r\n";


    //ruta del mensaje desde origen a destino
    $headers .= "Return-path: " . $email . "\r\n";

    wp_mail($destinatario, $asunto, $cuerpo, $headers);
    return new WP_REST_Response($posts, 200);
  }


}


add_action('rest_api_init', function () {
  //$all_terms = new all_terms;
  $getposts = new getposts;
  $getjobs = new getjobs;
  $getsearch = new getsearch;
  $getrandom = new getrandom;
  $sendform = new sendform;
  $getlists = new getlists;
  $gettopics = new gettopics;
  $gettags = new gettags;
});
//http://youdomain.com/wp-json/wp/v2/all-terms?term=you_taxonomy Función de arriba
//http://localhost:8888/awma_dev/wp-json/wp/v2/getproyectostipo?tipo=11
//http://localhost:8888/awma_dev/wp-json/wp/v2/tipo/?parent=0 Sin parent
//http://localhost:8888/awma_dev/wp-json/wp/v2/tipo/?count=0
//http://localhost:8888/awma_dev/wp-json/wp/v2/proyecto/?per_page=100&tipo=11 POST POR TERM v1 el post per page no hace falta
//http://localhost:8888/awma_dev/wp-json/wp/v2/proyecto/?tipo=11&orderby=rand
?>