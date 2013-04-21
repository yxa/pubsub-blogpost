var Weather = function(options) {
        options = options || {};
        this.ajax = options.ajax || $.ajax;
        this.channel = postal.channel(options.channel);
        this.channel.subscribe('fetch', this.fetch).withContext(this);
    };

$.extend(Weather.prototype, {
    fetch: function(city) {
        var def = this.ajax({
            url: "http://openweathermap.org/data/2.1/find/name?q=" + city + "&units=imperial",
            dataType: "jsonp",
        });

        //bind 'this' again with jquery proxy
        def.done($.proxy(function(data) {
            this.channel.publish("fetched", data.list[0]);
        }, this));

        def.fail($.proxy(function(request, status, error) {
            this.channel.publish("fetched", null);
        }, this));
    }
});


var App = function(channel) {
        this.channel = postal.channel(channel);
    };

$.extend(App.prototype, {
    getWeather: function(city) {
        this.channel.publish('fetch', city);
    }
});

var UI = {
    init: function(channel) {
        postal.channel(channel).subscribe("fetched", UI.showWeather);
    },
    showWeather: function(data) {
        if (!data) {
            $("#error").show();
        } else {
            var weather = data.weather[0],
                displayWeather = "";

            template = _.template($("#weather-tmpl").html());

            $("#weather").html(template({
                name: data.name,
                description: weather.description,
                speed: data.wind.speed,
                gust: data.wind.gust
            }));
        }
    }
};
