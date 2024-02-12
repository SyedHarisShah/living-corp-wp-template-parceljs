<?php
//ADDING PERMALINK AND ARCHIVE ACF FIELDS
add_filter('acf/rest/format_value_for_rest/type=group', function ($value_formatted, $post_id, $field, $value, $format){
	if($value_formatted){
		foreach($value_formatted as &$post_object){
			if(is_array($post_object)){
				foreach($post_object as &$post){
					if(is_object($post)){
						$post->permalink=get_permalink($post);
						$post->date = get_the_date('M j, Y',$post);
						$fields = get_fields($post);
		
						foreach($fields as $key=>$f){
							if(str_ends_with($key,'_a')){
								$post->{$key} = $f;
								
							}
						}
					}
				}
			}
		}
	}
	return $value_formatted;
}, 10, 5);

add_filter('acf/rest/format_value_for_rest/type=relationship', function ($value_formatted, $post_id, $field, $value, $format){
	if($value_formatted){
	foreach($value_formatted as &$post_object){
		if(is_object($post_object)){
		$post_object->permalink=get_permalink($post_object);
		$post_object->date = get_the_date('M j, Y',$post_object);
		$fields = get_fields($post_object);
		foreach($fields as $key=>$f){
			if(str_ends_with($key,'_a')){
            $post_object->{$key} = $f;
				
			}
		}
		}
	}
	}
	return $value_formatted;
}, 10, 5);

// for ceo network fields
add_filter('acf/rest/format_value_for_rest/type=relationship', function ($value_formatted, $post_id, $field, $value, $format){
	if(!get_post_type($post_id) === 'ceos'){
		return $value_formatted;
	}

	if($value_formatted){
		foreach($value_formatted as &$post_object){
			if(is_object($post_object)){
				$post_object->date = get_the_date('M j, Y',$post_object);
				$fields = get_fields($post_object);
				
				foreach($fields as $key=>$f){
					$post_object->{$key} = $f;
				}
			}
		}
	}

	return $value_formatted;
}, 10, 5);

add_filter('acf/rest/format_value_for_rest/type=repeater', function ($value_formatted, $post_id, $field, $value, $format){
	if($value_formatted){
	$cont=0;
	foreach($value_formatted as $tit=>$post_object){
		$post_object['test'] = $post_object['link']->ID;
		if($post_object['link']){
			
			$post_object['link']->permalink = get_permalink($post_object['link']->ID);
			$fields = get_fields($post_object['link']->ID);
			foreach($fields as $key=>$f){
				if(str_ends_with($key,'_a')){
				$post_object['link']->{$key} = $f;

				}
			}
			
		}
		$value_formatted[$cont]=$post_object;
		$cont++;
	}
	}
	return $value_formatted;
}, 10, 5);

//POST OBJECT
add_filter('acf/rest/format_value_for_rest/type=post_object', function ($value_formatted, $post_id, $field, $value, $format){
	
	$value_formatted->permalink=get_permalink($value_formatted);
	$fields = get_fields($value_formatted);
	foreach($fields as $key=>$f){
			if(str_ends_with($key,'_a')){
            $value_formatted->{$key} = $f;
				
			}
	}
	return $value_formatted;
}, 10, 5);

//ADDING TERMS
function my_plugin_rest_route_for_terms( $route, $term ) {
    if ( $term->taxonomy === 'tipo' ) {
        $route = '/wp/v2/tipos/' . $term->term_id;
    }
 
    return $route;
}
//add_filter( 'rest_route_for_terms', 'my_plugin_rest_route_for_terms', 10, 2 );

//CUSTOM JSON

add_action( 'rest_api_init', function () {
    register_rest_route( 'csskiller/v1', '/options/', array(
        'methods' => 'GET',
        'callback' => 'get_rest_option',
        //'permission_callback' => function () {
        //  return current_user_can( 'administrator' );
        //}
    ) );
} );
	
function get_rest_option( $data ) {
	$fields=get_fields('options');
	if($fields){
		foreach($fields as $f){
			if(is_array($f)){
				foreach($f as $p){
					if(is_object($p)){
						if(get_permalink($p)){
							$p->permalink=get_permalink($p);
						}
					}
				}
			}
		}
	}
	$fields['base'] = get_site_url();
	$fields['home'] = get_permalink(get_option( 'page_on_front' ));
	$fields['template'] = get_template_directory_uri();
	$fields['actualyear'] = date("Y");
	
	
	return $fields;
}
//Añadir orderrand
////http://localhost:8888/awma_dev/wp-json/wp/v2/proyecto/?tipo=11&orderby=rand
add_filter( 'rest_proyecto_collection_params', 'my_prefix_add_rest_orderby_params', 10, 1 );

function my_prefix_add_rest_orderby_params( $params ) {
    $params['orderby']['enum'][] = 'rand';

    return $params;
}


// por si el relation está en un repeater
add_filter('acf/rest/format_value_for_rest/type=repeater', function ($value_formatted, $post_id, $field, $value, $format){
	if($value_formatted){
	foreach($value_formatted as $fieldsdad){
		
		foreach($fieldsdad as $key=>$field){
			if($key=='proyectos'){
				foreach($field as $f){
            	$f->permalink = get_permalink($f->ID);
				$fieldsson = get_fields($f->ID);
				foreach($fieldsson as $keyl=>$l){
					if(str_ends_with($keyl,'_a')){
            		$f->{$keyl} = $l;
				
					}
					}
				}
				
			}
		}
	}
	}
	return $value_formatted;
}, 10, 5);



?>