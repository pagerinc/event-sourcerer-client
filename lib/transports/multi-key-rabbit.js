'use strict';

class RabbitTransport {

    constructor(publisher, logger) {

        this.publisher = publisher;
        this.logger = logger;
    }

    async publish(stream, streamId, eventType, data) {

        return await this.publisher.publish(data, {
            key: `${stream}.${eventType}`
        });
    }
}

module.exports = RabbitTransport;
