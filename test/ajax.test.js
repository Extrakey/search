define(['ajax'], function(ajax){
    'use strict';
    /* jshint undef: true */
    /* global sinon, describe, beforeEach, afterEach, expect, it */

    describe("ajax module", function(){
        beforeEach(function(){
            var requests = [],
                xhrCallsCount = 0;
            this.xhr = sinon.useFakeXMLHttpRequest();

            this.xhr.onCreate = function (req) {
                requests.push(req);
            };

            this.doResponse = function(state, response, responseXML){
                var request = requests.pop();
                request.readyState = 4;
                request.status = state;
                request.responseXML = responseXML;
                request.responseText = response;
                request.response = response;
                request.onreadystatechange();
                xhrCallsCount++;
                return request;
            };

            this.getXHRCallsCount = function(){
                return xhrCallsCount;
            };
        });

        afterEach(function(){
            this.xhr.restore();
        });

        it("should call the success callback", function () {
            var request,
                spy = sinon.spy();
            ajax.get({url: "myurl"}, spy);

            request = this.doResponse(200, 'myresponse');
            expect(request.url).toBe("myurl");
            expect(spy.calledOnce).toBe(true);
            expect(spy.calledWith("myresponse", 200)).toBe(true);
        });

        it("should call the error callback", function () {
            var request,
                spy = sinon.spy();
            ajax.get({url: "myurl"}, null, spy);

            request = this.doResponse(404, 'myresponse');
            expect(request.url).toBe("myurl");
            expect(spy.calledOnce).toBe(true);
            expect(spy.calledWith("myresponse", 404)).toBe(true);
        });

        describe("check return types", function(){

            beforeEach(function(){
                var that = this;
                this.request = function(url){
                    that.spySuccess = sinon.spy();
                    that.spyError = sinon.spy();
                    ajax.get({url: url || "myurl"}, this.spySuccess, this.spyError);
                };
            });

            it("should return JSON", function(){
                this.request();
                this.doResponse(200, '{"property":"attribute"}');
                expect(this.spySuccess.firstCall.args[0]).toEqual({property: "attribute"});

                this.request();
                this.doResponse(409, '{"property":"attribute"}');
                expect(this.spyError.firstCall.args[0]).toEqual({property: "attribute"});
            });

            it("should return XML #document", function(){
                var responseXML = {};
                this.request();
                this.doResponse(200, '<?xml version="1.0"?><valid>xml</valid>', responseXML);
                expect(this.spySuccess.firstCall.args[0]).toBe(responseXML);

                this.request();
                this.doResponse(409, '<valid>xml</valid>');
                expect(this.spyError.firstCall.args[0]).not.toBe(responseXML);
            });

        });
    });

});