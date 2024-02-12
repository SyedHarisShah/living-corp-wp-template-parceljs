<?php
add_action( 'rest_api_init', function () {
    register_rest_route( 'sdv/player/v1', '/create-user-playlist/', ['methods' => 'POST', 'callback' => 'createUserPlaylist']);
    register_rest_route( 'sdv/player/v1', '/get-user-playlists/', ['methods' => 'GET', 'callback' => 'getUserPlaylists']);
    register_rest_route( 'sdv/player/v1', '/get-user-playlist/', ['methods' => 'GET', 'callback' => 'getUserPlaylistById']);
    register_rest_route( 'sdv/player/v1', '/add-to-user-playlist/', ['methods' => 'POST', 'callback' => 'addToUserPlaylist']);
    register_rest_route( 'sdv/player/v1', '/remove-from-user-playlist/', ['methods' => 'POST', 'callback' => 'removeFromUserPlaylist']);
    register_rest_route( 'sdv/player/v1', '/edit-user-playlist/', ['methods' => 'POST', 'callback' => 'editUserPlaylist']);
    register_rest_route( 'sdv/player/v1', '/delete-user-playlist/', ['methods' => 'POST', 'callback' => 'deleteUserPlaylist']);
    register_rest_route( 'sdv/player/v1', '/like-podcast/', ['methods' => 'POST', 'callback' => 'likePodcast']);
    register_rest_route( 'sdv/player/v1', '/get-liked-podcasts/', ['methods' => 'GET', 'callback' => 'getLikedPodcasts']);
    register_rest_route( 'sdv/player/v1', '/get-filters/', [ 'methods' => 'GET', 'callback' => 'getPlayerFilters']);
    register_rest_route( 'sdv/player/v1', '/get-playlists/', [ 'methods' => 'GET', 'callback' => 'getPlaylists']);
    register_rest_route( 'sdv/player/v1', '/get-sponsor-playlists/', [ 'methods' => 'GET', 'callback' => 'getSponsorPlaylists']);
    register_rest_route( 'sdv/player/v1', '/get-sponsor-playlists-by-id/', [ 'methods' => 'GET', 'callback' => 'getSponsorPlaylistsByID']);
    register_rest_route( 'sdv/player/v1', '/get-modules/', [ 'methods' => 'GET', 'callback' => 'getModules']);
    register_rest_route( 'sdv/player/v1', '/search-player/', [ 'methods' => 'GET', 'callback' => 'searchPlayer']);
    register_rest_route( 'sdv/player/v1', '/get-playlist/', [ 'methods' => 'GET', 'callback' => 'getPlaylistByID']);
    register_rest_route( 'sdv/player/v1', '/get-module/', [ 'methods' => 'GET', 'callback' => 'getModuleByID']);
    register_rest_route( 'sdv/player/v1', '/track-play/', [ 'methods' => 'GET', 'callback' => 'trackPlay']);
    register_rest_route( 'sdv/player/v1', '/get-sponsor/', [ 'methods' => 'GET', 'callback' => 'sdv_get_sponsor']);
    register_rest_route( 'sdv/player/v1', '/get-sponsor-id/', [ 'methods' => 'GET', 'callback' => 'get_sponsor_by_id']);
    register_rest_route( 'sdv/player/v1', '/check-user-exists/', [ 'methods' => 'GET', 'callback' => 'check_user_exists']);
});

function check_user_exists ($request) {
    $email = isset($request['email']) ? $request['email'] : '';
    $nonce = wp_create_nonce("register_lc_user");

    $existing_user = false;
    
    if(!empty($email)) {
        $user = get_user_by('email', $email);
        if ($user) {
            $acf=get_fields('user_'.$user->ID);
            $existing_user = array('acf'=> $acf,'user' => $user, 'nonce' => $nonce, 'linkedin_id'=> '');
        }
    }

    return $existing_user;
}

function get_sponsor_by_id($request) {
    $sponsor = new stdClass();
    $sponsor->id = 0;

	$email = isset($request['email']) ? $request['email'] : '';
	$spId = isset($request['spId']) ? $request['spId'] : 0;

    $sponsor->email = $email;
    $sponsor->spId = $spId;

    if (!empty($email) && !empty($spId)){
        $args = array(
            'p' => $spId,
            'post_type' => 'sponsor',
            'meta_key' => 'allowed_users',
            'meta_value' => $email,
            'meta_compare' => 'LIKE',
            // 'meta_query' => array(
            //     array(
            //         'key' => 'allowed_users_$_user_email',
            //         'value' => $email,
            //         'compare' => 'LIKE'
            //     )
            // )
        );
        
        $the_query = new WP_Query( $args );
        
        if($the_query->have_posts()) {
            foreach($the_query->posts as $post) {
                $sponsor_id = $post->ID;

                if($sponsor_id){
                    $sponsor->id = $sponsor_id;
                    $sponsor->color = get_field('brand_color', $sponsor_id);
                    $sponsor->icon = get_field('brand_icon', $sponsor_id);
                    $sponsor->logo = get_field('brand_logo', $sponsor_id);
                    $sponsor->banner = get_field('brand_banner_image', $sponsor_id);
                }
            }
        }
    }

    return $sponsor;
}


