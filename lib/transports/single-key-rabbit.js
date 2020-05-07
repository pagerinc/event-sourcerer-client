'use strict';

const Logger = require('@pager/logger');

class RabbitTransport {

    constructor(publisher, metadata, logger = Logger) {

        this.publisher = publisher;
        this.metadata = metadata;
        this.logger = logger;
    }

    async publish(stream, streamId, eventType, data, eventId, asOf) {

        this.logger.info({ msg: 'publishing event', stream, streamId, eventType, eventId, asOf });

        const options = { key: `events.${stream}.created` };

        const eventOptions = { key: 'events.persistence' };

        if (this.metadata) {
            options.headers = this.metadata;
            eventOptions.headers = this.metadata;
        }

        await this.publisher.publish({ data }, eventOptions);

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
