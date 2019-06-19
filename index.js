'use strict';


class Client {

    constructor(transport) {

        this.transport = transport;
    }

    publish(stream, eventType, data) {

        return this.transport.publish(stream, eventType, data);
    }
}

module.exports = Client;
