<?php
add_action( 'rest_api_init', function () {
    register_rest_route( 'sdv/content-hub/v1', '/get-actions/', ['methods' => 'GET', 'callback' => 'getActions']);
    register_rest_route( 'sdv/content-hub/v1', '/get-ceos/', ['methods' => 'GET', 'callback' => 'getCEOs']);
    register_rest_route( 'sdv/content-hub/v1', '/get-media/', ['methods' => 'GET', 'callback' => 'getMedia']);
    register_rest_route( 'sdv/content-hub/v1', '/get-resources/', ['methods' => 'GET', 'callback' => 'getResources']);
});

function lc_collective_only_query() {
    return [
        'key' => 'add_to_collective',
        'value' => 1,
        'compare' => '=',
    ];
}

function getActions($request){
	$term = isset($request['term']) ? $request['term'] : '';
	$sortby = $request['sortby'];
    $order = 'DESC';
    $orderby = 'post_date';

    switch($sortby){
        case 'alpha':
            $orderby = 'title';
            $order = 'ASC';
            break;
        default:
            break;
    }

    $collective_only = lc_collective_only_query();

    $args = array(
        'post_type'      => 'network',
        'posts_per_page' => -1,
        'post_parent'    => 0,
        's'              => $term,
        'order'          => $order,
        'orderby'          => $orderby,
        'meta_query' => [
            $collective_only,
        ],
    );

    $network_query = new WP_Query($args);
    
    if ( $network_query->have_posts() ) {
        foreach ( $network_query->posts as $post) {
            $post->permalink=get_permalink($post);
            $post->date = get_the_date('M j, Y',$post);
            $fields = get_fields($post);
        
            foreach($fields as $key=>$f){
                if(str_ends_with($key,'_a')){
                    $post->{$key} = $f;
                    
                }
            }

            // Get the child posts of this network post
            $child_args = array(
                'post_type'      => 'network',
                'posts_per_page' => -1,
                'post_parent'    => $post->ID,
                'order'          => $order,
                'orderby'          => $orderby,
            );
    
            $child_query = new WP_Query( $child_args );

            foreach ( $child_query->posts as $child) {
                $child->permalink=get_permalink($post);
                $child->date = get_the_date('M j, Y',$post);
            }

            $post->children = $child_query->posts;
        }
    }

    // print_r($network_query->posts);

	return new WP_REST_Response($network_query->posts, 200);
}

function getCEOs($request){
	$term = isset($request['term']) ? $request['term'] : '';
	$sortby = $request['sortby'];
    $order = 'DESC';
    $orderby = 'post_date';

    switch($sortby){
        case 'alpha':
            $orderby = 'title';
            $order = 'ASC';
            break;
        default:
            break;
    }

    $args = array(
        'post_type'      => 'ceos',
        'posts_per_page' => -1,
        'post_parent'    => 0,
        's'              => $term,
        'order'          => $order,
        'orderby'          => $orderby,
    );

    $network_query = new WP_Query($args);
    
    if ( $network_query->have_posts() ) {
        foreach ( $network_query->posts as $post) {
            $post->permalink=get_permalink($post);
            $fields = get_fields($post);
        
            foreach($fields as $key=>$f){
                if(str_ends_with($key,'_a')){
                    $post->{$key} = $f;
                }
            }

            foreach ( $post->company_a as $company) {
                $fields = get_fields($company);
        
                foreach($fields as $key=>$f){
                    if(str_ends_with($key,'_a')){
                        $company->{$key} = $f;
                    }
                }
            }
        }
    }

	return new WP_REST_Response($network_query->posts, 200);
}

function getMedia($object) {
	$search = !empty(strtolower($_GET['search'])) ? $_GET['search'] : '';
    $post_type = !empty(strtolower($_GET['post_type'])) ? $_GET['post_type'] : array('post', 'show', 'podcast');

    $return = (object) [
        'post' => array(),
        'search' => $search
    ];

    $search_meta_query = [];

    $collective_only = lc_collective_only_query();

    if (!empty($search)) {
        $search_meta_query = [
            'key' => 'description_a',
            'value' => $search,
            'compare' => 'LIKE',
        ];
    }

    $orderby = 'date';

    $args = array(
        'orderby' => $orderby,
        'post_type' => $post_type,
        'posts_per_page' => 50,
        'post_status' => 'publish',
        'meta_query' => [
            'relation' => 'AND',
            $collective_only,
            $search_meta_query,
        ],
    );
    $argstitle = array(
        'orderby' => $orderby,
        'post_type' => $post_type,
        'posts_per_page' => 50,
        'post_status' => 'publish',
        's' => $search,
        'meta_query' => [
            'relation' => 'AND',
            $collective_only,
        ],
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
    $wp_query->posts = array_unique(array_merge($querys->posts, $queryacf->posts), SORT_REGULAR);
    $wp_query->post_count = count($wp_query->posts);
    if ($wp_query->have_posts()) :
        while ($wp_query->have_posts()) :
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

function getResources($object){
    $return = (object) [
        'posts' => array()
    ];

    $args = array(
        'post_type' => 'resource',
        'posts_per_page' => -1,
        'post_status' => 'publish',

    );
    $wp_query = new WP_query($args);
    if ($wp_query->have_posts()) :
        while ($wp_query->have_posts()) :
            $wp_query->the_post();
            $object = (object) [
                'title' => get_the_title(),
                'description' => get_field('description_a'),
                'image' => get_field('image_a'),
                'id' => get_the_ID(),
                'link' => get_permalink()
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

function sdv_collective_only_acf_relationship( $args, $field, $post_id ) {
    $args['meta_query'] = [lc_collective_only_query()];

    return $args;
}
add_filter('acf/fields/relationship/query/name=list', 'sdv_collective_only_acf_relationship', 10, 3);