function sdv_get_sponsor($request) {
	$email = isset($request['email']) ? $request['email'] : '';
	$spId = isset($request['spId']) ? $request['spId'] : 0;
    $sponsor = false;

    if (!empty($email)){
        $email_arr = explode('@', $email);
        $cnt = count($email_arr);
        $domain = $cnt > 0 ? $email_arr[$cnt - 1] : false;

        if(!empty($domain)){
            $args = array(
                'posts_per_page' => 1,
                'post_type' => 'sponsor',
                'meta_key' => 'brand_domains',
                'meta_value' => $domain,
                'meta_compare' => 'LIKE'
            );
            
            $the_query = new WP_Query( $args );
            
            if($the_query->have_posts()) {
                foreach($the_query->posts as $post) {
                    $sponsor_id = $post->ID;

                    if($sponsor_id){
                        $sponsor = new stdClass();
                        $sponsor->id = $sponsor_id;
                        $sponsor->color = get_field('brand_color', $sponsor_id);
                        $sponsor->icon = get_field('brand_icon', $sponsor_id);
                        $sponsor->logo = get_field('brand_logo', $sponsor_id);
                        $sponsor->banner = get_field('brand_banner_image', $sponsor_id);
                    }
                }
            }
        }
    } else if (!empty($spId)) {
        $sponsor = new stdClass();
        $sponsor->id = $spId;
        $sponsor->color = get_field('brand_color', $spId);
        $sponsor->icon = get_field('brand_icon', $spId);
        $sponsor->logo = get_field('brand_logo', $spId);
        $sponsor->banner = get_field('brand_banner_image', $spId);
    }
    
    if (!$sponsor) {
        $sponsor = new stdClass();
        $sponsor->id = 0;
        $sponsor->color = get_field('player_brand_color', 'option');
        $sponsor->icon = get_field('player_brand_icon', 'option');
        $sponsor->logo = get_field('player_brand_logo', 'option');
        $sponsor->banner = get_field('player_banner_image', 'option');
    }

    return $sponsor;
}


function createUserPlaylist($request){
	$userid = $request['userid'];
	$name = $request['name'];
	$user = get_user_by('ID', $userid);

	if(!$user){
		return new WP_REST_Response(['unauthorized'], 401);
	}

    $num = sdv_new_user_playlist_num($userid);

    if(empty($name)){
        $name = 'Custom Playlist #' . ($num + 1);
    }

    $playlist = [
        'name' => $name,
        'podcasts' => [],
    ];

    $key = "playlist_$num";

    update_user_meta($userid, $key, $playlist);

    $upid = sdv_get_user_playlist_id($userid, $key);


	return new WP_REST_Response([$num, $upid], 200);
}

function editUserPlaylist($request){
	$userid = $request['userid'];
	$playlist_key = $request['playlist_key'];
	$name = $request['name'];

	$user = get_user_by('ID', $userid);

	if(!$user){
		return new WP_REST_Response('unauthorized', 401);
	}
    if(!$playlist_key){
		return new WP_REST_Response('no_playlist_key', 401);
	}
    if(!$name){
		return new WP_REST_Response('no_name', 401);
	}

    $user_playlist = get_user_meta($userid, $playlist_key, true);

    if(!$user_playlist){
		return new WP_REST_Response('no_playlist', 401);
	}

    $user_playlist['name'] = $name;

    update_user_meta($userid, $playlist_key, $user_playlist);

	return new WP_REST_Response(true, 200);
}

function deleteUserPlaylist($request){
	$userid = $request['userid'];
	$playlist_key = $request['playlist_key'];
	$user = get_user_by('ID', $userid);

	if(!$user){
		return new WP_REST_Response('unauthorized', 401);
	}

    if(!$playlist_key){
		return new WP_REST_Response('no_playlist_key', 401);
	}

	return new WP_REST_Response(delete_user_meta($userid, $playlist_key), 200);
}


function getUserPlaylists($request){
	$userid = $request['userid'];
	$user = get_user_by('ID', $userid);

    if(!$user){
		return new WP_REST_Response([], 401);
	}

    $playlists = sdv_get_user_playlists($userid);

	return new WP_REST_Response(array_reverse($playlists), 200);
}

function getUserPlaylistById($request){
	$upid = $request['upid'];
	$userid = $request['userid'];
    $catList = isset($request['cats']) ? explode(",", $request['cats']) : [];
    $tagsList = isset($request['tags']) ? explode("|", $request['tags']) : [];
    $topicsList = isset($request['topics']) ? explode("|", $request['topics']) : [];

    $catArgs = sdv_filter_id_arr_to_tax_arg($catList, 'module_categories');
    $tagsArgs = sdv_filter_id_arr_to_tax_arg($tagsList, 'module_tags');
    $topicsArgs = sdv_filter_id_arr_to_tax_arg($topicsList, 'module_topics');

    $taxargs = array_merge($catArgs, $tagsArgs, $topicsArgs);

    global $wpdb;

    $sql = "SELECT meta_value
            FROM $wpdb->usermeta
            WHERE umeta_id = $upid";

    $results = $wpdb->get_col($sql);


    if(count($results) != 1){    
        return new WP_REST_Response(false, 200);
    }

    $playlist = maybe_unserialize($results[0]);

    $post = new stdClass;
    $post->post_title = $playlist['name'];
    $post->modules = [];
    $post->user = true;

    if(!empty($playlist['podcasts'])){    
        $args = [
            'post_type' => 'module',
            'fields' => 'ids',
            'posts_per_page' => -1,
            'meta_query' => [$taxargs],
            'post__in' => $playlist['podcasts'],
        ];
    
        $query = new WP_Query($args);
    
        foreach($query->posts as $id){
            array_push($post->modules, sdv_get_module($id, false, $userid));
        }
    }

	return new WP_REST_Response($post, 200);
}

function addToUserPlaylist($request){
	$userid = $request['userid'];
	$podcast_id = $request['podcast_id'];
	$playlist_key = $request['playlist_key'];
	$user = get_user_by('ID', $userid);

	if(!$user){
		return new WP_REST_Response('unauthorized', 401);
	}
    if(!$podcast_id){
		return new WP_REST_Response('no_podcast', 401);
	}
    if(!$playlist_key){
		return new WP_REST_Response('no_playlist_key', 401);
	}

    $user_playlist = get_user_meta($userid, $playlist_key, true);

    if(!$user_playlist){
		return new WP_REST_Response('no_playlist', 401);
	}

    array_push($user_playlist['podcasts'], $podcast_id);    

    $user_playlist['podcasts'] = array_unique($user_playlist['podcasts']);

    update_user_meta($userid, $playlist_key, $user_playlist);

	return new WP_REST_Response(true, 200);
}

