'use strict';

class Client {

    constructor(transport) {

        this.transport = transport;
    }

    publish(stream, streamId, eventType, data) {

        return this.transport.publish(stream, streamId, eventType, data);
    }
}

module.exports = Client;
