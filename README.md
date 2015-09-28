# js-reflection

This library give a description of methods of objects.

## Installation

```shell
bower install dpReflectionFactory.js
```

## Usage

Give informations about methods of objects.

```js
    var options = dpReflectionFactory.get_options_default();
    options.getParamNames_flag = true;

    var reflection = dpReflectionFactory(options);
    var objInfo = reflection.getObjInfo(obj.obj2,obj, "obj");
```

## API