function removeFromUserPlaylist($request){
	$userid = $request['userid'];
	$podcast_id = $request['podcast_id'];
	$playlist_key = $request['playlist_key'];
	$user = get_user_by('ID', $userid);

	if(!$user){
		return new WP_REST_Response('unauthorized', 401);
	}
    if(!$podcast_id){
		return new WP_REST_Response('no_podcast', 401);
	}
    if(!$playlist_key){
		return new WP_REST_Response('no_playlist_key', 401);
	}

    $user_playlist = get_user_meta($userid, $playlist_key, true);

    if(!$user_playlist){
		return new WP_REST_Response('no_playlist', 401);
	}

    if (($key = array_search($podcast_id, $user_playlist['podcasts'])) !== false) {
        unset($user_playlist['podcasts'][$key]);
    }

    $user_playlist['podcasts'] = array_unique($user_playlist['podcasts']);

    update_user_meta($userid, $playlist_key, $user_playlist);

	return new WP_REST_Response(true, 200);
}

function likePodcast($request){
	$userid = $request['userid'];
	$podcast_id = $request['podcast_id'];
	$remove = $request['remove'] === 'true';
	$user = get_user_by('ID', $userid);
    $return = $remove ? 'removed' : 'added';

	if(!$user){
		return new WP_REST_Response('unauthorized', 401);
	}
    if(!$podcast_id){
		return new WP_REST_Response('no_podcast', 401);
	}

    $liked_podcasts = get_user_meta($userid, "liked_podcasts", true);
    $liked_podcasts = $liked_podcasts ? $liked_podcasts : [];

    if($remove){
        $liked_podcasts = array_diff($liked_podcasts, [$podcast_id]);
    }
    else{
        array_push($liked_podcasts, $podcast_id);
    }

    update_user_meta($userid, 'liked_podcasts', $liked_podcasts);

	return new WP_REST_Response($return, 200);
}

function getLikedPodcasts($request){
	$userid = $request['userid'];
	$user = get_user_by('ID', $userid);

    if(!$user){
		return new WP_REST_Response([], 401);
	}

    $perpage = isset($request['perpage']) ? $request['perpage'] : 0;
    $catList = isset($request['cats']) ? explode (",", $request['cats']) : [];
    $tagsList = isset($request['tags']) ? explode ("|", $request['tags']) : [];
    $topicsList = isset($request['topics']) ? explode ("|", $request['topics']) : [];

    $catArgs = sdv_filter_id_arr_to_tax_arg($catList, 'module_categories');
    $tagsArgs = sdv_filter_id_arr_to_tax_arg($tagsList, 'module_tags');
    $topicsArgs = sdv_filter_id_arr_to_tax_arg($topicsList, 'module_topics');

    $taxargs = array_merge($catArgs, $tagsArgs, $topicsArgs);
    $liked_podcasts = get_user_meta($userid, "liked_podcasts", true);
    $liked_podcasts = !empty($liked_podcasts) ? $liked_podcasts : [];

    $modules = [];

    if(!empty($liked_podcasts)){
        $args = [
            'post_type' => 'module',
            'fields' => 'ids',
            'posts_per_page' => $perpage,
            'meta_query' => [$taxargs],
            'post__in' => $liked_podcasts,
            'orderby' => 'post__in',
        ];

        $query = new WP_Query($args);
    
        foreach($query->posts as $id){
            array_push($modules, sdv_get_module($id, true, $userid));
        }
    }

	return new WP_REST_Response(array_reverse($modules), 200);
}

class ModuleFilterHelper {
    const POPULAR_CATS_KEY = "player_popular_cats";
    const POPULAR_TAGS_KEY = "player_popular_tags";
    const POPULAR_TOPICS_KEY = "player_popular_topics";

    static function updatePopularFilters() {
        $limit = get_field('filter_limit', 'option') ?? 6;
        
        $cats = self::determinePopularCats($limit);
        update_option(self::POPULAR_CATS_KEY, $cats);

        $tags = self::determinePopularTags($limit);
        update_option(self::POPULAR_TAGS_KEY, $tags);

        $topics = self::determinePopularTopics($limit);
        update_option(self::POPULAR_TOPICS_KEY, $topics);
    }

    static function determinePopularCats($limit) {
        global $wpdb;
        $meta_key = 'module_categories';

        $query = "
            SELECT pm.meta_value 
            FROM $wpdb->postmeta pm
            INNER JOIN $wpdb->posts p ON p.ID = pm.post_id
            WHERE pm.meta_key = %s AND p.post_status = 'publish'
        ";

        $results = $wpdb->get_col($wpdb->prepare($query, $meta_key));

        if (!empty($results)) {
            $values = [];

            foreach ($results as $result) {
                if(empty($result)){
                    continue;
                }

                $split_values = array_map('trim', explode(',', $result));

                foreach ($split_values as $value) {
                    if (!isset($values[$value])) {
                        $values[$value] = 0;
                    }
                    $values[$value]++;
                }
            }

            // Sort by count in descending order
            arsort($values);

            // Get the 6 most common values
            $common_values = array_slice($values, 0, $limit, true);

            $final_cats = [];
            foreach ($common_values as $val => $cnt) {
                if(empty($val)) {
                    continue;
                }
                $final_cats[] = ['id' => $val, 'name' => $val];
            }

        } else {
            $final_cats = [];
        }
        
        return $final_cats;
    }

