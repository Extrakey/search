/* jshint undef: true */
/* global document, describe, expect, it */

define(['ui/Pager', 'ui/Paginator'], function(Pager, Paginator){
    'use strict';

    describe("DOM", function() {
        var paginator, pager;

        function create(totalPages){

            document.body.innerHTML = "";

            paginator = new Paginator(
                {
                    elementsPerPage: 1,
                    startPage: 1
                },
                function(start, count, callback){
                    callback([], totalPages);
                },
                function(){ }
            );

            pager = new Pager(document.body, paginator);
        }

        function getVisiblePageNumbers(){
            return (document.querySelector("ol.pager").innerText.match(/\d+/g) || [])
                .map(function(pageNumberAsText){
                    return parseInt(pageNumberAsText);
                });
        }

        it("list", function() {
            create();
            expect(document.querySelectorAll("ol").length).toBe(1);
            expect(document.querySelectorAll("li").length).toBe(3);
        });

        it("should display 3 pages at maximun", function() {
            create(0);
            expect(getVisiblePageNumbers()).toEqual([]);

            create(1);
            expect(getVisiblePageNumbers()).toEqual([1]);

            create(2);
            expect(getVisiblePageNumbers()).toEqual([1,2]);

            create(3);
            expect(getVisiblePageNumbers()).toEqual([1,2]);

        });

        it("should call paginator", function() {
            create(6);
            expect(paginator.currentPage).toBe(1);

            pager.click(document.querySelectorAll("li")[2]);
            expect(paginator.currentPage).toBe(2);
            expect(getVisiblePageNumbers()).toEqual([1,2,3]);

            pager.click(document.querySelectorAll("li")[2]);
            expect(paginator.currentPage).toBe(3);
            expect(getVisiblePageNumbers()).toEqual([2,3,4]);
        });

    });
});