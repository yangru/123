define(function(require,exports,module){
    var button = $('#user_name');
    var rang = $('.G-frameHead .G-innerHead .usertoolbar ul li.email');
    var menu = $('#sub_list');
    
	button.click(function() {
    	menu.show();
    });
    rang.mouseleave(function() {
    	menu.hide();
    });
    
});