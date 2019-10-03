'use strict';

class RabbitTransport {

    constructor(transports) {

        this.transports = transports;
    }

    publish(stream, streamId, eventType, data, eventId, asOf) {

        return Promise.all(this.transports.map((transport) =>

            transport.publish(stream, streamId, eventType, data, eventId, asOf)
        ));
    }
}

module.exports = RabbitTransport;
