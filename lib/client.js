'use strict';

class Client {

    constructor(transport) {

        this.transport = transport;
    }

    async publish(stream, streamId, eventType, data) {

        return await this.transport.publish(stream, streamId, eventType, data);
    }
}

module.exports = Client;
