/**
 * Created by JetBrains WebStorm.
 * User: Milan Jaric
 * Date: 11/16/11
 * Time: 1:07 AM
 * To change this template use File | Settings | File Templates.
 */

(function(codex, $) {
    /**
     * Always pass a root json
     * @param rootObj json
     * @param path how dep we are in recursion, by default this is empty string and it is in form "propertyName1.property_name2.leaf"
     */
    codex.Proxy = function(rootObj, path) {
        var _beforeCallbacks = $.Callbacks("stopOnFalse");
        var _afterCallbacks = $.Callbacks("stopOnFalse");
        var _path = path;
        if (!$.isArray(_path)) {
            _path = _path ? _path.split(".") : [];
        }
        var _root = rootObj || {};

        //for closure purpose
        var _proxy = this;

        function _getReference(obj, path) {
            var root = obj;
            var ref = root;
            var accessPath = path;
            if (typeof path === 'string') {
                accessPath = path.split(".");
            }

            if (accessPath.length > 0) {
                var evalScript = "ref = root";
                evalScript += "['";
                evalScript += accessPath.join("']['");
                evalScript += "'];";
                eval(evalScript);
            }

            return ref;
        }

        function _setReference(path, value){
            var evalScript = "_root." + path + "=";
            if($.isNumeric(value)){
                evalScript += "" + value;
            }else{
                evalScript += "'"+ value + "'";
            }
            eval(evalScript);

        }

        function __changing__(e) {
            _beforeCallbacks.fire(e);
        }

        function __changed__(e) {
            _afterCallbacks.fire(e);
        }

        for (var propertyName in _getReference(_root, _path)) {
            // this will handle array to but keep iin mind that path will be property.1...
            // index will be appended at the current iteration level
            _path.push(propertyName);
            console.log(propertyName, _path);
            var currentReference = _getReference(_root, _path.join("."));


            if ($.isArray(currentReference)) {
                //Todo: add ArrayProxy

            } else if (typeof currentReference in {'string':1, 'number':1, 'boolean':1}) {
                // Todo: add support for dates, tho, it would be better send it as string... think about it
                this.__defineGetter__(propertyName, (function(pathInRoot, property) {
                    var path = pathInRoot.join(".");
                    return function() {
                        return _getReference(_root, path);
                    }
                })(_path, propertyName));

                this.__defineSetter__(propertyName, (function(pathInRoot, property) {
                    var path = pathInRoot.join(".");
                    return function(value) {
                        var ref = _getReference(_root, path);
                        var eArgs = {propertyName: path, oldValue: ref, newValue: value, shouldStop: false};
                        __changing__(eArgs);
                        if(eArgs.shouldStop){
                            //Todo: Think what shell be done in this case, probably we need to notify sender that value is not changed
                            // also what about canEdit, where model authorization should go, filters????
                            return;
                        }
                        _setReference(path, value);
                        delete eArgs.shouldStop; // not needed anymore
                        __changed__(eArgs)
                    }
                })(_path, propertyName));

            } else {

                // it is object (sub json)
                this.__defineGetter__(propertyName, (function(pathInRoot) {
                    var path = pathInRoot.join(".");
                    var proxy = new codex.Proxy(_root, path);
                    // notify when property is changing
                    proxy.onChanged(__changed__);
                    proxy.onChanging(__changing__);
                    console.log(path, " successfully bound");
                    return  function() {
                        return proxy;

                    }
                })(_path));
                // Todo: Check if there is case when we want to bind different property
            }
            _path.pop(); // remove last (go back to parent)

        }

        this.onChanging = function(fn) {
            _beforeCallbacks.add(fn);
            return this;
        };

        this.onChanged = function(fn) {
            _afterCallbacks.add(fn);
            return this;
        };

    };

})(window.codex, jQuery);

