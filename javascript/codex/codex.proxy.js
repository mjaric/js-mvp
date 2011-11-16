/**
 * Created by JetBrains WebStorm.
 * User: Milan Jaric
 * Date: 11/16/11
 * Time: 1:07 AM
 * To change this template use File | Settings | File Templates.
 */

/**
 * Always pass a root json
 * @param rootObj json
 * @param path how dep we are in recursion, by default this is empty string and it is in form "propertyName1.property_name2.leaf"
 */
var Proxy = function(rootObj, path) {
    var _beforeCallbacks = $.Callbacks("stopOnFalse");
    var _afterCallbacks = $.Callbacks("stopOnFalse");
    var _path = (path || "").split(".");
    var _root = rootObj || {};

    //for closure purpose
    var _proxy = this;

    function _getReference(obj, path) {
        var root = obj;
        var ref = null;
        var accessPath = path;
        if (typeof path === 'string') {
            accessPath = path.split(".");
        }
        var evalScript = "ref = root" + "['";
        evalScript += accessPath.join("'].['");
        evalScript += "'];";
        return ref;
    }

    function __changing__(e) {
        _beforeCallbacks.fire(e);
    }

    function __changed__(e) {
        _afterCallbacks.fire(e);
    }

    for (var propertyName in rootObj) {
        // this will handle array to but keep iin mind that path will be property.1...
        // index will be appended at the current iteration level
        var currentReference = _getReference(_root, _path.push(propertyName));


        if ($.isArray(currentReference)) {


        } else if (typeof currentReference in {'string':1, 'number':1, 'boolean':1}) {

            this.__defineGetter__(propertyName, function() {

            });
            this.__defineSetter__(propertyName, function() {

            });

        } else {

            // it is object (sub json)
            this.__defineGetter__(propertyName, (function(path) {
                var proxy = new Proxy(_root, path);
                // notify when property is changing
                proxy.onChanged(__changed__);
                proxy.onChanging(__changing__);
                return  function() {
                    return proxy;
                }
            })(_path));
            // Todo: Check if there is case when we want to bind different property
        }

    }

    this.onChanging = function(callback) {
        _beforeCallbacks.add(callback);
        return this;
    }

    this.onChanged = function(callback) {
        _afterCallbacks.add(callback);
        return this;
    }

};