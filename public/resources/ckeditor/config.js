/*
Copyright (c) 2003-2010, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

CKEDITOR.editorConfig = function( config )
{
	config.language = 'zh-cn';
	config.skin = 'v2';
	config.ignoreEmptyParagraph = true;
	config.image_removeLinkByEmptyURL = true;
	config.resize_enabled = false;
	config.disableNativeSpellChecker = false;
	config.scayt_autoStartup = false;
	
	/*
	 * CKEDITOR.ENTER_P (1): new <p> paragraphs are created;
     * CKEDITOR.ENTER_BR (2): lines are broken with <br> elements;
     * CKEDITOR.ENTER_DIV (3): new <div> blocks are created.
	 */
	config.enterMode = CKEDITOR.ENTER_P;
		
	config.toolbar_betaBasic =
	[
	 	['Undo', 'Redo', 'RemoveFormat', '-',
	 	'Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-',
	 	'Bold', 'Italic', 'Underline', 'Strike', '-',
	 	'Link', 'Unlink', 'Anchor', '-',
	 	'TextColor','BGColor']
	];
	
	config.toolbar_betaAdvance =
	[
	 	['Undo', 'Redo', 'RemoveFormat', '-',
	 	'Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-',
	 	'Bold', 'Italic', 'Underline', 'Strike', '-',
	 	'Link', 'Unlink', '-',
	 	'BGColor', 'TextColor', 'FontSize'],
	 	'/',
	 	['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', 'Blockquote', '-',
	 	'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', '-',
	 	'Image', 'Flash', 'Table', 'HorizontalRule', 'SpecialChar', '-', 
	 	'ShowBlocks', 'Maximize']
	];
	
	config.toolbar_betaAdmin =
	[
	 	['Undo', 'Redo', 'RemoveFormat', '-',
	 	'Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-',
	 	'Bold', 'Italic', 'Underline', 'Strike', '-',
	 	'Link', 'Unlink', '-',
	 	'BGColor', 'TextColor', 'FontSize'],
	 	'/',
	 	['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', 'Blockquote', '-',
	 	'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', '-',
	 	'Image', 'Flash', 'Table', 'HorizontalRule', 'SpecialChar', '-', 
	 	'ShowBlocks', 'Maximize', '-', 'Source']
	];
};
