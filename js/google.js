/**
 * @module google
 */
define(["ajax"], function(ajax){
    "use strict";

    var USER_AND_SEARCH_ID = "005566808759827866155%3Avz2isyltw50",
        API_KEY = "AIzaSyD-puKqbrU1Dc3NsFJYXvvHLsUMy14plAA",
        TOKEN_ID = "&cx=" + USER_AND_SEARCH_ID + "&key=" + API_KEY,
        IMAGE_FIELDS =
            "&fields=items(image(contextLink,thumbnailLink)),searchInformation/totalResults",
        TEXT_FIELDS = "&fields=items(htmlSnippet,link,title),searchInformation/totalResults";

    return {

        /**
         * @function search
         * @param {Object} params
         * @param {String} params.query
         * @param {Number} [params.start=1] The index of the first result to return
         * @param {Number} [params.count=10] Number of search results to return
         * @param {Boolean} [params.imageSearch=false] When true search images
         * @param {Funciton} success callback
         * @param {Funciton} error callback
         */
        search: function(params, success, error){
            ajax.get({
                url:
                "https://www.googleapis.com/customsearch/v1?q=" +
                    params.query +
                    "&num=" + (params.count || 10) +
                    "&start=" + (params.start || 1) +
                    (params.imageSearch ? "&searchType=image" : "") +
                    (params.imageSearch ? IMAGE_FIELDS : TEXT_FIELDS) +
                    TOKEN_ID
                },
                success,
                error);
        }
    };
});
