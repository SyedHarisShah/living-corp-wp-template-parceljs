<?php


// --------  FUNCTIONS FOR WPML LANGUAGES --------

function lang() {

    return ICL_LANGUAGE_CODE;

}

function lang_permalink($post_id = NULL, $lang = NULL) {

    global $sitepress;

    if ($lang) {
        $language = $lang;
    } else {
        $language = ICL_LANGUAGE_CODE;
    }

    $lang_post_id = icl_object_id($post_id , 'page', true, $language);

    if ($post_id && $lang_post_id != 0) {
        $url = get_permalink($lang_post_id);
    } else {
        $url = $sitepress->language_url($language);
    }

    echo $url;

}


function lang_permalinkR($post_id = NULL, $lang = NULL) {

    global $sitepress;

    if ($lang) {
        $language = $lang;
    } else {
        $language = ICL_LANGUAGE_CODE;
    }

    $lang_post_id = icl_object_id($post_id , 'page', true, $language);

    if ($post_id && $lang_post_id != 0) {
        $url = get_permalink($lang_post_id);
    } else {
        $url = $sitepress->language_url($language);
    }

    return $url;

}

function lang_title($post_id = NULL, $lang = NULL) {

    global $sitepress;

    if ($lang) {
        $language = $lang;
    } else {
        $language = ICL_LANGUAGE_CODE;
    }

    $lang_post_id = icl_object_id($post_id , 'page', true, $language);

    if ($post_id && $lang_post_id != 0) {
        $url = get_the_title($lang_post_id); 
    } else {
        $url = $sitepress->language_url($language);
    }

    echo $url;

}

function lang_url($lang = NULL) {

    global $sitepress;
    $post_id = get_the_ID();

    if ($lang) {
            $language = $lang;
        } else {
            $language = ICL_LANGUAGE_CODE;
        }

    $url = $sitepress->language_url($language);

    if (!is_front_page()) {
        $lang_post_id = icl_object_id($post_id , 'page', true, $language);

        if ($lang_post_id != 0) {
            $url = get_permalink($lang_post_id);
        }
    }

    echo $url;

}

function _t($string) {

    $string = explode('[', substr($string, 1));
    $language = ICL_LANGUAGE_CODE;
    $text = 'translate systax error';

    foreach($string as $str) {
        $aux = explode(']', $str);
        if ($language == substr($aux[0], -2)) {
            $text = $aux[1];
        }
    }

    echo $text;

}

function icl_post_languages(){
    $languages = icl_get_languages('skip_missing=1');
    if(1 < count($languages)){
        foreach($languages as $l){
            if (lang()==$l['code'])
            {
            $langs[] =  '<li class="select"><a href="'.$l['url'].'"><img src="'.get_template_directory_uri().'/images/'.$l['code'].'.svg"/></a></li>';
            }
            else
            {
            $langs[] =  '<li><a href="'.$l['url'].'"><img src="'.get_template_directory_uri().'/images/'.$l['code'].'.svg"/></a></li>';
            }
        }

        echo join(' ', $langs);
    }
}

?>
