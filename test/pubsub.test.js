describe('Decoupled JS With PubSub', function() {
    var weather, app, ajaxStub;

    //resolve or reject with expected data
    function successResponse() {
        var def = $.Deferred();
        //mock the data from the weather service
        var response = {
            'list': [{
                'name': 'Oslo',
                'wind': {
                    'speed': 666,
                    'gust': 666
                },
                'weather': [{
                    'description': 'windy as hell'
                }]
            }]
        };
        def.resolve(response);
        return def.promise();
    };

    function errorResponse() {
        var def = $.Deferred();
        def.reject({}, {}, "could not complete");
        return def.promise();
    };

    isFunction = function(obj) {
        return !!(obj && obj.constructor && obj.call && obj.apply);
    };

    beforeEach(function(done) {
        ajaxStub = sinon.stub($, "ajax");
        done();
    });

    afterEach(function(done) {
        $.ajax.restore();
        $("#weather").empty();
        done();
    });

    it('should display error on XHR error', function(done) {
        ajaxStub.returns(errorResponse());

        UI.init('weather');
        var weather = new Weather({
            channel: 'weather'
        });
        var app = new App('weather');
        app.getWeather('Thompsons station, tn');

        expect($("#error")).to.be.visible;
        expect($("#weather")).to.be.empty;
        done();
    });

    it('should display weather data for city', function(done) {
        ajaxStub.returns(successResponse());

        UI.init('weather');
        var weather = new Weather({
            channel: 'weather'
        });
        var app = new App('weather');
        app.getWeather('Oslo');

        expect($('#weather-information')).to.have.text('Oslo is windy as hell, wind is 666, gusts of 666');
        done();
    });

});
