'use strict';

const Logger = require('@pager/logger');

class EventsTransport {

    constructor(publisher, metadata, logger = Logger) {

        this.publisher = publisher;
        this.metadata = metadata;
        this.logger = logger;
    }

    publish(stream, streamId, eventType, data, eventId, asOf) {

        this.logger.info({ msg: 'publishing event', stream, streamId, eventType, eventId, asOf });

        const options = { key: `${stream}.${eventType}` };

        if (this.metadata) {
            options.headers = this.metadata;
        }

        return this.publisher.publish({ ...data, stream, streamId, eventType, eventId, asOf }, options);
    }
}

module.exports = EventsTransport;
