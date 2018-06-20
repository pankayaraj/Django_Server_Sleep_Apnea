//Flot Moving Line Chart

$(function() {
    
    var container = $("#flot-line-chart-moving");
    var y_min = 0;
    var y_max = 120

    // Determine how many data points to keep based on the placeholder's initial size;
    // this gives us a nice high-res plot while avoiding more than one point per pixel.

    var maximum = container.outerWidth() / 2 || 300;

    //

    var data = [];

    function getRandomData() {

        if (data.length) {
            data = data.slice(1);
        }

        while (data.length < maximum) {
            var previous = data.length ? data[data.length - 1] : 50;
            var y = previous + Math.random() * 10 - 5;
            data.push(y < y_min ? 0 : y > y_max ? y_max : y);
        }

        // zip the generated y values with the x values

        var res = [];
        for (var i = 0; i < data.length; ++i) {
            res.push([i, data[i]])
        }

        return res;
    }

    //

    series = [{
        data: getRandomData(),
        lines: {
            fill: true
        }
    }];

    //

    var plot = $.plot(container, series, {
        grid: {
            borderWidth: 1,
            minBorderMargin: 20,
            labelMargin: 10,
            backgroundColor: {
                colors: ["#fff", "#e4f4f4"]
            },
            margin: {
                top: 8,
                bottom: 20,
                left: 20
            },
            //Alterntive colour for grid
            markings: function(axes) {
                var markings = [];
                var xaxis = axes.xaxis;
                for (var x = Math.floor(xaxis.min); x < xaxis.max; x += xaxis.tickSize * 2) {
                    markings.push({
                        xaxis: {
                            from: x,
                            to: x + xaxis.tickSize
                        },
                        color: "rgba(232, 232, 255, 0.2)"
                    });
                }
                return markings;
            }
        },
        xaxis: {
            tickFormatter: function() {
                return "";
            }
        },
        yaxis: {
            min: y_min,
            max: y_max
        },
        legend: {
            show: true
        }
    });

    // Update the random dataset at 25FPS for a smoothly-animating chart
    
    /*
    setInterval(function updateRandom() {
        series[0].data = getRandomData();
        plot.setData(series);
        plot.draw();
    }, 40);
    */
    
    var mqtt;
    var reconnectTimeout = 2000;
    var host = "127.0.0.1";
    var port = 9001;
    var topic = "#"


    function MQTTconnect() {
    if (typeof path == "undefined") {
      path = '/mqtt';
    }
    path = "";

    mqtt = new Paho.MQTT.Client(host, port, path, "web_" + parseInt(Math.random() * 100, 10));
    //mqtt = new Paho.MQTT.Client(host, port, path, "cli1");

    /*
    var options = {
        timeout: 3,
        useSSL: useTLS,
        cleanSession: cleansession,
        onSuccess: onConnect,
        onFailure: function (message) {
            $('#status').val("Connection failed: " + message.errorMessage + "Retrying");
            setTimeout(MQTTconnect, reconnectTimeout);
        }
    };*/

    mqtt.onConnectionLost = onConnectionLost;
    mqtt.onMessageArrived = onMessageArrived;

    /*
    if (username != null) {
        options.userName = username;
        options.password = password;
    }
    */

    var options = {
      timeout : 3,
      onSuccess : onConnect,
    };

    console.log("Host="+ host + ", port=" + port + ", path=" + path + " TLS = " + useTLS + " username=" + username + " password=" + password);

    mqtt.connect(options);
    }

    function onConnect() {
        $('#status').val('Connected to ' + host + ':' + port + path);
        // Connection succeeded; subscribe to our topic
        mqtt.subscribe(topic, {qos: 0});
        $('#topic').val(topic);
    }

    function onConnectionLost(response) {
        setTimeout(MQTTconnect, reconnectTimeout);
        $('#status').val("connection lost: " + responseObject.errorMessage + ". Reconnecting");
    };

    function onMessageArrived(message) {
        
        var topic = message.destinationName;
        var payload = message.payloadString;
        var val = parseInt(payload.split(',')[1]);
        
        plotOnReceive(val);
        
        //$('#ws').prepend('<li>' + topic + ' = ' + payload + '</li>');
    };
    
    function plotOnReceive(val){
        if (data.length) {
            data = data.slice(1);
        }
        
        data.push(val);

        // zip the generated y values with the x values

        var res = [];
        for (var i = 0; i < data.length; ++i) {
            res.push([i, data[i]])
        }

        series[0].data = res;
        
        plot.setData(series);
        plot.draw();

    }


    $(document).ready(function() {
        MQTTconnect();
    });


    

});
