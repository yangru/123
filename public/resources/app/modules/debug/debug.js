define(function(require,exports,module){

    var $ = window.$ || window.jQuery || require("jquery");
    /*http://docs.jquery.com/QUnit*/
    var qUnit = require("/app/modules/debug/qunit");
    var qCss = require("/app/modules/debug/qunit.css");

    window.Debug = window.Debug || {};
    window.Debug = qUnit;

    /*主模块构造函数*/
    function Debug(config){
        /*
        一次可以测一组view跟model
        porocess中指定模块中需要自动输出的函数或方法
            _build自动给生成各before跟after的输出函数
            porocess中
                view中
                    name为模块别名或加载路径
                    cases为测试用例集合
                        每个Key为要测试的函数名称
                            usecase为要测试的函数状态类型
                                每个Key为该状态的具体测试
                model
        _creat函数将调用指定的view跟model并按照先view后model的顺序初始化，并将view的实例化对象赋予model.ui
        {
            view:{},
            model:{},
            porocess:{
                "view":{
                    "name":"test",
                    "cases":{
                        "initialize":{
                            "usecase":{
                                "after":function(){
                                
                                },
                                "before":function(){
                                    
                                }
                            }
                        }
                    }
                },
                "model":{
                    "name":"test",
                    "cases":{
                        "create":{
                            "usecase":{
                                "after":function(){
                                
                                },
                                "before":function(){
                                    
                                }
                            }
                        }
                    }
                }
            }
        }
        */
        this.config = $.extend({
            "view":null,
            "model":null,
            "tpl":'<div><h1 id="qunit-header">模块测试</h1><h2 id="qunit-banner"></h2><div id="qunit-testrunner-toolbar"></div><h2 id="qunit-userAgent"></h2><ol id="qunit-tests"></ol><div id="qunit-fixture">test markup, will be hidden</div></div>',
            "porocess":null
        },config||{},{
            "ready":false
        });

        this.testing = {
            "view":null,
            "model":null
        };

        if((this.config.view || this.config.model) && this.config.porocess){
            /*必须至少有一个view或model的配置，且必须有porocess*/
            require.async((function(obj){
                var rqArr = [];
                for(var n in obj){
                    obj[n].name && rqArr.push(obj[n].name);
                }
                return rqArr;
            })(this.config.porocess),function(){

                this.testing.view = arguments[0] || null;
                this.testing.model = arguments[1] || null;
                this.init();

            }.bind(this));
        }
        
    }

    Debug.prototype = {
        init:function(){
            this.fn._build.call(this);
            this.start();
        },
        "fn":{
            /*自动给生成各before跟after的输出函数*/
            _build:function(){
                
                $("body").append(this.config.tpl);

                function _build(porocess){
                    var _por = {};
                    for(var n in porocess){
                        var _before,_after;
                        if(porocess[n].usecase.after){
                            _after = "after"+this.fn._upperFirstChar(n);
                            _por[_after] = porocess[n].usecase.after;
                        }
                        if(porocess[n].usecase.before){
                            _before = "before"+this.fn._upperFirstChar(n);
                            _por[_before] = porocess[n].usecase.before;
                        }
                    }
                    return _por;
                }

                this.config.view = this.config.porocess.view && this.config.view 
                                && $.extend(this.config.view,_build.call(this,this.config.porocess.view.cases));
                this.config.model = this.config.porocess.model && this.config.model 
                                && $.extend(this.config.model,_build.call(this,this.config.porocess.model.cases));
            },
            /*首字大写*/
            _upperFirstChar:function(word){
                word = ""+word;
                return word.charAt(0).toUpperCase()+word.substr(1);
            },
            /*实例化*/
            _creat:function(){
                if(this.config.view){
                    this.testing.view = this.testing.view.init && this.testing.view.init(this.config.view)
                                        || new this.testing.view(this.config.view);
                }
                if(this.config.model){
                    this.config.model.ui = (this.config.model && this.config.porocess.model) && this.testing.view;
                    this.testing.model = this.testing.model.init && this.testing.model.init(this.config.model)
                                        || new this.testing.model(this.config.model);
                }
                this.config.ready = true;
            }
        },
        start:function(re){
            if(re || !this.config.ready){
                this.fn._creat.call(this);
            }else{
                /*restart*/
            }
        }
    }

    Debug.prototype.constructor = Debug;

    return function(config){
        return new Debug(config)
    };

});






