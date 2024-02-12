<?php
function change_post_menu_label() {
    global $menu;
    global $submenu;
    $menu[5][0] = 'Articles';
    $submenu['edit.php'][5][0] = 'Articles';
    $submenu['edit.php'][10][0] = 'Add Articles';
    echo '';
}
function change_post_object_label() {
        global $wp_post_types;
        $labels = &$wp_post_types['post']->labels;
        $labels->name = 'Articles';
        $labels->singular_name = 'Article';
        $labels->add_new = 'Add Article';
        $labels->add_new_item = 'Add Article';
        $labels->edit_item = 'Edit Article';
        $labels->new_item = 'Article';
        $labels->view_item = 'View Article';
        $labels->search_items = 'Search Articles';
        $labels->not_found = 'No Articles found';
        $labels->not_found_in_trash = 'No Articles found in Trash';
}
add_action( 'init', 'change_post_object_label' );
add_action( 'admin_menu', 'change_post_menu_label' );


// --------  TEMPLATE CUSTOM POST TYPES  --------
//'rewrite' => array( 'slug' => 'housereel' ),
$post_types = array(
    array (
        'name' => 'Podcasts',
        'menu' => 'Podcasts',
        'query_var' => 'podcast',
        'icon' => 'dashicons-format-audio',
        'has_single'  => true,
        'has_archive'  => true,
		'hierarchical' => true
    ),
    // array (
    //     'name' => 'Learning Platform',
    //     'menu' => 'Learning Platform',
    //     'query_var' => 'learn',
    //     'icon' => 'dashicons-format-audio',
    //     'has_single'  => true,
    //     'has_archive'  => true,
	// 	'hierarchical' => true
    // ),
	array (
        'name' => 'Shows',
        'menu' => 'Shows',
        'query_var' => 'show',
        'icon' => 'dashicons-video-alt3',
        'has_single'  => true,
        'has_archive'  => true,
		'hierarchical' => true
    ),
	array (
        'name' => 'Network',
        'menu' => 'Network',
        'query_var' => 'network',
        'icon' => 'dashicons-admin-site-alt3',
        'has_single'  => true,
        'has_archive'  => true,
		'hierarchical' => true
    ),
	array (
        'name' => 'Jobs',
        'menu' => 'Jobs',
        'query_var' => 'job',
        'icon' => 'dashicons-hammer',
        'has_single'  => true,
        'has_archive'  => true,
		'hierarchical' => false
    ),
	array (
        'name' => 'Topics',
        'menu' => 'Topics',
        'query_var' => 'topic',
        'icon' => 'dashicons-format-chat',
        'has_single'  => false,
        'has_archive'  => false,
		'hierarchical' => false
    ),
	array (
        'name' => 'Tags',
        'menu' => 'Tags',
        'query_var' => 'tag',
        'icon' => 'dashicons-tag',
        'has_single'  => false,
        'has_archive'  => false,
		'hierarchical' => false
    ),
	
	array (
        'name' => 'Lists',
        'menu' => 'Lists',
        'query_var' => 'list',
        'icon' => 'dashicons-welcome-write-blog',
        'has_single'  => false,
        'has_archive'  => true,
		'hierarchical' => false
    ),
    array (
        'name' => 'CEO\'s',
        'menu' => 'CEO\'s',
        'query_var' => 'ceos',
        'icon' => 'dashicons-businessperson',
        'has_single'  => true,
        'has_archive'  => false,
		'hierarchical' => false
    ),
    array (
        'name' => 'Resources',
        'menu' => 'Resources',
        'query_var' => 'resource',
        'icon' => 'dashicons-text',
        'has_single'  => true,
        'has_archive'  => false,
		'hierarchical' => false
    ),
    array (
        'name' => 'Module',
        'menu' => 'Player Modules',
        'query_var' => 'module',
        'icon' => 'dashicons-media-audio',
        'has_single'  => true,
        'has_archive'  => false,
		'hierarchical' => false
    ),
    array (
        'name' => 'Sponsors',
        'menu' => 'Player Sponsors',
        'query_var' => 'sponsor',
        'icon' => 'dashicons-businessman',
        'has_single'  => true,
        'has_archive'  => false,
		'hierarchical' => false
    ),
    array (
        'name' => 'Playlist',
        'menu' => 'Playlist',
        'query_var' => 'playlist',
        'icon' => 'dashicons-playlist-audio',
        'has_single'  => true,
        'has_archive'  => true,
		'hierarchical' => false
    ),
    // dashicons-store
);


