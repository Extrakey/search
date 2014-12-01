define([], function(){
    "use strict";
    /** @namespace ui */

    /**
     * Offers controls to handle a Paginator
     * @class Pager
     * @memberOf ui
     * @param {DOM} parent
     * @param {ui/Paginator} paginator
     * @depends ui/Paginator
     */
    function Pager(parent, paginator){
        var dom,
            that = this,
            shortcuts = {};

        function createLi(className){
            var li = document.createElement("li");
            li.className = className;
            return li;
        }

        function createDOM(){
            var ol = document.createElement("ol");
            ol.className = "pager";

            shortcuts.prev = createLi("prev");
            shortcuts.current = createLi("current");
            shortcuts.next = createLi("next");

            ol.appendChild(shortcuts.prev);
            ol.appendChild(shortcuts.current);
            ol.appendChild(shortcuts.next);

            parent.appendChild(ol);
            return ol;
        }

        function hasPreviousPage(){
            return paginator.currentPage > 1;
        }

        function hasNextPage(){
            return paginator.currentPage < paginator.totalPages;
        }

        /**
         * @method Pager#refresh
         */
        this.refresh = function(){
            if(!shortcuts.current){
                return;
            }

            shortcuts.prev.textContent =
                hasPreviousPage() ? paginator.currentPage - 1 : "";

            shortcuts.current.textContent =
                paginator.totalPages > 0 ? paginator.currentPage : "";

            shortcuts.next.textContent =
                hasNextPage() ? paginator.currentPage + 1 : "";
        };

        this.click = function(li){
            paginator.goTo(
                parseInt(li.textContent, 10),
                function(){
                    that.refresh();
                });
        };

        paginator.ready(function(){
            dom = createDOM();
            that.refresh();

            dom.addEventListener("click",
                function(oEvent){
                    if((/li/i).test(oEvent.target.nodeName)){
                        that.click(oEvent.target);
                    }
                });
        });

    }

    return Pager;
});