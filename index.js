const AmiClient = require('asterisk-ami-client');
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });


wss.on('connection', function connection(ws) {
    ws.on('message', function incomin(message) {
        console.log('received: %s', message);
    });

    let client = new AmiClient();

    client.connect('admin', '123456', {
        host: 'localhost',
        port: 5038
    })
        .then(amiConnection => {
            client
                .on('connect', () => console.log('connect'))
                .on('event', event => {
                    console.log('event');
                    console.log(event);
                    ws.send(JSON.stringify(event));
                })
                .on('response', response => {
                    console.log(response)
                    console.log('response')
                    ws.send(JSON.stringify(response));
                })
                .on('disconnect', () => {
                    ws.send("0");
                    console.log('disconnect')
                })
                .on('reconnection', () => {
                    ws.send("1");
                    console.log('reconnection')
                })
                .on('internalError', error => console.log(error))
                .action({
                    Action: 'Ping'
                });
        })
        .catch(error => console.log(error));
});