    static function determinePopularTags($limit) {
        global $wpdb;
        $meta_key = 'module_tags';

        $query = "
            SELECT pm.meta_value 
            FROM $wpdb->postmeta pm
            INNER JOIN $wpdb->posts p ON p.ID = pm.post_id
            WHERE pm.meta_key = %s AND p.post_status = 'publish'
        ";

        $results = $wpdb->get_col($wpdb->prepare($query, $meta_key));

        if (!empty($results)) {
            $values = [];

            foreach ($results as $result) {
                if(empty($result)){
                    continue;
                }

                $split_values = array_map('trim', explode('|', $result));

                foreach ($split_values as $value) {
                    if (!isset($values[$value])) {
                        $values[$value] = 0;
                    }
                    $values[$value]++;
                }
            }

            // Sort by count in descending order
            arsort($values);

            // Get the 6 most common values
            $common_values = array_slice($values, 0, $limit, true);

            $final_tags = [];
            foreach ($common_values as $val => $cnt) {
                if(empty($val)) {
                    continue;
                }
                $final_tags[] = ['id' => $val, 'name' => $val];
            }

        } else {
            $final_tags = [];
        }
        
        
        return $final_tags;
    }

    static function determinePopularTopics($limit) {
        global $wpdb;
        $meta_key = 'module_topics';

        $query = "
            SELECT pm.meta_value 
            FROM $wpdb->postmeta pm
            INNER JOIN $wpdb->posts p ON p.ID = pm.post_id
            WHERE pm.meta_key = %s AND p.post_status = 'publish'
        ";

        $results = $wpdb->get_col($wpdb->prepare($query, $meta_key));

        if (!empty($results)) {
            $values = [];

            foreach ($results as $result) {
                if(empty($result)){
                    continue;
                }

                $split_values = array_map('trim', explode('|', $result));

                foreach ($split_values as $value) {
                    if (!isset($values[$value])) {
                        $values[$value] = 0;
                    }
                    $values[$value]++;
                }
            }

            // Sort by count in descending order
            arsort($values);

            // Get the 6 most common values
            $common_values = array_slice($values, 0, $limit, true);

            $final_topics = [];
            foreach ($common_values as $val => $cnt) {
                if(empty($val)) {
                    continue;
                }
                $final_topics[] = ['id' => $val, 'name' => $val];
            }

        } else {
            $final_topics = [];
        }
        
        
        return $final_topics;
    }

    static function getPopularCats(){
        return get_option(self::POPULAR_CATS_KEY, []);
    }

    static function getPopularTags(){
        return get_option(self::POPULAR_TAGS_KEY, []);
    }

    static function getPopularTopics(){
        return get_option(self::POPULAR_TOPICS_KEY, []);
    }

    static function formatSavedFilters($post_id) {
        $post = get_post($post_id);

        if($post->post_type !== 'module'){
            return;
        }
        
        self::formatString('module_categories', ',', $post_id);
        self::formatString('module_tags', '|', $post_id);
        self::formatString('module_topics', '|', $post_id);
        self::formatString('module_related', '|', $post_id);
    }

    static function formatString($meta_key, $delimiter, $post_id) {
        // get string from acf field
        $str = get_field($meta_key, $post_id);

        if (empty($str)){
            return;
        }

        // Split the string by the delimiter
        $parts = explode($delimiter, $str);
    
        // Trim spaces around each part
        foreach($parts as $key => $part) {
            $parts[$key] = trim($part);
        }
    
        // Join the parts back together with the delimiter
        $str = implode($delimiter, $parts);
    
        // Add the delimiter to the end if it doesn't exist
        if (substr($str, -strlen($delimiter)) != $delimiter) {
            $str .= $delimiter;
        }
    
        update_post_meta($post_id, $meta_key, $str);
    }
}

function sdv_update_popular_filters($post_id){
    $post_type = get_post_type($post_id);

    if($post_type === 'module') {
        ModuleFilterHelper::updatePopularFilters();
    }
}

add_action('post_updated', 'sdv_update_popular_filters');

function sdv_acf_update_filter_limit($value) {
    ModuleFilterHelper::updatePopularFilters();

    return $value;
}

add_filter('acf/update_value/name=filter_limit', 'sdv_acf_update_filter_limit');

function getPlayerFilters($request){
    $cats = ModuleFilterHelper::getPopularCats();
    $tags = ModuleFilterHelper::getPopularTags();
    $topics = ModuleFilterHelper::getPopularTopics();

	$arr = [
        "cats" => $cats,
        "tags" => $tags,
        "topics" => $topics,
    ];
    
	return new WP_REST_Response($arr, 200);
}

// GET multiple playlists using wp_query
function getPlaylists($request){
    $perpage = isset($request['perpage']) ? $request['perpage'] : 0;

    // no filters for this yet
    $args = [
        'post_type' => 'playlist',
        'fields' => 'ids',
        'posts_per_page' => $perpage,
    ];

    $query = new WP_Query($args);
    $playlists = [];

    foreach($query->posts as $id){
        array_push($playlists, sdv_get_playlist($id, true, true));
    }

    return new WP_REST_Response($playlists, 200);
}

