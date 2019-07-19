'use strict';

const Logger = require('@pager/logger');

class RabbitTransport {

    constructor(publisher, logger = Logger) {

        this.publisher = publisher;
        this.logger = logger;
    }

    async publish(stream, streamId, eventType, data) {

        this.logger.info({ msg: 'publishing event', stream, streamId, eventType });

        return await this.publisher.publish(
            {
                data,
                stream,
                streamId,
                eventType
            },
            {
                key: `events.${stream}.created`
            }
        );
    }
}

module.exports = RabbitTransport;
