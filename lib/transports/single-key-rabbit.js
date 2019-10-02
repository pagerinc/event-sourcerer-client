'use strict';

const Logger = require('@pager/logger');

class RabbitTransport {

    constructor(publisher, metadata, logger = Logger) {

        this.publisher = publisher;
        this.metadata = metadata;
        this.logger = logger;
    }

    publish(stream, streamId, eventType, data, eventId, asOf) {

        this.logger.info({ msg: 'publishing event', stream, streamId, eventType, eventId, asOf });

        const options = { key: `events.${stream}.created` };

        if (this.metadata) {
            options.headers = this.metadata;
        }

        return this.publisher.publish(
            {
                data,
                stream,
                streamId,
                eventType,
                eventId,
                asOf
            }, options);
    }
}

module.exports = RabbitTransport;
