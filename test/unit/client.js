'use strict';

const Code = require('@hapi/code');
const Lab = require('@hapi/lab');
const Sinon = require('sinon');

const Client = require('../../lib/client');

const lab = exports.lab = Lab.script();
const { it, describe } = lab;
const expect = Code.expect;

describe('event sourcing client', () => {

    it('should be exported as function', () => {

        expect(typeof Client).to.equal('function');
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
