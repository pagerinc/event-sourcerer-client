'use strict';

class RabbitTransport {

    constructor(transports) {

        this.transports = transports;
    }

    publish(stream, streamId, eventType, data) {

        return Promise.all(this.transports.map((transport) => {

            return transport.publish(stream, streamId, eventType, data);
        }));
    }
}

module.exports = RabbitTransport;
