define([], function(){
    "use strict";

    /**
     * @class Paginator
     * @memberOf ui
     * @contructor
     * @param {Object} params
     * @param {DOM} params.parent DOM object to append the paginator
     * @param {Number} params.elementsPerPage
     * @param {Number} [params.startPage]
     * @param {Number} [params.preloadPages=1]
     * @param {Function} load
     * @param {Number} load.start 1-based index
     * @param {Number} load.count Number of elements to load
     * @param {Function} load.callback To be called when the data is loaded
     * @param {Array} load.callback.items Array with the requested items for the write callback
     * @param {Number} load.callback.total Total number of elements available
     * @param {Function} write Write callback for constructing the paginator's page view
     * @param {DOM} write.pageDOM DOM representing the page to attach content to
     * @param {Array} write.items List of items for that page
     * @param {Number} write.pageNumber
     */
    function Paginator(params, load, write){
        var pendingReadyCallbacks = [];
        params = params || {};

        function createDOM(parent){
            var dom = document.createElement("div");
            dom.className = "pages";
            if(parent){
                parent.appendChild(dom);
            }
            return dom;
        }

        /**
         * @method Paginator#ready
         * @param {Function} callback
         */
        this.ready = function(callback){
            if(callback){
                pendingReadyCallbacks.push(callback);
            }

            if(this.totalPages !== undefined){
                pendingReadyCallbacks =
                    pendingReadyCallbacks.filter(function(callback){
                        callback();
                        return false;
                    });
            }
        };

        this.dom = createDOM(params.parent);
        this.elementsPerPage = params.elementsPerPage || 10;
        this.preloadPages = params.preloadPages || 1;
        this.load = load;
        this.write = write;

        if(params.startPage){
            this.goTo(params.startPage);
        }
    }

    /**
     * Shows the requested page
     * @method Paginator#goTo
     * @param {Number} pageNumber
     * @param {Function} [callback]
     */
    Paginator.prototype.goTo = function(pageNumber, goToCallback){
        var that = this,
            start,
            count;

        function isPageLoaded(){
            var page = that.dom.querySelector(".page-" + pageNumber);
            return page && !page.classList.contains("discarded");
        }

        function showPage(){
            var pages = that.getPages();
            pages.forEach(function(page){
                if(page.classList.contains("page-" + pageNumber)){
                    page.style.display = "block";
                }else{
                    page.style.display = "none";
                }
            });
            that.currentPage = pageNumber;
            if(goToCallback){
                goToCallback();
            }
        }

        function createPage(pageNumber){
            var dom = document.createElement("div");
            dom.className = "page page-" + pageNumber;
            dom.style.display = "none";
            return dom;
        }

        function loadPage(){
            // prevent double load
            if(that.loading){
                return;
            }

            start = (pageNumber - 1) * that.elementsPerPage + 1;
            count = that.elementsPerPage * that.preloadPages;

            that.loading = true;
            that.load(start, count,
                function(elements, totalItems){
                    var pageElements,
                        tempPageNumber = pageNumber;

                    that.totalItems = totalItems;
                    that.totalPages = totalItems === 0 ? 0 :
                        parseInt((totalItems - 1) / that.elementsPerPage, 10) + 1;

                    while(elements && elements.length){
                        pageElements = elements.splice(0, that.elementsPerPage);
                        var pageDOM = createPage(tempPageNumber);
                        that.write(pageDOM, pageElements, tempPageNumber);
                        that.dom.appendChild(pageDOM);
                        tempPageNumber++;
                    }
                    that.loading = false;
                    showPage();
                    that.ready();
                });
        }

        if(isPageLoaded()){
            showPage();
        }else{
            loadPage();
        }

    };

    /**
     * @method Paginator#reload
     */
    Paginator.prototype.reload = function(callback){
        var oldPages = this.getPages(),
            that = this;

        oldPages.forEach(
            function(page){
                page.classList.add("discarded");
            });

        this.goTo(1, function(){
            oldPages.forEach(
                function(page){
                    that.dom.removeChild(page);
                });

            if(callback){
                callback();
            }
        });
    };

    /**
     * Removes all pages from the dom
     * @method Paginator#clear
     * @chainable
     */
    Paginator.prototype.clear = function(){
        this.dom.innerHTML = "";
        this.totalPages = undefined;
        this.totalItems = undefined;
        return this;
    };

    Paginator.prototype.getPages = function(){
        return Array.prototype.slice.call(
            this.dom.querySelectorAll(".page") || [], 0);
    };

    return Paginator;
});