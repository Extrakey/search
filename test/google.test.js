/* jshint undef: true */
/* global sinon, describe, beforeEach, afterEach, expect, it */

"use strict";

define(["ajax", "google"], function(ajax, google){

    describe("Requesting data form google", function() {
        var ajaxGetStub;

        beforeEach(function() {
            ajaxGetStub = sinon.stub(ajax, "get");
        });

        afterEach(function(){
            ajaxGetStub.restore();
        });

        it("should use Google's API", function() {
            google.search({
                query: 'query',
                count: 10,
                start: 1
            });

            expect(ajaxGetStub.calledOnce).toBe(true);

            var url = ajaxGetStub.lastCall.args[0].url;
            expect(url).toMatch("www.googleapis.com/customsearch/v1");
            expect(url).toMatch(/q=query/);
            expect(url).toMatch(/&num=10/);
            expect(url).toMatch(/&start=1/);

            expect(url).toMatch(/&cx=/);
            expect(url).toMatch(/&key=/);
        });

        describe("Switch between image search / text search", function() {

            it("should search text", function(){
                google.search({
                    query: "query"
                });

                var url = ajaxGetStub.lastCall.args[0].url;
                expect(url).not.toMatch(/searchType=image/);
            });

            it("should search for images", function(){
                google.search({
                    query: "query",
                    imageSearch: true
                });

                var url = ajaxGetStub.lastCall.args[0].url;
                expect(url).toMatch(/&searchType=image/);
            });
        });

    });

});