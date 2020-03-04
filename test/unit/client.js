'use strict';

const Code = require('@hapi/code');
const Lab = require('@hapi/lab');
const Sinon = require('sinon');

const Client = require('../../lib/client');

const lab = exports.lab = Lab.script();
const { it, describe } = lab;
const expect = Code.expect;
const Joi = require('@hapi/joi');

describe('event sourcing client', () => {

    it('should be exported as function', () => {

        expect(typeof Client).to.equal('function');
    });

    it('should setup default transport', async () => {

        const publisher = {
            publish: Sinon.stub()
        };
        const generator = Sinon.stub();
        const id = 'abc';
        generator.returns(id);

        const sut = Client.default(publisher, generator);
        await sut.publish('stream', 1, 'type', { my: 'data' });
        expect(publisher.publish.calledOnce).to.be.true();
        expect(publisher.publish.getCall(0).args).to.equal([
            {
                data: { my: 'data' },
                stream: 'stream',
                streamId: 1,
                eventType: 'type',
                asOf: undefined,
                eventId: id
            },
            {
                key: `events.stream.created`
            }
        ]);
    });

    describe('validation', () => {

        describe('addPrePublishValidator', () => {

            it('should throw if missing stream or eventType', () => {

                const stream = 'chats';
                const eventType = 'chatCreated';
                const generator = Sinon.fake(() => 'special-id');
                const transport = {
                    publish: Sinon.fake()
                };
                const validJoiSchema = Joi.any();

                const client = new Client(transport, generator);

                expect(() => client.addPrePublishValidator(null, eventType, validJoiSchema)).to.throw(Error, 'Invalid stream or eventType');
                expect(() => client.addPrePublishValidator(stream, null, validJoiSchema)).to.throw(Error, 'Invalid stream or eventType');
            });

            it('should throw if provided invalid joi schema', () => {

                const stream = 'chats';
                const eventType = 'chatCreated';
                const generator = Sinon.fake(() => 'special-id');
                const transport = {
                    publish: Sinon.fake()
                };
                const invalidJoiSchema = { 'invalid': 'schema' };

                const client = new Client(transport, generator);

                expect(() => client.addPrePublishValidator(stream, eventType, invalidJoiSchema)).to.throw(Error, 'Invalid Joi schema');
            });

            it('should register schema for stream + eventType if provided valid Joi schema', () => {

                const stream = 'chats';
                const eventType = 'chatCreated';
                const generator = Sinon.fake(() => 'special-id');
                const transport = {
                    publish: Sinon.fake()
                };
                const validJoiSchema = Joi.any();

                const client = new Client(transport, generator);

                client.addPrePublishValidator(stream, eventType, validJoiSchema);

                expect(client.validateMap.size).to.equal(1);
                expect(client.validateMap.get(`${stream}:${eventType}`)).to.not.be.null();
                expect(Joi.isSchema(client.validateMap.get(`${stream}:${eventType}`))).to.be.true();
            });
        });

        it('should throw if data validation fails for given stream + eventType', async () => {

            const stream = 'chats';
            const streamId = '123';
            const eventType = 'chatCreated';
            const generator = Sinon.fake(() => 'special-id');
            const transport = {
                publish: Sinon.fake()
            };
            const validJoiSchema = Joi.object({
                id: Joi.string(),
                name: Joi.string().valid('Test Org'),
                employees: Joi.number()
            });

            const client = new Client(transport, generator);

            client.addPrePublishValidator(stream, eventType, validJoiSchema);

            const invalidPublishPayloads = [
                { id: 123, name: 'Test Org', employees: 100 },
                { id: 'abc123', name: 'Not Test Org', employees: 100 },
                { id: 'abc123', name: 'Test Org', employees: 'one hundred' }
            ];

            for (const payload of invalidPublishPayloads) {
                await expect(client.publish(stream, streamId, eventType, payload)).to.reject(Error);
            }
        });

        it('should publish if provided valid data for stream + eventType', async () => {

            const stream = 'chats';
            const streamId = '123';
            const eventType = 'chatCreated';
            const data = { id: 'abc123', name: 'Test Org', employees: 100 };
            const generator = Sinon.fake(() => 'special-id');
            const transport = {
                publish: Sinon.fake()
            };
            const schema = Joi.object({
                id: Joi.string(),
                name: Joi.string().valid('Test Org'),
                employees: Joi.number()
            });

            const client = new Client(transport, generator);
            client.addPrePublishValidator(stream, eventType, schema);

            await client.publish(stream, streamId, eventType, data);
            expect(transport.publish.calledOnce).to.equal(true);
            expect(transport.publish.getCall(0).args).to.equal([
                stream,
                streamId,
                eventType,
                data,
                'special-id',
                undefined
            ]);
        });
    });

    it('should delegate publishing to configured transport', async () => {

        const stream = 'chats';
        const streamId = '123';
        const eventType = 'chatCreated';
        const data = { key: 'value' };
        const generator = Sinon.fake(() => 'special-id');
        const transport = {
            publish: Sinon.fake()
        };

        const client = new Client(transport, generator);

        await client.publish(stream, streamId, eventType, data);
        expect(transport.publish.calledOnce).to.equal(true);
        expect(transport.publish.getCall(0).args).to.equal([
            stream,
            streamId,
            eventType,
            data,
            'special-id',
            undefined
        ]);
    });

    it('should generate uuid if no generator supplied', async () => {

        const stream = 'chats';
        const streamId = '123';
        const eventType = 'chatCreated';
        const data = { key: 'value' };
        const transport = {
            publish: Sinon.fake()
        };

        const client = new Client(transport);

        await client.publish(stream, streamId, eventType, data);
        expect(transport.publish.getCall(0).args[4]).to.match(/[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}/);
    });

    it('should use eventid argument if passed', async () => {

        const stream = 'chats';
        const streamId = '123';
        const eventType = 'chatCreated';
        const data = { key: 'value' };
        const transport = {
            publish: Sinon.fake()
        };

        const client = new Client(transport);

        await client.publish(stream, streamId, eventType, data, 'passed-id');
        expect(transport.publish.getCall(0).args[4]).to.equal('passed-id');
    });
});