foreach ($post_types as $item) {
    $args = array(
        'labels' => array(
            'name' => __($item['menu'], $item['name']),
            'add_new' => __('Add '.$item['name']),
            'new_item' => __('New '.$item['name']),
            'add_new_item' => __('Add new '.$item['name']),
            'edit_item' => __('Edit '.$item['name']),
            'view_item' => __('See '.$item['name'].' in website'),
            'search_items' => __('Search '.$item['name']),
            'not_found' => __($item['name'].' not found'),
            'not_found_in_trash' => __($item['name'].' not found in the trash')
        ),
        'singular_label' => __($item['query_var']),
        'public' => true,
        'show_ui' => true,
        'show_in_rest' => true,
        'capability_type' => 'page',
        'hierarchical' => $item['hierarchical'],
        'rewrite' => true,
        'publicly_queryable'  => true,
        'has_archive' => $item['has_archive'],
        'query_var' => $item['query_var'],
        'menu_icon' => $item['icon'],
        'supports' => array(
            'title',
            'thumbnail',
            'editor',
			'page-attributes'
        )
    );
    register_post_type($item['query_var'], $args);

}

add_action( 'template_redirect', 'wpse_128636_redirect_post' );

function wpse_128636_redirect_post() {
  if ( is_singular( 'list' ) ) {
    wp_redirect( home_url(), 301 );
    exit;
  }
}

function genre_init_job() {

   register_taxonomy('location', array(
       'job'), array(

       'hierarchical' => true,
       'labels' => array(
           'name' => _x('Location', 'Locations'),
           'singular_name' => _x('Location', 'Location'),
           'search_items' => __('Search Location'),
           'all_items' => __('All Locations'),
           'parent_item' => __('Parent Genre'),
           'parent_item_colon' => __(''),
           'edit_item' => __('Edit Location'),
           'update_item' => __('Refresh Location'),
           'add_new_item' => __('Add Location'),
           'new_item_name' => __('New Location'),
           'menu_name' => __('Locations')

       ),
       'has_archive' => false,
       'show_in_rest' => false,
       'show_ui' => true,
       'query_var' => true,
       'rewrite' => array(
          'slug' => 'location'

       )
   ));

   flush_rewrite_rules(false);
	register_taxonomy('industry', array(
       'job'), array(

       'hierarchical' => true,
       'labels' => array(
           'name' => _x('Industry', 'Industries'),
           'singular_name' => _x('Industry', 'Industry'),
           'search_items' => __('Search Industry'),
           'all_items' => __('All Industries'),
           'parent_item' => __('Parent Genre'),
           'parent_item_colon' => __(''),
           'edit_item' => __('Edit Industry'),
           'update_item' => __('Refresh Industry'),
           'add_new_item' => __('Add Industry'),
           'new_item_name' => __('New Industry'),
           'menu_name' => __('Industries')

       ),
       'has_archive' => false,
       'show_in_rest' => false,
       'show_ui' => true,
       'query_var' => true,
       'rewrite' => array(
          'slug' => 'industry'

       )
   ));

   flush_rewrite_rules(false);
}




add_action('init', 'genre_init_job');

// function genre_init_categoria() {

//     register_taxonomy('categoria', array(
//         'producto'), array(
 
//         'hierarchical' => true,
//         'labels' => array(
//             'name' => _x('Categoría', 'Categorías'),
//             'singular_name' => _x('Categoría', 'Categoría'),
//             'search_items' => __('Search Categoría'),
//             'all_items' => __('All Categorías'),
//             'parent_item' => __('Parent Genre'),
//             'parent_item_colon' => __(''),
//             'edit_item' => __('Edit Categoría'),
//             'update_item' => __('Refresh Categoría'),
//             'add_new_item' => __('Add Categoría'),
//             'new_item_name' => __('Nuevo Categoría'),
//             'menu_name' => __('Categorías')
 