function getSponsorPlaylists($request){
    $email = isset($request['email']) ? $request['email'] : '';
    $perpage = isset($request['perpage']) ? $request['perpage'] : 0;
    $args = [];
    $sponsors = [];

    if (!empty($email)){
        $email_arr = explode('@', $email);
        $cnt = count($email_arr);
        $domain = $cnt > 0 ? $email_arr[$cnt - 1] : false;

        if(!empty($domain)){
            $args = array(
                'post_type' => 'sponsor',
                'meta_key' => 'brand_domains',
                'meta_value' => $domain,
                'meta_compare' => 'LIKE'
            );
        }
    } else {
        $args = array(
            'post_type' => 'sponsor'
        );
    }

    $sponsorQuery = new WP_Query($args);

    foreach($sponsorQuery->posts as $sponsor){
        $playlists = [];

        $args = [
            'posts_per_page' => $perpage,
            'post_type' => 'playlist',
            'meta_key'      => 'sponsor',
            'meta_value'    => $sponsor->ID
        ];

        $playlistQuery = new WP_Query($args);

        foreach($playlistQuery->posts as $playlist){
            $playlist->img = sdv_get_image($playlist->ID);
            $playlist->link = get_permalink($playlist->ID);
            array_push($playlists, $playlist);
        }

        $sponsor->playlists = $playlists;

        array_push($sponsors, $sponsor);
    }

    return new WP_REST_Response($sponsors, 200);
}

function getSponsorPlaylistsByID($request){
    $email = isset($request['email']) ? $request['email'] : '';
    $spId = isset($request['spId']) ? $request['spId'] : 0;
    $perpage = isset($request['perpage']) ? $request['perpage'] : 0;
    $args = [];
    $sponsors = [];

    if (!empty($email) && !empty($spId)){
        $args = array(
            'p' => $spId,
            'post_type' => 'sponsor',
        );
    } else {
        $args = array(
            'post_type' => 'sponsor'
        );
    }

    $sponsorQuery = new WP_Query($args);

    foreach($sponsorQuery->posts as $sponsor){
        $playlists = [];

        $args = [
            'posts_per_page' => $perpage,
            'post_type' => 'playlist',
            'meta_key'      => 'sponsor',
            'meta_value'    => $sponsor->ID
        ];

        $playlistQuery = new WP_Query($args);

        foreach($playlistQuery->posts as $playlist){
            $playlist->img = sdv_get_image($playlist->ID);
            $playlist->link = get_permalink($playlist->ID);
            array_push($playlists, $playlist);
        }

        $sponsor->playlists = $playlists;

        array_push($sponsors, $sponsor);
    }

    return new WP_REST_Response($sponsors, 200);
}

// GET multiple modules using wp_query
function getModules($request){
	$userid = $request['userid'];
    $popular = isset($request['popular']) ? $request['popular'] : false;
    $perpage = isset($request['perpage']) ? $request['perpage'] : -1;
    $catList = isset($request['cats']) ? explode (",", $request['cats']) : [];
    $tagsList = isset($request['tags']) ? explode ("|", $request['tags']) : [];
    $topicsList = isset($request['topics']) ? explode ("|", $request['topics']) : [];
    
    $catArgs = sdv_filter_id_arr_to_tax_arg($catList, 'module_categories');
    $tagsArgs = sdv_filter_id_arr_to_tax_arg($tagsList, 'module_tags');
    $topicsArgs = sdv_filter_id_arr_to_tax_arg($topicsList, 'module_topics');

    $taxargs = array_merge($catArgs, $tagsArgs, $topicsArgs);

    $meta_query = array_merge(['relation' => 'OR'], $taxargs);

    $args = [
        'post_type' => 'module',
        'fields' => 'ids',
        'posts_per_page' => $perpage,
        'meta_query' => $meta_query
    ];

    if($popular){
        $args['orderby'] = 'meta_value_num';
        $args['meta_key'] = 'module_plays';
    }

    $query = new WP_Query($args);
    $modules = [];

    foreach($query->posts as $id){
        array_push($modules, sdv_get_module($id, true, $userid));
    }

    return new WP_REST_Response($modules, 200);
}

