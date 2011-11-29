/**
 * Created by JetBrains WebStorm.
 * User: Milan Jaric
 * Date: 11/16/11
 * Time: 12:22 AM
 * To change this template use File | Settings | File Templates.
 */


var HashArray = function(data) {

    var _hash = data || {};
    var _array = [];

    this.__defineGetter__("length", function() {
        return _hash.keys().length;
    });
    /**
     * Adds new elements to the end of an array, and returns the new length
     * @param src
     */
    this.push = function(src) {
        if (!$.isPlainObject(src)) {
            var o = {};
            o[this.length.toString()] = src;
            src = o;
        } else {
            _hash[name] = src;
            _array.push(src);
        }
    };
    /**
     * Removes the last element of an array, and returns that element
     */
    this.shift = function() {
        if (this.length < 1) {
            return null;
        }
        var key = "";
        var instance = null;
        for (key in _hash) {
            instance = _hash[key];
            delete _hash[key];
            return instance;
        }
        return instance;
    };

    /**
     * Removes the last element of an array, and returns that element
     */
    this.pop = function() {
        if (this.length < 1) {
            return null;
        }
        var key = "";
        var instance = null;
        for (key in _hash) {
            instance = _hash[key];

        }
        if (key !== "") {

            delete _hash[key];
        }
        return instance;
    };

    this.append = this.push;
    this.prepend = function() {

    };

};

(function($) {


    window.codex = new function codex() {

        var _topics = {};

        this.topic = function(id) {

            var callbacks,
                method,
                topic = id && _topics[ id ];
            if (!topic) {
                callbacks = $.Callbacks();
                topic = {
                    publish: callbacks.fire,
                    subscribe: callbacks.add,
                    unsubscribe: callbacks.remove
                };
                if (id) {
                    _topics[ id ] = topic;
                }
            }
            return topic;


        };

        this.version = "0.1";

        this.dataSources = new function() {

            function DataSource() {
                var _data = null,
                    _callbacks = $.Callbacks();

                this.__defineGetter__("data", function() {
                    return _data;
                });

                function preparePathForBinding(str){
                    var openBracket = new RegExp("\\[","g");
                    var closedBracket = new RegExp("\\]","g");
                    return str.replace(openBracket, "['").replace(closedBracket, "']");
                }

                this.getValueOf = function(str) {
                    // example person[email]
                    var path = preparePathForBinding(str);
                    var ref = null;
                    var evalScript = " ref = _data." + path;
                    eval(evalScript);
                    return ref;
                };

                this.setValueOf = function(str, value){
                    //Todo: Add support for non existing properties, build them on the fly!!!!
                    var path = preparePathForBinding(str);
                    var evalScript = "_data.";

                    if($.isNumeric(value))
                    {
                        evalScript += path + " = " + value;
                    }else if(typeof value == 'string'){
                        // Date type should be treated in property setter
                        // Boolean type should be treated in property setter
                        // Array values should be wrapped in ArrayHash and use above to handle types
                        // other than numeric or string
                        evalScript += path + " = '"+ value+"'";
                    }
                    eval(evalScript);

                };

                this.__defineSetter__("data", function(value) {
                    _data = value;
                    _data.onChanged(_callbacks);
                    _callbacks.fire();
                });

                this.__defineGetter__("callbacks", function() {
                    return _callbacks;
                });

                this.release = function() {
                    _data = null;
                    _callbacks.empty();
                };
            }

            var _dataSources = {};

            this.__defineGetter__("length", function() {
                return _dataSources.keys().length;
            });

            this.subscribeTo = function(name, fn) {
                _dataSources[name] = _dataSources[name] || new DataSource();
                _dataSources[name].callbacks.add(fn);
                
                return this;
            };

            this.add = function(name, data) {

                if ($.isPlainObject(name)) {
                    [data,name] = [name.data, name.name];
                }
                _dataSources[name] = _dataSources[name] || {};

                if ($.isPlainObject(data)) {
                    // it is json
                    _dataSources[name].data = new codex.Proxy(data);
                } else {
                    // it is codex.Proxy
                    _dataSources[name].data = data;
                }
                return this;
            };

            this.remove = function(name) {
                if (typeof _dataSources[name] === 'undefined') {
                    return this;
                }

                _dataSources[name].release();
                _dataSources[name] = null;
            };

            this.getDataSource = function(name){
                _dataSources[name] = _dataSources[name] || new DataSource();
                return _dataSources[name];
            };

        }();

    }();


})(jQuery);