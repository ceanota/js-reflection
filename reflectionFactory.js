
(function(){

    "use strict";

    function moduleDefinition (_){

        "use strict";

        function reflectionFactory(options_user){

            var _options = _.extend({}, reflectionFactory.get_options_default(), options_user);
            var _found = null;
            var _idx_search = 0;
            var _objectInfoSet = {};

            function get_value_str(value){
                var value_str="";
                if(!(value === undefined)){
                    if(_.isNull(value)){
                        value_str = "null";
                    }else{

                        //-- récupère le type de la valeur.
                        var paramNames = ["isArguments","isArray","isElement","isFunction","isNaN","isNull","isUndefined","isObject"];
                        for(var idx in paramNames){
                            var paramName = paramNames[idx];
                            if (paramName.indexOf("is",0) > -1){
                                var paramNameTemp = paramName.replace("is", "");
                                paramName = "is" + paramNameTemp;
                                if(typeof _[paramName] === "function"){
                                    if (_[paramName](value) === true){
                                        value_str = paramNameTemp;
                                        break;
                                    }
                                }
                            } 
                        }

                        if(_.isFunction(value) === true){
                            if(value.name){
                                value_str = value.name;
                            }
                        }

                        if(_.isObject(value) === true){
                            if(!!(value.constructor) && (!!(value.constructor.name)) ){
                                value_str = value.constructor.name;
                            }
                        }

                        if(_.isBoolean(value) === true){
                            value_str = value;
                        }

                        if(_.isNumber(value) === true){
                            value_str = value;
                        }

                        if(_.isString(value) === true){
                            value_str = "'" + value + "'";
                        }

                    }
                }
                return value_str;
            }

            function toString_funcInfo(funcInfo, args, result){

                var result_str = get_value_str(result);
                if (result_str !== ""){
                    result_str = ":" + result_str;
                }

                var arguments_str = [];
                if (args.length > 0){
                    for(var idx in args){
                        var arg = args[idx];

                        var arg_str = "";
                        var paramName = funcInfo.parameterNamesArray[idx];
                        if(!(paramName)){
                            paramName = "unkn" + idx;
                        }
                        arg_str = paramName + ":" + get_value_str(arg);
                        arguments_str.push(arg_str);
                    }
                }    

                var params_str = "()";
                if (arguments_str.length > 0){
                    params_str = arguments_str.join(", ");
                    params_str = "("+ params_str +")";
                }
                return funcInfo.longFunctName + params_str + result_str;

            }

            function functionInfoFactory(longFunctName, funcName, func, obj, globalObj, objName){

                var parameterNamesArray = _options.getParamNames_flag === true ?   getParamNames(func) : [];

                var info =Object.create(functionInfoFactory.prototype);
                info.constructor = functionInfoFactory;

                info.longFunctName=longFunctName;
                info.funcName=funcName;
                info.parameterNamesString= parameterNamesArray.join(",");
                info.func=func;
                info.obj=obj;
                info.globalObj=globalObj;
                info.parameterNamesArray = parameterNamesArray;
                info.objName= objName;
                info.toString = function toString(args, result){
                    return toString_funcInfo(info,args,result);
                };

                return info;
            }

            function objectInfoFactory(obj, objName,globalObj, callback){

                var objInfo = Object.create(objectInfoFactory.prototype);
                objInfo.constructor = objectInfoFactory;

                objInfo.obj = obj;
                objInfo.objName = objName;
                objInfo.findFuncName = function findFuncName(func){ return _findFuncName(objInfo,func)  };
                objInfo.findFuncInfo =function findFuncInfo(funcName){ return _findFuncInfo(objInfo,funcName)  };

                var propNames = Object.getOwnPropertyNames(obj);
                for(var idx = 0; idx < propNames.length; idx++){
                    var propName = propNames[idx];

                    var prop = obj[propName];
                    if(typeof prop === "function"){
                        var longName = objName + "." + propName;
                        var funcInfo = functionInfoFactory(longName, propName,obj[propName], obj, globalObj, objName) ;
                        objInfo[propName] = funcInfo;

                        if(callback){
                            callback(propName,longName, prop, obj, funcInfo);
                        }

                    }

                }

                return objInfo;
            }

            function search(obj, gObjectName, gNamesArray, wantedObj) {
                /// <signature>
                ///   <summary>Recherche en profondeur tous les sous objets ayant des propriétés</summary>
                /// </signature>

                if (_idx_search > 1000){
                    throw "search=>overflow";
                }

                _idx_search++;

                if (!(_.isObject(wantedObj) || _.isFunction(wantedObj))){
                    throw "wantedObj doit être une fonction ou un objet."
                }

                var props = Object.getOwnPropertyNames(obj);

                for (var ii in props) {
                    var koSubObjName = props[ii];

                    if(_.isFunction(obj)){
                        if (koSubObjName === "caller" || koSubObjName === "arguments"){
                            continue;
                        }
                    }

                    var koSubObj = obj[koSubObjName];
                    if (!_.isBoolean(koSubObj) &&
                        !_.isRegExp(koSubObj) &&
                        !_.isNumber(koSubObj) &&
                        !_.isDate(koSubObj) &&
                        !_.isArray(koSubObj)) {

                        if ((_.isFunction(koSubObj)  || _.isObject(koSubObj)) && (koSubObjName != "prototype")) {

                            var gKoSubObjName = gObjectName + "." + koSubObjName;
                            gNamesArray.push(gKoSubObjName);

                            if(koSubObj === wantedObj){
                                _found = gKoSubObjName;
                                return _found;
                            }

                            var found = search(koSubObj, gKoSubObjName, gNamesArray,wantedObj);

                            if(found){
                                _found = null;
                                return found;
                            }

                        }
                    }
                }

            }

            function reflection(obj, globalObj, globlaObjName, callback){

                var objName = search(globalObj, globlaObjName, [], obj);

                if(!(_objectInfoSet[objName] === undefined)){
                    if(callback){
                        for(var meta_func_name in _objectInfoSet[objName]){

                            var meta_func = _objectInfoSet[objName][meta_func_name];

                            if(!(meta_func.longFunctName === undefined)){
                                callback(
                                    meta_func.funcName,
                                    meta_func.longFunctName,
                                    meta_func.obj[meta_func.funcName],
                                    meta_func.obj, 
                                    meta_func);
                            }
                        }
                    }
                }else{
                    var objInfo = objectInfoFactory(obj, objName,globalObj, callback);
                    _objectInfoSet[objName] = objInfo;
                }

                return _objectInfoSet[objName];

            }

            var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
            var ARGUMENT_NAMES = /([^\s,]+)/g;
            
            function getParamNames(func) {
                var fnStr = func.toString().replace(STRIP_COMMENTS, '');
                var result = fnStr.slice(fnStr.indexOf('(')+1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
                if(result === null)
                    result = [];
                return result;
            }

            function _findFuncName(objInfo,func){
                if (!(objInfo.obj)){
                    throw "Throw objInof in not Object Info.";
                }

                //-- on détermine le nom de la fonction 'funcName'.
                var objTemp = objInfo.obj;
                var propNames = Object.getOwnPropertyNames(objInfo.obj);
                var funcName;
                for(var idx in propNames){
                    var propName = propNames[idx];
                    if(objTemp[propName] === func ){
                        funcName = propName;
                        break;
                    }
                }

                return funcName;
            }

            function _findFuncInfo(objInfo,funcName){

                //-- on détermine func info.
                var funcInfo;
                if (!!(funcName)){
                    var propNames = Object.getOwnPropertyNames(objInfo);
                    for(var idx in propNames){
                        var propNameTemp = propNames[idx];
                        if(!!(objInfo[propNameTemp].longFunctName) && objInfo[propNameTemp].funcName ===  funcName){
                            funcInfo = objInfo[propNameTemp];
                            break;
                        }
                    }
                }

                return funcInfo;
            }

            function findFirstPropOwner(prop,globalObj){
                var foundObj;
                var foundPropName;

                var longFuncName = search(globalObj,"$root",[], prop );
                longFuncName = longFuncName.replace("$root" + ".", "");

                var partNSArray =  longFuncName.split(".");

                var globalObjTemp = globalObj;
                var instancesTemp = [globalObjTemp];
                for(var idx = 0; idx < partNSArray.length; idx++){

                    var partNS = partNSArray[idx];
                    if (globalObjTemp[partNS] === prop){
                        foundObj = instancesTemp[instancesTemp.length-1];
                        foundPropName = partNS;
                        break;
                    }else{
                        globalObjTemp = globalObjTemp[partNS];
                        instancesTemp.push(globalObjTemp);
                    }

                }

                return { obj: foundObj, prop: foundPropName }

            }

            function dispose(){
                var propNames = Object.getOwnPropertyNames(_objectInfoSet);

                for(var idx = 0; idx < propNames.length; idx++){
                    var propName = propNames[idx];

                    var objectInfo = _objectInfoSet[propName];
                    if (!!(objectInfo.findFuncInfo)){
                        delete _objectInfoSet[propName];
                    }
                }

            }

            var _objInfo = {
                getParamNames: getParamNames,
                search:search,
                reflection:reflection,
                objectInfoSet: _objectInfoSet,
                findFirstPropOwner : findFirstPropOwner,
                get_options_default: get_options_default,
                dispose : dispose
            };
            
            return _objInfo;
        }

        function get_options_default(){
            var options_default = {
                getParamNames_flag:false
            }
            return options_default;
        };

        reflectionFactory.get_options_default = get_options_default;

        return reflectionFactory;
    }

    if(typeof define === "function"){
        define(["lodash"],moduleDefinition);
    }else{
        window.reflectionFactory = moduleDefinition(_);
    }
})();




