"use strict";

function moduleDefinition(ko, dpReflectionFactory){

    function objFactory(){

        //-- définition des objets.
        function function1(value, value1, valu2){

            console.log(value);
            return {"hello":"chao"};
        }

        function function2() {
            console.log("base2");
        }

        function _func (rien){

            var result = {phuong:"phuong"};
            
            var objInfo = reflection.getObjInfo(obj.obj2,obj, "obj");
            console.log(objInfo.findFuncInfo(_func).toString(arguments,result));

            return result;
        }

        var obj = {

            function1: function1,
            function2: function2,

            obj2:{

                function1: function1.bind(this),
                function2: function2.bind(this),
                func : _func,
                obj3:{

                    function1: function1.bind(this),
                    function2: function2.bind(this),
                    func : function(rien, rien2){
                        console.log("Thiet gioi Lien");
                        return {phuong:"Lien"};
                    },
                    koFunc: ko.observable("")


                },
                obj4:{

                    func4: function(){ return "func4" }
                }
            }
        }

        obj.obj2.obj3.koComp = ko.computed(function(){
            return obj.obj2.obj3.koFunc() + "-- koComp"; 
        });

        obj.constructor = objFactory;

        return obj;
    }

    //-- instanciation de l'objet exemple.
    var obj = objFactory();

    //-- liaison entre l'ihm et l'objet via ko.
    var node = document.getElementById("test");
    ko.applyBindings(obj.obj2.obj3, node);


    window.obj = obj;

    var options = dpReflectionFactory.get_options_default();
    options.getParamNames_flag = true;

    var reflection = dpReflectionFactory(options);
    debugger;

}

if(typeof requirejs === "function"){

    requirejs.config({packages: [
        { name: '_', location: '../dependencies', main: 'lodash' },
        { name: 'dpReflectionFactory', location: '../src', main: 'dpReflectionFactory' },
        { name: 'ko', location: './', main: 'knockout-3.2.0.debug' },
        // ... other packages ...
    ]});

    requirejs(["ko","dpReflectionFactory"],moduleDefinition);

}else{
    moduleDefinition(ko, dpReflectionFactory);
}







