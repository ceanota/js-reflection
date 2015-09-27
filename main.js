"use strict";

function objFactory(){

    //-- définition des objets.
    function function1(value, value1, valu2){

        console.log(value);
        return {"hello":"chao"};
    }

    function function2() {
        console.log("base2");
    }

    window.obj = {

        function1: function1,
        function2: function2,

        obj2:{

            function1: function1.bind(this),
            function2: function2.bind(this),
            func : function(rien){

                console.log("Thiet gioi Phuong");
                return {phuong:"phuong"};
            },

            obj3:{

                function1: function1.bind(this),
                function2: function2.bind(this),
                func : function(rien, rien2){
                    console.log("Thiet gioi Lien");
                    return {phuong:"Lien"};
                },
                koFunc: ko.observable("")


            }
        }
    }

    obj.obj2.obj3.koComp = ko.computed(function(){
        return obj.obj2.obj3.koFunc() + "-- koComp"; 
    });

    obj.constructor = objFactory;

    return obj;
}

function logUnitFactory(meld,obj,reflectionFactory, extendMeldInfo){

    var meld_options = extendMeldInfo.get_options_default();
    meld_options.getParamNames_flag = true;
    //-- extendion du meld.
    extendMeldInfo(meld, meld_options, reflectionFactory);

    var _logUnit = Object.create(logUnitFactory.prototype);
    _logUnit.constructor = logUnitFactory;

    //-- utilisation.
    var removerArray = [];


    function trace_info(funcInfo,args_func, result, time, duration, meld_func_name){
        var info_str = funcInfo.toString(args_func,  result);
        info_str = "##-- "+ time +"\nduration: "  +  duration + " ms\n"+  "meld: [" + meld_func_name + "]\nsignature: [" +info_str +"]\n";
        console.info(info_str ,"result:", result,"\narguments:", args_func,"\nfuncInfo:", funcInfo);
    }

    function _apply(){

        removerArray.push(meld.aroundInfo(obj.obj2.obj3,"func", obj, function(arg){
            var meld_func_name = "aroundInfo";
            var methodCall = arg.arguments.length > 0 ? arg.arguments[0] : undefined;
            var args_func = methodCall.args;

            var time =  moment().format("HH:mm:ss.SSS a Z, YYYY-MM-d");
            var t0 = performance.now();
            var result = methodCall.proceed();
            var t1 = performance.now();
            var duration = t1-t0;

            trace_info(arg.funcInfo, args_func, result, time, duration, meld_func_name);

        },"obj"));

        /*removerArray.push(meld.beforeInfo(obj.obj2.obj3,"func", obj, function(arg){

            var meld_func_name = "beforeInfo";
            var args_func = arg.arguments;
            var result = undefined;

            var time =  moment().format("HH:mm:ss.SSS a Z, YYYY-MM-d");
            var info_str = trace_info(arg.funcInfo, args_func, result, time, -1, meld_func_name);

            console.info(info_str , result, args_func, arg.funcInfo);
        },"obj"));

        removerArray.push(meld.afterInfo(obj.obj2.obj3,"func", obj, function(arg){

            var meld_func_name ="afterInfo";
            var args_func = [];
            var result = arg.arguments.length > 0 ? arg.arguments[0] : undefined;

            var time =  moment().format("HH:mm:ss.SSS a Z, YYYY-MM-d");
            var info_str = trace_info(arg.funcInfo, args_func, result, time, -1, meld_func_name);

            console.info(info_str , result, args_func, arg.funcInfo);

        },"obj"));*/

        removerArray.push(meld.afterInfo(obj.obj2.obj3,'koFunc', obj, function(arg){

            var meld_func_name ="afterInfo";
            var args_func = [];
            var result = arg.arguments.length > 0 ? arg.arguments[0] : undefined;

            var time =  moment().format("HH:mm:ss.SSS a Z, YYYY-MM-d");
            trace_info(arg.funcInfo, args_func, result, time, -1, meld_func_name);

        },"obj"));

    }

    function _remove(){
        for(var idx in removerArray){
            removerArray[idx].remove();
        }
        removerArray = [];

    }

    function _dispose(){
        _logUnit.remove();
        meld.disposeInfo();
    }

    //--- PUBLIC
    _logUnit.apply = _apply;
    _logUnit.remove = _remove;
    _logUnit.removerArray = removerArray;
    _logUnit.dispose = _dispose;


    return _logUnit;

}

function moduleDefinition(meld,reflectionFactory, extendMeldInfo){

    //-- instanciation de l'objet exemple.
    var obj = objFactory();

    //-- liaison entre l'ihm et l'objet via ko.
    var node = document.getElementById("test");
    ko.applyBindings(obj.obj2.obj3, node);

    //-- système de log de l'objet exemple.
    window.logUnit = logUnitFactory(meld, obj,reflectionFactory, extendMeldInfo);
    window.logUnit.apply();

    window.test = obj;

}

if(typeof requirejs === "function"){
    requirejs(["bower_components/meld/meld", "reflectionFactory", "meld.reflection"],moduleDefinition);
}else{
    moduleDefinition(meld,reflectionFactory, extendMeldInfo);
}







