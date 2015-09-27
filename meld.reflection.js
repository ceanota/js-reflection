(function(){

    "use strict";

    function moduleDefinition(_, reflectionFactory){

        "use strict";

        function extendMeldInfo (meld, options_user,reflectionFactory){

            var _options = _.extend({}, extendMeldInfo.get_options_default(), options_user);

            var reflectionObj = reflectionFactory(_options);

            function meld_func_info (obj, funcName, globalObj,  callback, globalObjName, meld_func_name, meld_func_info_name){

                if ((typeof obj[funcName] === "function") 
                    == false){
                    throw "funcName n'est pas une fonction de obj";
                }

                var objInfo =  reflectionObj.reflection(obj, globalObj, globalObjName || "$root" );

                var remover = meld[meld_func_name](obj,funcName,function(){
                    if(callback){
                        callback.apply(obj, [{arguments: arguments, funcInfo: objInfo[funcName], objInfo: objInfo }]);
                    };
                });

                remover.info_name = meld_func_info_name;

                remover.info_funcInfo = objInfo[funcName];
                remover.info_longFuncName = objInfo[funcName].longFunctName;

                return remover;
            };

            function aroundInfo(obj, funcName, globalObj,  callback, globalObjName){
                return meld_func_info(obj, funcName, globalObj,  callback, globalObjName, "around","aroundInfo");
            }

            function beforeInfo (obj, funcName, globalObj,  callback, globalObjName){
                return meld_func_info(obj, funcName, globalObj,  callback, globalObjName, "before","beforeInfo");
            }

            function afterInfo (obj, funcName, globalObj,  callback, globalObjName){
                return meld_func_info(obj, funcName, globalObj,  callback, globalObjName, "after","afterInfo");
            }

            function disposeInfo(){
                reflectionObj.dispose();
            }

            meld.aroundInfo = aroundInfo;
            meld.beforeInfo = beforeInfo;
            meld.afterInfo = afterInfo;
            meld.disposeInfo = disposeInfo;

            return meld;
        }

        function get_options_default(){
            var options_default =  reflectionFactory.get_options_default();
            return options_default;
        }

        extendMeldInfo.get_options_default = get_options_default;

        return extendMeldInfo;
    }

    if (typeof define === "function"){
        define(["lodash", "reflectionFactory"],moduleDefinition);
    }else{
        window.extendMeldInfo = moduleDefinition(_,reflectionFactory);
    }
})();