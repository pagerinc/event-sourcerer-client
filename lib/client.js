'use strict';

const Uuid = require('uuid/v4');

class Client {

    constructor(transport, idGenerator = Uuid) {

        this.transport = transport;
        this.idGenerator = idGenerator;
    }

    async publish(stream, streamId, eventType, data, eventId, asOf) {

        eventId = eventId || this.idGenerator();
        return await this.transport.publish(stream, streamId, eventType, data, eventId, asOf);
    }
}

module.exports = Client;
