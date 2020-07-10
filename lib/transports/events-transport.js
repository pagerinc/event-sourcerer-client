'use strict';

const Logger = require('@pager/logger');

class EventsTransport {

    constructor(publisher, metadata, logger = Logger) {

        this.publisher = publisher;
        this.metadata = metadata;
        this.logger = logger;
    }

    async publish(stream, streamId, eventType, data, eventId, asOf) {

        this.logger.info({ msg: 'publishing event', stream, streamId, eventType, eventId, asOf });

        const headers = { stream, streamId, eventType, eventId, asOf };

        await this.publisher.publish(data, { key: `${stream}.${eventType}`, headers });
    }
}

module.exports = EventsTransport;
