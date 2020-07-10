'use strict';

const { v4: Uuid } = require('uuid');
const Joi = require('@hapi/joi');

class Client {

    constructor(transport, idGenerator = Uuid) {

        this.transport = transport;
        this.idGenerator = idGenerator;
        this.validateMap = new Map();
    }

    static default(publisher, idGenerator = Uuid) {

        const EventsTransport = require('./transports/events-transport');

        const defaultTransport = new EventsTransport(publisher);
        return new Client(defaultTransport, idGenerator);
    }

    addPrePublishValidator(stream, eventType, validationSchema) {

        if (!stream || !eventType) {
            throw new Error('Invalid stream or eventType');
        }

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

        if (!streamId) {
            throw new Error('Invalid streamId');
        }

        await this.validate(stream, eventType, data);

        eventId = eventId || this.idGenerator();
        return this.transport.publisher.publish(stream, streamId, eventType, data, eventId, asOf);
    }
}

module.exports = Client;
