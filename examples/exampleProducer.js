var _ = require('lodash')
const data = require('./example.json')
const lib = require('./../index')
var rabbitmqParams = {
    protocol: 'amqp',
    hostname: 'localhost',
    port: '5672',
    username: 'guest',
    password: 'guest',
    vhost: ''
}
lib.getConnection(rabbitmqParams).then(connection=>{
    lib.getChannel(connection, JSON.stringify(data)).then(channel=>{
        let message = {
            timestamp: new Date(),
            context: 'mensaje',
            number: 200
        }
        lib.sendMessageToExchange(channel,'EXCHANGE_TEST1', 'test1', JSON.stringify(message))
    }).catch(error=>{
        console.log(error)
    })
}).catch(error=>{
    console.log(error)
});
