const amqp = require('amqplib')

module.exports = {
    getConnection(rabbitmqParams){
        return getConnection(rabbitmqParams)
    },

    getChannel(connection, jsonConfig){
        let json = null
        try {
            json = JSON.parse(jsonConfig)    
        } catch (error) { 
            console.log(error)
            throw error
        }
        return configurateChannel(connection, json)
    }
}

function getConnection(rabbitmqParams){
    return new Promise((resolve, reject) => {
        try{
            conn = amqp.connect(rabbitmqParams)
            resolve(conn)
        } catch (e) {
            reject(e)
        }
    })
}

function getChannel (connection) {
    return new Promise((resolve, reject) => {
        try{
            channel = connection.createChannel()
            resolve(channel)
        } catch (e) {
            reject(e)
        }
    })
}


function configurateChannel(connection, json) {
    let channel = null
    console.log(json)
    return getChannel(connection).then(ch => {
        console.log(1)
        channel = ch
        return assertQueues(channel, json) 
    })
    .then(()=>{
        console.log(2)
        return assertExchanges(channel, json)
    }).then(()=>{
        console.log(3)
        return assertBindings(channel, json)
    })
    .then(()=>{
        console.log(4)
        return managerEvents(channel)
    }).then(()=>{
        console.log(5)
        return startConsumers(channel, json)
    })
    .then(()=>{
        console.log(6)
        return channel
    })
    .catch((error) => {
        console.log(error)
        return error
    })
}

function assertQueues (channel, json) {
    var asserts = []
    console.log(channel && json && typeof json === 'object' && json.queues && Array.isArray(json.queues) && json.queues.length)
    if (channel && json && typeof json === 'object' && json.queues && Array.isArray(json.queues) && json.queues.length){
        for (let i = 0; i < json.queues.length; i++) {
            let queue = json.queues[i]
            console.log('queue',queue.name, queue.params)
            if (queue.name && typeof queue.name === 'string' && queue.params && typeof queue.params === 'object'){
                asserts.push(channel.assertQueue(queue.name, queue.params))   
            }    
        }
    }
    return Promise.all(asserts).then(() => {
        return channel
    })
}

function assertExchanges (channel, json) {
    var asserts = []
    if (channel && json && typeof json === 'object' && json.exchanges && Array.isArray(json.exchanges) && json.exchanges.length){
        for (let i = 0; i < json.exchanges.length; i++) {
            let exchange = json.exchanges[i]
            console.log('exchange',exchange.name, exchange.type, exchange.params)
            if (exchange.name && typeof exchange.name === 'string' && exchange.type && typeof exchange.type === 'string'){
                asserts.push(channel.assertExchange(exchange.name, exchange.type, exchange.params)) 
            }    
        }
    }
    return Promise.all(asserts).then(() => {
        return channel
    })
}

function assertBindings (channel, json) {
    var asserts = []
    if (channel && json && typeof json === 'object' && json.bindings && Array.isArray(json.bindings) && json.bindings.length){
        for (let i = 0; i < json.bindings.length; i++) {
            let binding = json.bindings[i]
            console.log(binding.queue, binding.exchange, binding.key)
            if (binding.queue && typeof binding.queue === 'string' && binding.exchange && typeof binding.exchange === 'string' && binding.key && typeof binding.key === 'string'){
                asserts.push(channel.bindQueue(binding.queue, binding.exchange, binding.key))
            }    
        }
    }
    return Promise.all(asserts).then(() => {
        return channel
    })
}

function managerEvents (channel){
    channel.on('error', function (error) {
        console.log('El canal se ha cerrado, la información que se envie al canal no será recibida')
    })
}

function startConsumers (channel, json) {
    if (channel && json && typeof json === 'object' && json.consumers && Array.isArray(json.consumers) && json.consumers.length){
        for (let i = 0; i < json.consumers.length; i++) {
            let consumer = json.consumers[i]
            if (consumer.queue && typeof consumer.queue === 'string' && consumer.poolSize && typeof consumer.poolSize === 'number' && consumer.worker && typeof consumer.worker === 'string'){
                for (var n = 0; n < consumer.poolSize; n++) {
                    worker = require(consumer.worker);
                    channel.consume(consumer.queue, worker(channel));
                }
            }    
        }
    }
}



