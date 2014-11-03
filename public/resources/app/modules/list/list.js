define(function(require,exports,module){

	var $ = require("jquery")
	 	,Backbone = require("backbone")
	 	,listModel = require("/resources/app/models/list")
        ,listView = require("/resources/app/views/list");

	function List(config){
		this.config = $.extend(true,{
			"model":{
				"datasources":{
                    "url":"/custom/tabs",
                    "data":{},
                    dataFilter:function(re,type){
                        re = $.parseJSON(re);
                        if(re.success){
                            $.each(re.result.items, function(key, value){
                                value.childs = null;
                            });
                            return (re = JSON.stringify(re.result));
                        }else{
                            /*失败*/
                            var def = $.Deferred(this);
                            def.reject();
                            return false;
                        }
                    }.bind(this)
                }
                ,"ui":null
			}
			,"view":{
				"id":"body"
			}
		},config||{});
		var _id = this.config.view.id;
		this.config.view.id = typeof(_id) === "string" && $("#"+_id)
                            || (_id.nodeType || _id.selector || _id.jquery) && $(_id);

		this.view = new listView(this.config.view);
		this.config.model.ui = this.view;
		this.model = new (listModel(this.config.model));
	}
    
    return function(config){
    	return new List(config);
    }

});