//         ),
//         'has_archive' => true,
//         'show_in_rest' => true,
//         'show_ui' => true,
//         'query_var' => true,
//         'rewrite' => array(
//            'slug' => 'categoria'
 
//         )
//     ));
 
//     flush_rewrite_rules(false);
 
//  }
 
//  add_action('init', 'genre_init_categoria');


// AÑADIR PÁGINAS PARA ARCHIVES

function mindbase_create_acf_pages() {
if(function_exists('acf_add_options_page')) {
    acf_add_options_sub_page(array(
    'page_title'      => 'Articles', /* Use whatever title you want */
    
    'parent_slug'     => 'edit.php', /* Change "services" to fit your situation */
    
    "menu_slug" => "article_options",
    'capability' => 'manage_options'
    ));
	
    acf_add_options_sub_page(array(
    'page_title'      => 'Podcast', /* Use whatever title you want */
    
    'parent_slug'     => 'edit.php?post_type=podcast', /* Change "services" to fit your situation */
    
    "menu_slug" => "podcast_options",
    'capability' => 'manage_options'
    ));

    acf_add_options_sub_page(array(
    'page_title'      => 'Learning Platform', /* Use whatever title you want */
    
    'parent_slug'     => 'edit.php?post_type=learn', /* Change "services" to fit your situation */
    
    "menu_slug" => "learn_options",
    'capability' => 'manage_options'
    ));
	
	
    acf_add_options_sub_page(array(
    'page_title'      => 'Shows', /* Use whatever title you want */
    
    'parent_slug'     => 'edit.php?post_type=show', /* Change "services" to fit your situation */
    
    "menu_slug" => "show_options",
    'capability' => 'manage_options'
    ));
	
	acf_add_options_sub_page(array(
    'page_title'      => 'Networks', /* Use whatever title you want */
    
    'parent_slug'     => 'edit.php?post_type=network', /* Change "services" to fit your situation */
    
    "menu_slug" => "network_options",
    'capability' => 'manage_options'
    ));
	
	acf_add_options_sub_page(array(
    'page_title'      => 'Jobs', /* Use whatever title you want */
    
    'parent_slug'     => 'edit.php?post_type=job', /* Change "services" to fit your situation */
    
    "menu_slug" => "job_options",
    'capability' => 'manage_options'
    ));
	acf_add_options_sub_page(array(
    'page_title'      => 'Lists', /* Use whatever title you want */
    
    'parent_slug'     => 'edit.php?post_type=list', /* Change "services" to fit your situation */
    
    "menu_slug" => "list_options",
    'capability' => 'manage_options'
    ));
    acf_add_options_sub_page(array(
    'page_title'      => 'Player Options', /* Use whatever title you want */
    
    'parent_slug'     => 'edit.php?post_type=module', /* Change "services" to fit your situation */
    
    "menu_slug" => "player_options",
    'capability' => 'manage_options'
    ));
}
}

add_action('init', 'mindbase_create_acf_pages');


add_action( 'rest_api_init', function () {
	register_rest_route( 'csskiller/v1', '/article/', array(
        'methods' => 'GET',
        'callback' => 'get_rest_article',
        //'permission_callback' => function () {
        //  return current_user_can( 'administrator' );
        //}
    ) );

    register_rest_route( 'csskiller/v1', '/resource/', array(
        'methods' => 'GET',
        'callback' => 'get_rest_resource',
        //'permission_callback' => function () {
        //  return current_user_can( 'administrator' );
        //}
    ) );
	
    register_rest_route( 'csskiller/v1', '/podcast/', array(
        'methods' => 'GET',
        'callback' => 'get_rest_podcast',
        //'permission_callback' => function () {
        //  return current_user_can( 'administrator' );
        //}
    ) );

    register_rest_route( 'csskiller/v1', '/learn/', array(
        'methods' => 'GET',
        'callback' => 'get_rest_learn',
        //'permission_callback' => function () {
        //  return current_user_can( 'administrator' );
        //}
    ) );
	
	register_rest_route( 'csskiller/v1', '/show/', array(
        'methods' => 'GET',
        'callback' => 'get_rest_show',
        //'permission_callback' => function () {
        //  return current_user_can( 'administrator' );
        //}
    ) );
    register_rest_route( 'csskiller/v1', '/ceos/', array(
        'methods' => 'GET',
        'callback' => 'get_rest_ceo',
        //'permission_callback' => function () {
        //  return current_user_can( 'administrator' );
        //}
    ) );
	register_rest_route( 'csskiller/v1', '/network/', array(
        'methods' => 'GET',
        'callback' => 'get_rest_network',
        //'permission_callback' => function () {
        //  return current_user_can( 'administrator' );
        //}
    ) );
	register_rest_route( 'csskiller/v1', '/list/', array(
        'methods' => 'GET',
        'callback' => 'get_rest_list',
        //'permission_callback' => function () {
        //  return current_user_can( 'administrator' );
        //}
    ) );
	register_rest_route( 'csskiller/v1', '/job/', array(
        'methods' => 'GET',
        'callback' => 'get_rest_job',
        //'permission_callback' => function () {
        //  return current_user_can( 'administrator' );
        //}
    ) );
	
	register_rest_route( 'csskiller/v1', '/topic/', array(
        'methods' => 'GET',
        'callback' => 'get_rest_topic',
        //'permission_callback' => function () {
        //  return current_user_can( 'administrator' );
        //}
    ) );
} );
	
