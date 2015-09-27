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

function moduleDefinition(reflectionFactory){

    //-- instanciation de l'objet exemple.
    var obj = objFactory();

    //-- liaison entre l'ihm et l'objet via ko.
    var node = document.getElementById("test");
    ko.applyBindings(obj.obj2.obj3, node);

    
    window.obj = obj;
    
    var options = reflectionFactory.get_options_default();
    
    var reflection = reflectionFactory(options);
    
    var objInfo = reflection.reflection(obj.obj2,obj, "obj",function(){
    
        
        
    });
    
    debugger;

}

if(typeof requirejs === "function"){
    requirejs(["../src/reflectionFactory"],moduleDefinition);
}else{
    moduleDefinition(meld,reflectionFactory, extendMeldInfo);
}







