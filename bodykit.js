var client_data = {};
var graphs = {};

window.onload = function() {

    var connection = new WebSocket('ws://localhost:3000');

    connection.onopen = function() {
        console.log('websocket connection opened for connection', connection);
    };

    connection.onerror = function(error) {
        console.log('websocket error', error, 'for connection', connection);
    };

    connection.onmessage = function(e) {
        console.log('websocket message', e, 'for connection', connection);

        update_client_data(e.data);

        _.forEach(client_data, function(d, channel) {
            if (!graph_already_created(channel)) {
                graphs[channel] = create_graph(channel);
            }
            graphs[channel].update(); 
        });
    };
};

function get_fake_server_data() {
    var data = {
        'd0': [],
        'a0': [],
        'a1': [],
        'a2': [],
    };
    _.forEach(data, function(d, channel) {
        for (var i = 0; i < 100; i++) {
            d.push(Math.random());
        }
    });
    return data;
}

function update_client_data(server_data) {
    _.forEach(server_data, function(d, channel) {
        if (!_.has(client_data, channel)) {
            client_data[channel] = [];
        }
        _.forEach(d, function(val, i) {
            client_data[channel].push({
                x: client_data[channel].length,
                y: val
            });
        });
    });
}

function create_graph(channel) {
    $('body').append('<div><h3>'+channel+'</h3><div class="chart" data-channel="'+channel+'"></div>');
   var graph =  new Rickshaw.Graph({
        element: document.querySelector('.chart[data-channel="'+channel+'"]'),
        width: 800,
        height: 100,
        series: [{ color: 'steelblue', data: client_data[channel] }],
    });
    graph.render();
    return graph;
}

function graph_already_created(channel) {
    var $div = $('.chart[data-channel="'+channel+'"]');
    return $div.length > 0;
}

