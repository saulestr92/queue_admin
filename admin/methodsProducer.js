module.exports = {
    sendMessageToExchange (channel, exchange, routingkey, messageIntoString){
        return new Promise((resolve, reject) => {
            channel.checkExchange(exchange).then(ok => {
                channel.publish(exchange, routingkey, new Buffer(messageIntoString))
                resolve('Se entrego el mensaje')
            }).catch(error => {
                reject(error, 'No se envio el mensaje "', messageIntoString, '" al exchange "', exchange,'"')
            })
        })
    },
    sendMessageToQueue (channel, queue, messageIntoString){
        return new Promise((resolve, reject) => {
            channel.checkQueue(queue).then(ok => {
                channel.sendToQueue(queue, new Buffer(messageIntoString))
                resolve('Se entrego el mensaje')
            }).catch(error => {
                reject('No se envio el mensaje "', messageIntoString, '" a la cola "', queue,'"')
            })
        })

    },
    sendMessageToExchangeWithOptions(channel, exchange, routingkey, messageIntoString, options){
        return new Promise((resolve, reject) => {
            channel.checkExchange().then(ok => {
                channel.publish(exchange, routingkey, new Buffer(messageIntoString), options)
                resolve('Se entrego el mensaje')
            }).catch(error => {
                reject('No se envio el mensaje "', messageIntoString, '" al exchange "', exchange,'"')
            })
        })
    },

    sendMessageToQueueWithOptions(channel, queue, messageIntoString, options){
        return new Promise((resolve, reject) => {
            channel.checkQueue(queue).then(ok => {
                channel.sendToQueue(queue, new Buffer(messageIntoString), options)
                resolve('Se entrego el mensaje')
            }).catch(error => {
                reject('No se envio el mensaje "', messageIntoString, '" a la cola "', queue,'"')
            })
        })
    }
};