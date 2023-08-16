<?php


// --------  ACF --------
acf_add_local_field_group(array(
	'key' => 'group_5c139b99307e0',
	'title' => 'Image group',
	'fields' => array(
		array(
			'key' => 'field_5c13a0e1f50bc',
			'label' => 'Note',
			'name' => '',
			'type' => 'message',
			'instructions' => '',
			'required' => 0,
			'conditional_logic' => 0,
			'wrapper' => array(
				'width' => '',
				'class' => '',
				'id' => '',
			),
			'message' => 'Standard image must exist always, responsive image will show < 768',
			'new_lines' => 'wpautop',
			'esc_html' => 0,
		),
		array(
			'key' => 'field_5c139c13fd895',
			'label' => 'Standard image',
			'name' => 'lg',
			'type' => 'image',
			'instructions' => '',
			'required' => 0,
			'conditional_logic' => 0,
			'wrapper' => array(
				'width' => '',
				'class' => '',
				'id' => '',
			),
			'return_format' => 'array',
			'preview_size' => 'thumbnail',
			'library' => 'all',
			'min_width' => '',
			'min_height' => '',
			'min_size' => '',
			'max_width' => '',
			'max_height' => '',
			'max_size' => '',
			'mime_types' => '',
		),
		array(
			'key' => 'field_5c139c22fd896',
			'label' => 'Responsive image',
			'name' => 'xs',
			'type' => 'image',
			'instructions' => '',
			'required' => 0,
			'conditional_logic' => 0,
			'wrapper' => array(
				'width' => '',
				'class' => '',
				'id' => '',
			),
			'return_format' => 'array',
			'preview_size' => 'thumbnail',
			'library' => 'all',
			'min_width' => '',
			'min_height' => '',
			'min_size' => '',
			'max_width' => '',
			'max_height' => '',
			'max_size' => '',
			'mime_types' => '',
		),
	),
	'location' => array(
		array(
			array(
				'param' => 'post_type',
				'operator' => '==',
				'value' => 'post',
			),
		),
	),
	'menu_order' => 0,
	'position' => 'normal',
	'style' => 'default',
	'label_placement' => 'top',
	'instruction_placement' => 'label',
	'hide_on_screen' => '',
	'active' => 0,
	'description' => '',
));

acf_add_local_field_group(array(
	'key' => 'group_5c50c1c302f00',
	'title' => 'Link group',
	'fields' => array(
		array(
			'key' => 'field_5c50c1c9907c8',
			'label' => 'Link text',
			'name' => 'link_text',
			'type' => 'text',
			'instructions' => 'Escribir texto para ver opciones',
			'required' => 0,
			'conditional_logic' => 0,
			'wrapper' => array(
				'width' => '',
				'class' => '',
				'id' => '',
			),
			'default_value' => '',
			'placeholder' => '',
			'prepend' => '',
			'append' => '',
			'maxlength' => '',
		),
		array(
			'key' => 'field_5c50c1d5907c9',
			'label' => 'Link type',
			'name' => 'link_type',
			'type' => 'radio',
			'instructions' => '',
			'required' => 0,
			'conditional_logic' => array(
				array(
					array(
						'field' => 'field_5c50c1c9907c8',
						'operator' => '!=empty',
					),
				),
			),
			'wrapper' => array(
				'width' => '',
				'class' => '',
				'id' => '',
			),
			'choices' => array(
				'internal' => 'Internal',
				'external' => 'External',
			),
			'allow_null' => 0,
			'other_choice' => 0,
			'default_value' => '',
			'layout' => 'horizontal',
			'return_format' => 'value',
			'save_other_choice' => 0,
		),
		array(
			'key' => 'field_5c50c28d907ca',
			'label' => 'External link url',
			'name' => 'link_url',
			'type' => 'text',
			'instructions' => '',
			'required' => 0,
			'conditional_logic' => array(
				array(
					array(
						'field' => 'field_5c50c1d5907c9',
						'operator' => '==',
						'value' => 'external',
					),
					array(
						'field' => 'field_5c50c1c9907c8',
						'operator' => '!=empty',
					),
				),
			),
			'wrapper' => array(
				'width' => '',
				'class' => '',
				'id' => '',
			),
			'default_value' => '',
			'placeholder' => '',
			'prepend' => '',
			'append' => '',
			'maxlength' => '',
		),
		array(
			'key' => 'field_5c50c2fc907cc',
			'label' => 'Page',
			'name' => 'link_in',
			'type' => 'page_link',
			'instructions' => '',
			'required' => 0,
			'conditional_logic' => array(
				array(
					array(
						'field' => 'field_5c50c1c9907c8',
						'operator' => '!=empty',
					),
					array(
						'field' => 'field_5c50c1d5907c9',
						'operator' => '==',
						'value' => 'internal',
					),
				),
			),
			'wrapper' => array(
				'width' => '',
				'class' => '',
				'id' => '',
			),
			'post_type' => '',
			'taxonomy' => '',
			'allow_null' => 0,
			'allow_archives' => 1,
			'multiple' => 0,
		),
		array(
			'key' => 'field_5c50c331907ce',
			'label' => 'New window?',
			'name' => 'new_window',
			'type' => 'true_false',
			'instructions' => '',
			'required' => 0,
			'conditional_logic' => array(
				array(
					array(
						'field' => 'field_5c50c1c9907c8',
						'operator' => '!=empty',
					),
					array(
						'field' => 'field_5c50c1d5907c9',
						'operator' => '==',
						'value' => 'external',
					),
				),
			),
			'wrapper' => array(
				'width' => '',
				'class' => '',
				'id' => '',
			),
			'message' => '',
			'default_value' => 0,
			'ui' => 0,
			'ui_on_text' => '',
			'ui_off_text' => '',
		),
	),
	'location' => array(
		array(
			array(
				'param' => 'post_type',
				'operator' => '==',
				'value' => 'post',
			),
		),
	),
	'menu_order' => 0,
	'position' => 'normal',
	'style' => 'default',
	'label_placement' => 'top',
	'instruction_placement' => 'label',
	'hide_on_screen' => '',
	'active' => 0,
	'description' => '',
));


?>
