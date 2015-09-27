(function(){

    "use strict";

    function AOPFactory(){


        var _found = null;
        var _idx_search = 0;
        var _objectInfoSet = {};

        var reflection = reflectionFactory();

        var before_core = function(propName, func,obj, objInfo) {
            var wrapper =  function wrapper() {
                console.log("<AOP_BEGIN>:" + propName + "=>" , arguments,objInfo);
                return func.apply(obj|| this ,arguments);
            };

            return wrapper;
        };

        var after_core = function(propName, func,obj,objInfo) {
            var wrapper =  function wrapper() {
                var result = func.apply(obj|| this ,arguments);
                console.log("</AOP_END>:" + propName+"=>",arguments, result, objInfo);
                return result;
            };

            return wrapper;
        };

        function replace(obj, globalObj, globlaObjName, func){

            var callback = function callback(propName,longName, prop, obj, funcInfo){

                if(obj["_old_" + propName]===undefined){
                    //-- sauvegarde de l'ancienne fonction.
                    obj["_old_" + propName] = obj[propName];
                }
                //-- on écrase la fonction.
                obj[propName] = func( longName,prop,obj, funcInfo);
            };

            reflection.reflection(obj,globalObj, globlaObjName, callback);

        }

        function before(obj, globalObj, globlaObjName){

            replace(obj, globalObj, globlaObjName, before_core);
        }

        function after(obj, globalObj, globlaObjName){

            replace(obj, globalObj, globlaObjName, after_core);
        }


        return {
            before:before,
            after:after
        }
    }

    window.AOPFactory = window.AOPFactory || AOPFactory;

})();