function searchPlayer($request){
    global $wpdb;
	$userid = $request['userid'];
    $term = isset($request['term']) ? trim($request['term']) : '';
    $tax = isset($request['tax']) ? trim($request['tax']) : false;
    $perpage = isset($request['perpage']) ? $request['perpage'] : 0;
    $catList = isset($request['cats']) ? explode (",", $request['cats']) : [];
    $tagsList = isset($request['tags']) ? explode ("|", $request['tags']) : [];
    $topicsList = isset($request['topics']) ? explode ("|", $request['topics']) : [];
    // $mergeList = array_merge($catList, $tagsList, $topicsList);

    $catArgs = sdv_filter_id_arr_to_tax_arg($catList, 'module_categories');
    $tagsArgs = sdv_filter_id_arr_to_tax_arg($tagsList, 'module_tags');
    $topicsArgs = sdv_filter_id_arr_to_tax_arg($topicsList, 'module_topics');
    $module_tax_cat_args = [];
    $module_tax_tag_args = [];
    $module_tax_topic_args = [];

    if ($tax) {
        // search only tax 
        switch ($tax) {
            case "cat":
                $module_tax_cat_args = sdv_filter_id_arr_to_tax_arg([$term], 'module_categories');
                break;
            case "tag":
                $module_tax_tag_args = sdv_filter_id_arr_to_tax_arg([$term], 'module_tags');
                break;
            case "topic":
                $module_tax_topic_args = sdv_filter_id_arr_to_tax_arg([$term], 'module_topics');
                break;
            default:
                break;
        }
    }

    $taxargs = array_merge($catArgs, $tagsArgs, $topicsArgs, $module_tax_cat_args, $module_tax_tag_args, $module_tax_topic_args);

    $posts = [];

    $search_term = $wpdb->esc_like($term);
    $sql_query = $wpdb->prepare(
        "SELECT ID FROM {$wpdb->prefix}posts 
        WHERE post_type = 'module'
        AND post_status = 'publish'
        AND ( post_title RLIKE %s
        OR post_title RLIKE %s
        OR post_title RLIKE %s
        OR post_title RLIKE %s
        OR post_content RLIKE %s
        OR post_content RLIKE %s
        OR post_content RLIKE %s
        OR post_content RLIKE %s)", 
        '^'.$search_term.'$',
        '^'.$search_term.'[[:space:][:punct:]]',
        '[[:space:][:punct:]]'.$search_term.'[[:space:][:punct:]]',
        '[[:space:][:punct:]]'.$search_term.'$',
        '^'.$search_term.'$',
        '^'.$search_term.'[[:space:][:punct:]]',
        '[[:space:][:punct:]]'.$search_term.'[[:space:][:punct:]]',
        '[[:space:][:punct:]]'.$search_term.'$',
    );

    $title_ids = $wpdb->get_col($sql_query);

    if(count($taxargs) > 0) {
        $args = [
            'post_type' => 'module',
            'fields' => 'ids',
            'post_status' => 'publish',
            'posts_per_page' => $perpage,
            'meta_query' => [
                'relation' => 'OR',
                [$taxargs],
                [
                    'key' => 'module_transcript',
                    'value' => '^'.$term.'[[:space:][:punct:]]',
                    'compare' => 'RLIKE',
                ],
                [
                    'key' => 'module_transcript',
                    'value' => '[[:space:][:punct:]]'.$term.'[[:space:][:punct:]]',
                    'compare' => 'RLIKE',
                ],
                [
                    'key' => 'module_transcript',
                    'value' => '[[:space:][:punct:]]'.$term.'$',
                    'compare' => 'RLIKE',
                ],
                [
                    'key' => 'module_transcript',
                    'value' => '^'.$term.'$',
                    'compare' => 'RLIKE',
                ],
                [
                    'key' => 'module_summary',
                    'value' => '^'.$term.'[[:space:][:punct:]]',
                    'compare' => 'RLIKE',
                ],
                [
                    'key' => 'module_summary',
                    'value' => '[[:space:][:punct:]]'.$term.'[[:space:][:punct:]]',
                    'compare' => 'RLIKE',
                ],
                [
                    'key' => 'module_summary',
                    'value' => '[[:space:][:punct:]]'.$term.'$',
                    'compare' => 'RLIKE',
                ],
                [
                    'key' => 'module_summary',
                    'value' => '^'.$term.'$',
                    'compare' => 'RLIKE',
                ]
            ],
        ];
        $tax_query = new WP_Query($args);

        $posts = array_unique(array_merge($tax_query->posts, $title_ids));

    } else {
        $transcript_args = array(
            // 'post__in' => $query->posts,
            'post_type' => 'module',
            'fields' => 'ids',
            'posts_per_page' => $perpage,
            'post_status' => 'publish',
            'meta_query' => [
                'relation' => 'OR',
                [
                    'key' => 'module_transcript',
                    'value' => '^'.$term.'[[:space:][:punct:]]',
                    'compare' => 'RLIKE',
                ],
                [
                    'key' => 'module_transcript',
                    'value' => '[[:space:][:punct:]]'.$term.'[[:space:][:punct:]]',
                    'compare' => 'RLIKE',
                ],
                [
                    'key' => 'module_transcript',
                    'value' => '[[:space:][:punct:]]'.$term.'$',
                    'compare' => 'RLIKE',
                ],
                [
                    'key' => 'module_transcript',
                    'value' => '^'.$term.'$',
                    'compare' => 'RLIKE',
                ],
                [
                    'key' => 'module_summary',
                    'value' => '^'.$term.'[[:space:][:punct:]]',
                    'compare' => 'RLIKE',
                ],
                [
                    'key' => 'module_summary',
                    'value' => '[[:space:][:punct:]]'.$term.'[[:space:][:punct:]]',
                    'compare' => 'RLIKE',
                ],
                [
                    'key' => 'module_summary',
                    'value' => '[[:space:][:punct:]]'.$term.'$',
                    'compare' => 'RLIKE',
                ],
                [
                    'key' => 'module_summary',
                    'value' => '^'.$term.'$',
                    'compare' => 'RLIKE',
                ],
                [
                    'key' => 'module_categories',
                    'value' => '[,]'.$term.'[,]',
                    'compare' => 'RLIKE',
                ],
                [
                    'key' => 'module_categories',
                    'value' => '^'.$term.'[,]',
                    'compare' => 'RLIKE',
                ],
                [
                    'key' => 'module_tags',
                    'value' => '[|]'.$term.'[|]',
                    'compare' => 'RLIKE',
                ],
                [
                    'key' => 'module_tags',
                    'value' => '^'.$term.'[|]',
                    'compare' => 'RLIKE',
                ],
                [
                    'key' => 'module_topics',
                    'value' => '[|]'.$term.'[|]',
                    'compare' => 'RLIKE',
                ],
                [
                    'key' => 'module_topics',
                    'value' => '^'.$term.'[|]',
                    'compare' => 'RLIKE',
                ],
            ],
        );

        $transcript_query = new WP_Query($transcript_args);
        $posts = array_unique(array_merge($transcript_query->posts, $title_ids));
    }

    $modules = [];

    foreach($posts as $id){
        array_push($modules, sdv_get_module($id, true, $userid));
    }

    return new WP_REST_Response($modules, 200);
}

// GET playlist by id
function getPlaylistByID($request){
	$userid = $request['userid'];
    $id = isset($request['id']) ? $request['id'] : 0;
    $catList = isset($request['cats']) ? explode (",", $request['cats']) : [];
    $tagsList = isset($request['tags']) ? explode ("|", $request['tags']) : [];
    $topicsList = isset($request['topics']) ? explode ("|", $request['topics']) : [];

    $catArgs = sdv_filter_id_arr_to_tax_arg($catList, 'module_categories');
    $tagsArgs = sdv_filter_id_arr_to_tax_arg($tagsList, 'module_tags');
    $topicsArgs = sdv_filter_id_arr_to_tax_arg($topicsList, 'module_topics');

    $taxargs = array_merge($catArgs, $tagsArgs, $topicsArgs);


    $post = sdv_get_playlist($id, false, true, $userid, $taxargs);


    if(!$post){    
        return new WP_REST_Response(false, 200);
    }

    $post->modules = array_filter($post->modules, function ($x) { return $x['module']; });
    $post->modules = array_map(function ($x) { return $x['module']; }, $post->modules);

    return new WP_REST_Response($post, 200);
}

