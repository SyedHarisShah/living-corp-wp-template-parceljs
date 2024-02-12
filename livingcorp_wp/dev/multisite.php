<?php 

/* 


*/

// -------- MULTISITE FUNCTIONS --------

function site_permalink($post_id = NULL, $site_id = NULL) {
    
    $current_site = get_current_blog_id();
    
    if (!$post_id) {
        $post_id = get_the_ID();
    }
    
    if ($site_id) {
        switch_to_blog($site_id);
    }
    
    $permalink = get_permalink($post_id);
    
    if ($site_id) {
        switch_to_blog($current_site);
    }
    
    return $permalink;
    
}

function is_site($site_id) {
    
    global $blog_id;
    
    $is = false;
    
    if ($blog_id == $site_id) {
        $is = true;
    }
    
    return $is;
    
}


function is_site_page($page_id = NULL, $site_id = NULL) {
    
    $is = false;
    
    $current_site = get_current_blog_id();
    
    if ($site_id) {
        switch_to_blog($site_id);
    }
    
    $is = is_page($page_id);
    
    if ($site_id) {
        switch_to_blog($current_site);
    }
    
    return $is;
    
}

?>