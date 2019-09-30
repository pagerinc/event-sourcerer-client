'use strict';

const Uuid = require('uuid/v4');
const Joi = require('@hapi/joi');

class Client {

    constructor(transport, idGenerator = Uuid) {

        this.transport = transport;
        this.idGenerator = idGenerator;
        this.validateMap = new Map();
    }

    addValidator(stream, eventType, validationSchema) {

        const streamAndEventType = `${stream}:${eventType}`;
        this.validateMap.set(streamAndEventType, validationSchema);
    }

    validate(stream, eventType, data) {

        const streamAndEventType = `${stream}:${eventType}`;
        const streamEventTypeSchema = this.validateMap.get(streamAndEventType);

        if (streamEventTypeSchema) {
            const validationResult = streamEventTypeSchema.validate(data, { abortEarly: true });

            if (validationResult.error) {
                return false;
            }
        }

        return true;
    }

    async publish(stream, streamId, eventType, data, eventId, asOf) {

        return await new Promise((resolve, reject) => {

            const payloadValid = this.validate(stream, eventType, data);

            if (!payloadValid) {
                reject('validation err');
            }

            resolve(this.validatedPublish(stream, streamId, eventType, data, eventId, asOf));
        });
    }

    async validatedPublish(stream, streamId, eventType, data, eventId, asOf) {

        eventId = eventId || this.idGenerator();
        return await this.transport.publish(stream, streamId, eventType, data, eventId, asOf);
    }
}

module.exports = Client;