// GET module by id
function getModuleByID($request){
	$userid = $request['userid'];
    $id = isset($request['id']) ? $request['id'] : 0;
    $post = sdv_get_module($id, false, $userid);

    if(!$post){
        return new WP_REST_Response(false, 200);
    }

    return new WP_REST_Response($post, 200);
}

// GET module by id
function trackPlay($request){
    $id = isset($request['id']) ? $request['id'] : 0;
    $post = get_post($id);

    // post_type is not playlist
    if(!$post || $post->post_type !== 'module'){    
        return new WP_REST_Response(false, 200);
    }

    sdv_set_plays($id);

    return new WP_REST_Response(true, 200);
}

// utils
function sdv_get_user_playlists($userid) {
    global $wpdb;

    $sql = "SELECT meta_key, meta_value
            FROM $wpdb->usermeta
            WHERE meta_key LIKE 'playlist_%' AND user_id=$userid";

    $results = $wpdb->get_results($sql);

    $playlists = array();

    foreach ($results as $row) {
        $upid = sdv_get_user_playlist_id($userid, $row->meta_key);
        $playlist = maybe_unserialize($row->meta_value);
        $playlist['post_title'] = $playlist['name'];
        $playlist['modules'] = count($playlist['podcasts']);
        $playlist['img'] = get_field('default_player_image', 'option');
        $playlist['link'] = "/playlist/?upid=$upid";
        $playlist['user'] = true;
        $playlists[$row->meta_key] = $playlist;
    }
    
    return $playlists;
}

function sdv_get_user_playlist_id($userid, $meta_key) {
    global $wpdb;

    $sql = "SELECT umeta_id
            FROM $wpdb->usermeta
            WHERE meta_key LIKE '$meta_key' AND user_id=$userid";

    $umeta_id = $wpdb->get_col($sql);

    return $umeta_id[0];
}

function sdv_new_user_playlist_num($userid) {
    global $wpdb;

    $sql = "SELECT meta_key
            FROM $wpdb->usermeta
            WHERE meta_key LIKE 'playlist_%' AND user_id=$userid";

    $meta_keys = $wpdb->get_col($sql);

    if(count($meta_keys) > 0){
        $string = end($meta_keys);
        $num = intval(substr($string, 9)) + 1;
    }
    else{
        $num = 0;
    }

    return $num;
}

function sdv_filter_id_arr_to_tax_arg($arr, $key){
    $taxarg = [];

    $delimiter = strpos($key, "cat") !== false ? ',' : '|';

    foreach($arr as $id){
        if(empty($id)){
            continue;
        }

        array_push($taxarg, ['key' => $key, 'value' => $id.$delimiter, 'compare' => 'LIKE']);
    }

    return $taxarg;
}

function sdv_get_playlist($id, $ignoreModules = false, $ignoreSponsor = false, $userid = 0, $taxargs = null){
    $post = get_post($id);

    // post_type is not playlist
    if($post->post_type !== 'playlist'){    
        return false;
    }

    $post->modules = get_field('playlist', $id);
    $post->sponsor = get_field('sponsor', $id);
    $post->img = sdv_get_image($id);
    $post->link = get_permalink($id);

    $query = null;
    
    if($taxargs){
        $ids = array_map(function($obj) { return $obj['module']->ID;}, $post->modules);

        if(count($ids) > 0){
            $args = [
                'post_type' => 'module',
                'fields' => 'ids',
                'posts_per_page' => -1,
                'meta_query' => [$taxargs],
                'post__in' => $ids,
            ];
        
            $query = new WP_Query($args);
        }
    }

    if(!$ignoreModules){
        for ($i = 0; $i < count($post->modules); $i++) {
            $module = $post->modules[$i];
            $moduleID = $module['module']->ID;

            if(!$taxargs || in_array($moduleID, $query->posts)) {
                $module['module']->byline = get_field('module_byline', $moduleID) ?? '';
                $module['module']->summary = get_field('module_summary', $moduleID) ?? '';
                $module['module']->transcript = get_field('module_transcript', $moduleID) ?? '';
                $module['module']->img = sdv_get_image($moduleID);
                $module['module']->src = get_field('module_src', $moduleID);
                $liked_podcasts = get_user_meta($userid, "liked_podcasts", true);
                $module['module']->liked = in_array($moduleID, $liked_podcasts);
                $module['module']->plays = sdv_get_plays($moduleID);
                $module['module']->link = get_permalink($moduleID);
                $module['module']->duration = sdv_get_length($moduleID);
            }
            else{
                unset($post->modules[$i]);
            }
        }
    } else {
        $post->modules = array_filter($post->modules, function ($x) { return $x['module']; });
        $post->modules = count($post->modules);// just put module count
    }

    if(!$ignoreSponsor){
        $post->sponsor = get_post($post->sponsor);
    }

    return $post;
}

function sdv_name_to_tax_obj($arr){
    $arr = array_filter($arr, function ($x) {
        return !empty($x); 
    });

    return array_map(function ($x) {
        return [
            'term_id' => $x,
            'name' => $x
        ]; 
    }, $arr);
}

function sdv_name_to_post_obj($arr){
    $arr = array_filter($arr, function ($x) {
        return !empty($x); 
    });

    return array_map(function ($x) {
        return [
            'ID' => $x,
            'post_title' => $x
        ]; 
    }, $arr);
}

