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
        if(!$.isPlainObject(src)){
            var o = {};
            o[this.length.toString()] = src;
            src = o;
        }else{
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
        if (key != "") {

            delete _hash[key];
        }
        return instance;
    }

    this.append = this.pop;
    this.prepend = function(){

    }

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

        var _dataSources = {};
        this.dataSources = new function() {

            var _dataSources = {};

            this.__defineGetter__("length", function() {
                return _dataSources.keys().length;
            });

            this.push = function(name, src) {
                _dataSources[name] = src;
            };
            /**
             *
             */
            this.shift = function() {
                if (this.length < 1) {
                    return null;
                }
                var key = "";
                var instance = null;
                for (key in _dataSources) {
                    instance = _dataSources[key];
                    delete _dataSources[key];
                    return instance;
                }
                return instance;
            };


            this.pop = function() {
                if (this.length < 1) {
                    return null;
                }
                var key = "";
                var instance = null;
                for (key in _dataSources) {
                    instance = _dataSources[key];

                }
                if (key != "") {

                    delete _dataSources[key];
                }
                return instance;
            }


        }();

    }();


})(jQuery);