'use strict';

const { v4: Uuid } = require('uuid');
const Joi = require('joi');

class Client {

    constructor(transport, idGenerator = Uuid) {

        this.transport = transport;
        this.idGenerator = idGenerator;
        this.validateSchemaMap = new Map();
        this.validateOptionsMap = new Map();
    }

    static default(publisher, idGenerator = Uuid) {

        const EventsTransport = require('./transports/events-transport');

        const defaultTransport = new EventsTransport(publisher);
        return new Client(defaultTransport, idGenerator);
    }

    addPrePublishValidator(stream, eventType, schema, options = { }) {

        if (!stream || !eventType) {
            throw new Error('Invalid stream or eventType');
        }

        if (!Joi.isSchema(schema)) {
            throw new Error('Invalid Joi schema');
        }

        const streamAndEventType = `${stream}:${eventType}`;
        this.validateSchemaMap.set(streamAndEventType, schema);
        this.validateOptionsMap.set(streamAndEventType, options);
    }

    validate(stream, eventType, data) {

        const streamAndEventType = `${stream}:${eventType}`;
        const schema = this.validateSchemaMap.get(streamAndEventType);
        const options = this.validateOptionsMap.get(streamAndEventType);

        if (schema) {
            const validationResult = schema.validate(data, { abortEarly: true, ...options });

            if (validationResult.error) {
                throw new Error(validationResult);
            }
        }
    }

    async publish(stream, streamId, eventType, data, eventId, asOf) {

        if (!streamId) {
            throw new Error('Invalid streamId');
        }

        await this.validate(stream, eventType, data);

        eventId = eventId || this.idGenerator();
        return this.transport.publish(stream, streamId, eventType, data, eventId, asOf);
    }
}

module.exports = Client;
