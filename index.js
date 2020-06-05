const channel = require('./admin/channel');
const methodsProducer = require('./admin/methodsProducer');

exports.getConnection = function(rabbitmqParams) {
    return channel.getConnection(rabbitmqParams)
};

exports.getChannel = function(connection, rabbitmqParams) {
    return channel.getChannel(connection, rabbitmqParams)
};

exports.sendMessageToExchange = function(channel, exchange, routingkey, messageIntoString){
    return methodsProducer.sendMessageToExchange(channel, exchange, routingkey, messageIntoString)
}

exports.sendMessagesToExchangeWithOptions = function(channel, exchange, routingkey, messageIntoString, options){
    return methodsProducer.sendMessagesToExchangeWithOptions(channel, exchange, routingkey, messageIntoString, options)
}

exports.sendMessageToQueue = function(channel, queue, messageIntoString){
    return methodsProducer.sendMessageToQueue(channel, queue, messageIntoString)
}

exports.sendMessagesToQueueWithOptions = function(channel, queue, messageIntoString, options){
    return methodsProducer.sendMessagesToQueueWithOptions((channel, queue, messageIntoString, options))
}