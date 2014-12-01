/**
 * @module ajax
 */
define(function(){
    'use strict';

    /*
     * Returns the response of the xmlhttp request.
     * @returns {String|Object|XMLDOM}
     */
    function _parserResponse(xmlhttp){
        var response;
        if (xmlhttp.responseXML) {
            response = xmlhttp.responseXML;
        } else {
            response = xmlhttp.responseText;
            try {
                response = JSON.parse(response);
            }catch(e){

                // do nothing
            }
        }
        return response;
    }

    function request(method, params, success, error) {
        var xmlhttp = new XMLHttpRequest();

        xmlhttp.onreadystatechange = function() {
            var callback;

            if (xmlhttp.readyState === 4){

                if (xmlhttp.status >= 200 && xmlhttp.status < 300) {
                    if (success) {
                        callback = success;
                    }

                } else if(xmlhttp.status > 0) {

                    /*
                     * Some browsers call with status equals 0 when an exception is triggered.
                     * We don't attend those responses because they are handled by the
                     * try/catch statement
                     */
                    if (error) {
                        callback = error;
                    }
                }

                if (callback) {
                    callback(_parserResponse(xmlhttp), xmlhttp.status);
                }
            }
        };

        xmlhttp.open(method, params.url, true);

        try {
            xmlhttp.send();
        } catch (e) {
            if(error){
                error(e.message, 0);
            }
        }
    }

    var ajax = {

        /**
         * Makes a request using the "GET" method
         * @function get
         * @param {Object} params
         * @param {String} params.url
         * @param {Function} success callback
         * @param {String|Object|XMLDOM} success.content depending on the result
         * @param {number} success.status
         * @param {Function} error callback
         * @param {String|Object|XMLDOM} error.content depending on the result
         * @param {number} error.status
         */
        get: function(){
            var args = [].concat(
                "GET",
                Array.prototype.slice.call(arguments, 0)
            );
            return request.apply(null, args);
        }
    };

    return ajax;

});