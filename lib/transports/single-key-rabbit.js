'use strict';

const Joi = require('@hapi/joi');

const optionsSchema = Joi.object({
    exchangeType: Joi.string().allow(['default', 'topic']).default('topic'),
    exchangeName: Joi.string().required()
});

class RabbitTransport {

    constructor(rabbit, options, logger) {

        const { error, value } = Joi.validate(options, optionsSchema);

        if (error) {
            throw error;
        }

        this.rabbit = rabbit;
        this.options = value;
        this.logger = logger;
    }

    publish(stream, streamId, eventType, data) {

        this.logger.info({ msg: 'publishing event', stream, streamId, eventType });
        const exchange = this.rabbit[this.options.exchangeType](this.options.exchangeName);

        return exchange.publish(
            {
                ...data,
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