function get_rest_topic( $data ) {
		$return = (object) [
			'topics' => array()
		];
		
		  $args= array(
          'post_type' => 'topic',
          'posts_per_page' => -1,
          'post_status' => 'publish',
		  
        );
		    $wp_query= new WP_query($args);
        if ($wp_query->have_posts()) : while ($wp_query->have_posts()) : $wp_query->the_post();
			$object = (object) [
            'title' => get_the_title(),
            'id' => get_the_ID()
          ];
		array_push($return->topics,$object);
        endwhile; endif;
		
        return new WP_REST_Response($return, 200);
	
}

function get_rest_podcast( $data ) {
	$fields=get_fields('option');
    $object = (object) [

    ];

		foreach($fields as $key=>$f){
			if(str_ends_with($key,'_podcast')){
                $object->{$key} = $f;

            }
        }

	

	return $object;
}

function get_rest_learn( $data ) {
	$fields=get_fields('option');
    $object = (object) [

    ];

		foreach($fields as $key=>$f){
			if(str_ends_with($key,'_learn')){
                $object->{$key} = $f;

            }
        }

	

	return $object;
}


function get_rest_article( $data ) {
	$fields=get_fields('option');
    $object = (object) [

    ];

		foreach($fields as $key=>$f){
			if(str_ends_with($key,'_article')){
                $object->{$key} = $f;

            }
        }

	

	return $object;
}

function get_rest_resource( $data ) {
	$fields=get_fields('option');
    $object = (object) [

    ];

		foreach($fields as $key=>$f){
			if(str_ends_with($key,'_article')){
                $object->{$key} = $f;

            }
        }

	

	return $object;
}

function get_rest_show( $data ) {
	$fields=get_fields('option');
    $object = (object) [

    ];

		foreach($fields as $key=>$f){
			if(str_ends_with($key,'_show')){
                $object->{$key} = $f;

            }
        }

	

	return $object;
}

function get_rest_ceo( $data ) {
	$fields=get_fields('option');
    $object = (object) [

    ];

		// foreach($fields as $key=>$f){
		// 	if(str_ends_with($key,'_show')){
        //         $object->{$key} = $f;

        //     }
        // }

	

	return $object;
}


function get_rest_network( $data ) {
	$fields=get_fields('option');
    $object = (object) [

    ];

		foreach($fields as $key=>$f){
			if(str_ends_with($key,'_network')){
                $object->{$key} = $f;

            }
        }

	

	return $object;
}

function get_rest_job( $data ) {
	$fields=get_fields('option');
    $object = (object) [

    ];
	
		foreach($fields as $key=>$f){
			if(str_ends_with($key,'_joba')){
                $object->{$key} = $f;

            }
        }

	$location = get_terms( 'location', array(
    'hide_empty' => false,
	) );
	$industry = get_terms( 'industry', array(
    'hide_empty' => false,
	) );
	$object->industry = $industry;
	$object->location = $location;
	if(!$object->industry[0]){
		$object->industry = array($object->industry['1']);
	}
	
	if(!$object->location[0]){
		$object->location = array($object->location['1']);
	}
	
	
	return $object;
}
function get_rest_list( $data ) {
	$fields=get_fields('option');
    $object = (object) [

    ];

		foreach($fields as $key=>$f){
			if(str_ends_with($key,'_lista')){
                $object->{$key} = $f;

            }
        }

	

	return $object;
}