function sdv_get_module($id, $ignoreTax = false, $userid){
    $post = get_post($id);

    // post_type is not playlist
    if($post->post_type !== 'module'){    
        return false;
    }

    $post->byline = get_field('module_byline', $id) ?? '';
    $post->summary = get_field('module_summary', $id) ?? '';
    $post->transcript = get_field('module_transcript', $id) ?? '';
    $post->src = get_field('module_src', $id);
    $post->img = sdv_get_image($id);
    $post->plays = sdv_get_plays($id);
    if(!is_null($userid) && $userid !== 'undefined') {
        $liked_podcasts = get_user_meta($userid, "liked_podcasts", true);
        $post->liked = in_array($id, $liked_podcasts);
    }
    $post->link = get_permalink($id);
    $post->duration = sdv_get_length($id);
    // $post->related = get_field('module_related', $id);
    $related_topics = get_field('module_related', $id);
    $topicsList = isset($related_topics) ? explode("|", $related_topics) : [];

    $limit = 6;

    $relatedArgs = sdv_filter_id_arr_to_tax_arg($topicsList, 'module_topics');
    $meta_query = array_merge(['relation' => 'OR'], $relatedArgs);

    $args = array(
        'posts_per_page' => $limit,
        'post_type' => 'module',
        'post__not_in' => [$id],
        'meta_query' => [$relatedArgs],
        'meta_query' => $meta_query
    );

    $query = new WP_Query($args);

    $post->related = $query->have_posts() ? $query->posts : [];


    foreach($post->related as $relative){
        $relative->img = sdv_get_image($relative->ID);
        $relative->link = get_permalink($relative->ID);
    }

    if(!$ignoreTax){
        $post->cats = explode(',', get_field('module_categories', $id) ?? '');
        $post->cats = sdv_name_to_tax_obj($post->cats);

        $post->tags = explode('|', get_field('module_tags', $id) ?? '');
        $post->tags = sdv_name_to_post_obj($post->tags);

        $post->topics = explode('|', get_field('module_topics', $id) ?? '');
        $post->topics = sdv_name_to_post_obj($post->topics);
    }

    //add analytics play, time etc

    return $post;
}

function sdv_get_image($id){
    $img = get_the_post_thumbnail_url($id);
    $img = $img ? $img : get_field('default_player_image', 'option');

    return $img;
}

// plays
function sdv_get_plays($id = 0) {
    $id = !empty($id) ? $id : get_the_ID();
    $count = get_post_meta($id, 'module_plays', true);
    $count = !empty($count) ? $count : 0;

    return $count;
}

function sdv_set_plays($id = 0) {
    $id = !empty($id) ? $id : get_the_ID();
    $count = (int) get_post_meta($id, 'module_plays', true);
    $count++;

    update_post_meta($id, 'module_plays', $count);
}

function sdv_column_views_plays($columns, $post_type) {
    if($post_type === 'module') {
        $columns['post_plays'] = 'Plays';
    }

    return $columns;
}

add_filter('manage_posts_columns', 'sdv_column_views_plays', 10, 2);

function sdv_custom_column_views_plays( $column ) {
    if($column === 'post_plays') {
        $count = sdv_get_plays();
        echo "$count plays";
    }
}

add_action('manage_posts_custom_column', 'sdv_custom_column_views_plays');

// length
function sdv_get_length($id = 0) {
    $id = !empty($id) ? $id : get_the_ID();
    $length = get_post_meta($id, 'module_length', true);
    $length = !empty($length) ? $length : 0;

    return $length;
}

function sdv_update_time_on_save($post_id) {
    $post = get_post($post_id);

    if($post->post_type !== 'module'){
        return;
    }

    $mp3_url = get_field('module_src', $post_id);

    if(empty($mp3_url)){
        return;
    }

    $headers = get_headers($mp3_url, true);
    
    if (isset($headers['Content-Length'])) {
        $file_size = $headers['Content-Length'];
    }
    
    if (isset($headers['Content-Type']) && strpos($headers['Content-Type'], 'audio/') !== false) {
        $bitrate = isset($headers['Bitrate']) ? $headers['Bitrate'] : 0;
        $bitrate = !empty($bitrate) ? $bitrate : 120;
        $duration = round($file_size / ($bitrate * 1000 / 8)); // duration in seconds

        update_post_meta($post_id, 'module_length', $duration);
    }
}

add_action('save_post', 'sdv_update_time_on_save');
add_action('vg_sheet_editor/save_rows/after_saving_post', 'sdv_update_time_on_save');

function sdv_set_plays_on_save($post_id) {
    $post = get_post($post_id);

    if($post->post_type !== 'module'){
        return;
    }

    if (!get_post_meta($post_id, 'module_plays', true)) {
        update_post_meta($post_id, 'module_plays', 0);
    }
}

add_action('save_post', 'sdv_set_plays_on_save');
add_action('vg_sheet_editor/save_rows/after_saving_post', 'sdv_set_plays_on_save');

function sdv_set_process_filters($post_id) {
    ModuleFilterHelper::formatSavedFilters($post_id);
}

add_action('save_post', 'sdv_set_process_filters');
add_action('vg_sheet_editor/save_rows/after_saving_post', 'sdv_set_process_filters');

function sdv_column_views_length($columns, $post_type) {
    if($post_type === 'module') {
        $columns['post_length'] = 'Length';
    }

    return $columns;
}

add_filter('manage_posts_columns', 'sdv_column_views_length', 10, 2);

function sdv_custom_column_views_length( $column ) {
    if($column === 'post_length') {
        $duration = sdv_get_length();
        
        echo gmdate("H:i:s", $duration);
    }
}

add_action('manage_posts_custom_column', 'sdv_custom_column_views_length');
