'use strict';

const Logger = require('@pager/logger');

class RabbitTransport {

    constructor(publisher, metadata, logger = Logger) {

        this.publisher = publisher;
        this.metadata = metadata;
        this.logger = logger;
    }

    async publish(stream, streamId, eventType, data, eventId) {

        this.logger.info({ msg: 'publishing event', stream, streamId, eventType, eventId });

        const options = { key: `events.${stream}.created` };

        if (this.metadata) {
            options.headers = this.metadata;
        }

        return await this.publisher.publish(
            {
                data,
                stream,
                streamId,
                eventType,
                eventId
            }, options);
    }
}

module.exports = RabbitTransport;
