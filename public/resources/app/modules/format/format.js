define(function(require,exports,module){
    
    /*格式化字符串*/
    function formatStr(obj,n,model,single){
        var value = ""+obj[n];
        var Label = value.match(/\{.*\}/);
        if(Label !== null){
            obj.dirty = true;
            Label = Label[0];
            var name = Label.match(/[^\{\}]+/g)[0];
            var _par = "";
            if(!single){
                for(var n in model["keys"]){
                    _par += n+"|"+model["keys"][n]+",";
                }
                _par = _par.substr(0,_par.length-1);
            }else{

                if(name in model){
                    _par = model[name];
                }else if(model["keys"] && name in model["keys"]){
                    _par = LANG(model["keys"][name]);
                }else if(model["x_axis"] && name in model["x_axis"]){
                    _par = LANG(model["x_axis"][name]);
                }else if(model["y_axis"] && name in model["y_axis"]){
                    _par = LANG(model["y_axis"][name]);
                }
                
            }
            
            value = value.replace(Label,_par);
        }
        return value;
    }

    /*接口相关处理函数*/
    function interfaceSettingFormat(config,model){

        if(!config){
            return false;
        }

        var _config = $.extend({},config);

        if(model && model !==null){
            var emptyModel = true;
            for(var n in model){
                emptyModel = false;
                break;
            }
            model = emptyModel?false:model;
        }

        if(_config["addParams"] && _config["params"]){
            for(var n in _config.addParams){

                if(typeof _config.addParams[n] ==="string" && model){
                    _config.params[n] = formatStr(_config.addParams,n,model);
                }

                if(typeof _config.addParams[n] ==="function"){
                    _config.params[n] = _config.addParams[n](model);
                }


            }
        }

        if(_config["router"]){
            var BU = window["BU"] || "";
            var type = _config.router["type"] === null?false:_config.router["type"];
            var _url = BU+_config.router["model"]+"/"+_config.router["defaultAction"]+(type?("/"+type):"");
            _config.url = _url;
        }

        return _config;
    }


    return {
        "name":"Format",
        "interfaceSettingFormat":interfaceSettingFormat,
        "formatStr":formatStr
    }

});