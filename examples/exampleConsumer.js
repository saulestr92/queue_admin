var _ = require('lodash')

const channel = require('../admin/channel')
const data = require('./example.json')


module.exports = (channel) => {
    return (message) => {
        var notification = JSON.parse(message.content.toString())
        console.log('consumer',notification)
        channel.ack(message)
    }
}