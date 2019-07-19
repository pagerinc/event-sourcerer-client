'use strict';

const Logger = require('@pager/logger');

class RabbitTransport {

    constructor(publisher, logger = Logger) {

        this.publisher = publisher;
        this.logger = logger;
    }

    async publish(stream, streamId, eventType, data, eventId) {

        this.logger.info({ msg: 'publishing event', stream, streamId, eventType, eventId });

        return await this.publisher.publish(
            {
                data,
                stream,
                streamId,
                eventType,
                eventId
            },
            {
                key: `events.${stream}.created`
            }
        );
    }
}

module.exports = RabbitTransport;
