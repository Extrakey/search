require(['ui/Paginator', 'ui/Pager', 'image/utils', 'google'],
        function(Paginator, Pager, imageUtils, google){
    "use strict";

    var imageSearch, webSearch, pager,
        form = document.querySelector("form");

    imageSearch =
        new Paginator(
            {
                elementsPerPage: 10,
                parent: document.querySelector(".image-search .content")
            },
            function(start, count, callback){
                google.search(
                    {
                        query: form.query.value,
                        start: start,
                        count: count,
                        imageSearch: true
                    },
                    function(data){
                        var total = parseInt(data.searchInformation.totalResults, 10);
                        callback(data.items, total);
                    }
                );
            },
            function(pageDOM, items){
                var i, html = [], item;
                for(i=0; i<items.length; i++){
                    item = items[i];
                    html.push(
                        '<a target="_blank" href="', item.image.contextLink, '">',
                            '<img src="', imageUtils.resize(item.image.thumbnailLink, 80),
                                '" width="80">',
                        '</a>'
                    );
                }
                pageDOM.innerHTML = html.join("");
            });

    webSearch =
        new Paginator(
            {
                elementsPerPage: 4,
                preloadPages: 2,
                parent: document.querySelector(".web-search .content"),
                pager: document.querySelector(".web-search .pager-container")
            },
            function(start, count, callback){
                google.search(
                    {
                        query: form.query.value,
                        start: start,
                        count: count
                    },
                    function(data){
                        var total = parseInt(data.searchInformation.totalResults, 10);
                        callback(data.items, total);
                    }
                );
            },
            function(pageDOM, items){
                var i, html = [], item;
                for(i=0; i<items.length; i++){
                    item = items[i];
                    html.push(
                    '<p>',
                        '<div><b>', item.title, '</b></div>',
                        '<a target="_blank" href="', item.link, '">', item.link, '</a>',
                        '<div>',
                            item.htmlSnippet,
                        '</div>',
                    '</p>');
                }
                pageDOM.innerHTML = html.join("");
            });

    pager = new Pager(
        document.querySelector(".pager-container"),
        webSearch
    );

    form.addEventListener("submit", function(){
        var container = document.querySelector("body .container");
        imageSearch.reload();
        webSearch.reload(pager.refresh);

        container.classList.add("ready");
    });

});
