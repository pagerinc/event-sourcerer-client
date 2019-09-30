'use strict';

const Uuid = require('uuid/v4');
const Joi = require('@hapi/joi');

class Client {

    constructor(transport, idGenerator = Uuid) {

        this.transport = transport;
        this.idGenerator = idGenerator;
        this.validateMap = new Map();
    }

    addPrePublishValidator(stream, eventType, validationSchema) {

        if (!Joi.isSchema(validationSchema)) {
            throw new Error('Invalid Joi schema');
        }

        const streamAndEventType = `${stream}:${eventType}`;
        this.validateMap.set(streamAndEventType, validationSchema);
    }

    validate(stream, eventType, data) {

        const streamAndEventType = `${stream}:${eventType}`;
        const streamEventTypeSchema = this.validateMap.get(streamAndEventType);

        if (streamEventTypeSchema) {
            const validationResult = streamEventTypeSchema.validate(data, { abortEarly: true });

            if (validationResult.error) {
                throw validationResult.error;
            }
        }
    }

    async publish(stream, streamId, eventType, data, eventId, asOf) {

        this.validate(stream, eventType, data);

        return await this.validatedPublish(stream, streamId, eventType, data, eventId, asOf);
    }

    async validatedPublish(stream, streamId, eventType, data, eventId, asOf) {

        eventId = eventId || this.idGenerator();
        return await this.transport.publish(stream, streamId, eventType, data, eventId, asOf);
    }
}

module.exports = Client;
