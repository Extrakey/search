/* jshint undef: true */
/* global document, sinon, describe, beforeEach, afterEach, expect, it, xit */

define(['ui/Paginator'], function(Paginator){
    'use strict';

    var paginator;

    describe("Loading data process", function() {
        var writeSpy = sinon.spy(),
            params = {
                elementsPerPage: 5,
                load: function(){},
                write: writeSpy
            },
            loadStub;

        function callLoadCallback(){
            /*jshint validthis:true */
            loadStub.lastCall.args[2].apply(this, arguments);
        }

        beforeEach(function(){
            loadStub = sinon.stub(params, "load");
            paginator = new Paginator(params, params.load, params.write);
        });

        afterEach(function(){
            loadStub.restore();
        });

        it("shouldn't reload twice the same data", function() {
            paginator.goTo(1);
            callLoadCallback([1]);

            paginator.goTo(1);
            expect(loadStub.calledOnce).toBe(true);
        });

        it("shouldn't request twice the same data", function() {
            paginator.goTo(1);
            paginator.goTo(1);
            expect(loadStub.calledOnce).toBe(true);
        });

        it("should call loader", function() {
            paginator.goTo(1);
            expect(loadStub.lastCall.calledWith(1, 5)).toBe(true);
            callLoadCallback([1,2,3,4,5], 20);

            expect(writeSpy.lastCall.args[1]).toEqual([1,2,3,4,5]);
            expect(writeSpy.lastCall.args[2]).toBe(1);

            paginator.goTo(2);
            expect(loadStub.lastCall.calledWith(6, 5)).toBe(true);
            callLoadCallback([6,7,8,9,10], 20);

            expect(writeSpy.lastCall.args[1]).toEqual([6,7,8,9,10]);
            expect(writeSpy.lastCall.args[2]).toBe(2);
        });

        it("should remember the current page", function() {
            paginator.goTo(1);
            callLoadCallback([], 2);
            expect(paginator.currentPage).toBe(1);

            paginator.goTo(2);
            callLoadCallback([], 2);
            expect(paginator.currentPage).toBe(2);
        });

        it("should call ready function", function(done) {
            paginator.ready(done);
            paginator.goTo(1);
            var loadCallback = loadStub.lastCall.args[2];
            loadCallback(['item'], 1);
        });

        it("should call goTo callback", function(done) {
            paginator.goTo(1, done);
            callLoadCallback([], 2);
        });

        it("should reload", function() {
            paginator.goTo(1);
            callLoadCallback([]);

            paginator.reload();
            callLoadCallback([]);
            expect(loadStub.calledTwice).toBe(true);
        });

        it("accepts callback", function(done) {
            paginator.reload(done);
            callLoadCallback([]);
        });

    });

    describe("Preloading data process", function() {
        var writeSpy = sinon.spy(),
            params = {
                elementsPerPage: 5,
                preloadPages: 5,
                startPage: 1,
                load: function(){},
                write: writeSpy
            },
            loadStub;

        function callLoadCallback(){
            /*jshint validthis:true */
            loadStub.lastCall.args[2].apply(this, arguments);
        }

        beforeEach(function(){
            loadStub = sinon.stub(params, "load");
            paginator = new Paginator(params, params.load, params.write);
        });

        afterEach(function() {
            loadStub.callCount = 0;
            loadStub.restore();
        });

        it("should preload the max number of pages", function() {
            expect(loadStub.lastCall.calledWith(1, 25)).toBe(true);
            callLoadCallback(new Array(25), 100);
            expect(writeSpy.callCount).toBe(5);
        });

        // TODO: correct stubbing, it seems not to restore the callCount
        xit("should preload a few pages", function() {
            expect(loadStub.lastCall.calledWith(1, 25)).toBe(true);
            callLoadCallback(new Array(13), 13);
            expect(writeSpy.callCount).toBe(3);
        });

    });

    describe("Calculate total pages", function() {

        function createPaginator(elementsPerPage, totalItems){
            return new Paginator(
                {
                    startPage: 1,
                    elementsPerPage: elementsPerPage
                },
                function(start, count, callback){
                    callback([], totalItems);
                },
                function(){}
            );
        }

        it("should match the calculations", function() {
            expect(createPaginator(10, 0).totalPages).toBe(0);

            expect(createPaginator(1, 1).totalPages).toBe(1);
            expect(createPaginator(10, 1).totalPages).toBe(1);

            expect(createPaginator(5, 10).totalPages).toBe(2);
            expect(createPaginator(5, 21).totalPages).toBe(5);
        });
    });

    describe("Paginator DOM", function() {
        var parent, paginator;

        beforeEach(function() {
            document.body.innerHTML = "<div id='parent'></div>";
            parent = document.querySelector("#parent");

            paginator = new Paginator({
                    parent: parent,
                    startPage: 1
                },
                function(start, count, callback){
                    callback(new Array(count), count * 2);
                },
                function(pageDOM){
                    pageDOM.classList.add('loaded');
                }
            );

        });

        afterEach(function() {
            document.body.innerHTML = "";
        });

        it("should create DOM", function() {
            expect(document.querySelectorAll(".pages").length).toBe(1);
            expect(document.querySelectorAll(".page").length).toBe(1);
            expect(document.querySelectorAll(".page-1").length).toBe(1);
            expect(document.querySelectorAll(".loaded").length).toBe(1);
        });

        it("shouldn't add twice the same page", function() {
            paginator.goTo(1);
            expect(document.querySelectorAll(".page-1").length).toBe(1);
        });

        it("should only display one page at a time", function() {
            paginator.goTo(2);
            var pages = Array.prototype.slice.call(document.querySelectorAll(".page"), 0);
            var visiblePages = pages.filter(
                function(page){
                    return page.style.display === "" ||
                        page.style.display === "block";
                });
            expect(visiblePages.length).toBe(1);
        });

        it("should show the first page", function() {
            paginator.goTo(2);
            paginator.goTo(1);
            expect(document.querySelector(".page-1").style.display).toBe("block");
        });

        it("should remove pages from DOM", function(){
            expect(paginator.clear()).toBe(paginator);
            expect(paginator.totalPages).not.toBeDefined();
            expect(paginator.totalItems).not.toBeDefined();
            expect(document.querySelectorAll(".page").length).toBe(0);
        });

    });

});