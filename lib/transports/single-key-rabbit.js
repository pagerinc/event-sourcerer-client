'use strict';

const Logger = require('@pager/logger');

class RabbitTransport {

    constructor(publisher, metdadata, logger = Logger) {

        this.publisher = publisher;
        this.metdadata = metdadata;
        this.logger = logger;
    }

    async publish(stream, streamId, eventType, data, eventId) {

        this.logger.info({ msg: 'publishing event', stream, streamId, eventType, eventId });

        const options = { key: `events.${stream}.created` };

        if (this.metdadata) {
            options.headers = this.metdadata;
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