add_action( 'rest_api_init', 'slug_register_showpodcast' );
function slug_register_showpodcast() {
    // first register the field with WP REST API
    register_rest_field( array('show','podcast','learn','network'),
        'parent_data',
        array(
            'get_callback'    => 'showpodcast_get_meta',
            'update_callback' => null,
            'schema'          => null,
        )
    );
	register_rest_field( array('post','show','podcast','learn','network','resource'),
        'ownpost_data',
		array(
            'get_callback'    => 'ownpost_get_meta',
            'update_callback' => null,
            'schema'          => null,
        )
	);
	register_rest_field( array('job'),
        'ownpost_data',
		array(
            'get_callback'    => 'job_get_meta',
            'update_callback' => null,
            'schema'          => null,
        )
	);
}

function job_get_meta($post, $field_name, $request) {
	$loc = get_the_terms($post['id'],'location');
	$indus = get_the_terms($post['id'],'industry');
	$meta_data = array(
		'author' => get_author_name($post),
		'date' => get_the_date('M j, Y',$post->ID)
	);
	if($loc){
		$meta_data['location'] = $loc[0]->name;
	}
	
	if($indus){
		$meta_data['industry'] = $indus[0]->name;
	}
	$meta_data['date'] = get_the_date('M j, Y',$post->ID);
    return $meta_data;
}
function ownpost_get_meta($post, $field_name, $request) {
	
	if(get_author_name($post)!=''){
		
		$meta_data = array(
			'author' => get_author_name($post),
			'date' => get_the_date('M j, Y',$post)
    		);
	}
	else{
		$meta_data = array(
			'author' => get_the_author($post),
			'date' => get_the_date('M j, Y',$post)
    	);
		
	}
	$meta_data['date'] = get_the_date('M j, Y',$post->ID);
    return $meta_data;
}
function showpodcast_get_meta($post, $field_name, $request) {
	if($post[ "parent" ]!=0){
		if($post["type"]=='network'){
			$meta_data = array(
				'color' => get_field('color_a',$post[ "parent" ]),
				'logo' => get_field('logo_a',$post[ "parent" ]),
				'permalink' => get_permalink($post[ "parent" ]),
				'name' => get_the_title($post[ "parent" ]),
				'featuring' => get_field('featuring_a',$post[ "parent" ]),
				'date' => get_the_date('M j, Y',$post)
    		);
		}
		else{
			$meta_data = array(
        	'permalink' => get_permalink($post[ "parent" ]),
			'name' => get_the_title($post[ "parent" ]),
			'featuring' => get_field('featuring_a',$post[ "parent" ]),
				'date' => get_the_date('M j, Y',$post)
    	);
		}
		$argns = array(
	'post_type' => $post["type"],
	'menu_order'		=> $post['menu_order']-1,
		);
		$prevp = get_posts( $argns );
		$argns = array(
	'post_type' => $post["type"],
	'menu_order'=> $post['menu_order']+1,
		);
		$nextp = get_posts( $argns );
			
		if($prevp[0]->ID!=$post['parent']){
			$prev = array(
				'permalink' => get_permalink($prevp[0]->ID),
				'name' => get_the_title($prevp[0]->ID)

			);
		}
			else{
				$prev = null;
			}
		if($nextp[0]->post_parent==$post['parent']){
			$next = array(
				'id' => $nextp[0]->ID,
				'permalink' => get_permalink($nextp[0]->ID),
				'name' => get_the_title($nextp[0]->ID)

			);
		}
		else{
			$next = null;		
		}
		$meta_data['prev'] = $prev;
		$meta_data['next'] = $next;
		
		if(get_field('creators',$post[ "parent" ])){
			$meta_data['creators'] = get_field('creators',$post[ "parent" ]);
		}

        $meta_data['add_to_collective'] = get_field('add_to_collective', $post[ "parent" ]) ?? false;
	}
	else{
		$meta_data = null;
	}

    return $meta_data;
}


?>
