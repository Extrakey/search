define([], function() {
    "use strict";

    /** @namespace image/utils */
    return {

        /**
         * @function resize
         * @memberOf image/utils
         * @param {String} imgURL
         * @param {Number} resizeWith
         * @param {Number} resizeHeight
         */
        resize: function resize(imgURL, resize_w, resize_h){
            return "https://images1-focus-opensocial.googleusercontent.com/" +
                "gadgets/proxy?container=focus" +
                (resize_w ? "&resize_w=" + resize_w : "") +
                (resize_h ? "&resize_h=" + resize_h : "") +
                "&refresh=2592000&url=" +
                encodeURIComponent(imgURL);
        }
    };

});