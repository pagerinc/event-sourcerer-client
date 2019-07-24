'use strict';

const Code = require('@hapi/code');
const Lab = require('@hapi/lab');
const Sinon = require('sinon');

const RabbitTransport = require('../../../lib/transports/single-key-rabbit');

const lab = exports.lab = Lab.script();
const { it, describe } = lab;
const expect = Code.expect;

describe('event sourcing client rabbit transport', () => {

    it('should publish to rabbit', async () => {

        const publish = Sinon.fake();
        const publisher = { publish };
        const info = Sinon.fake();
        const transport = new RabbitTransport(publisher, null, { info });

        await transport.publish('chats', 'xyz', 'created', {
            id: 1
        }, 'my-id');

        expect(info.calledOnce).to.equal(true);
        expect(publish.calledOnce).to.equal(true);
        expect(publish.getCall(0).args).to.equal([
            { data: { id: 1 }, stream: 'chats', streamId: 'xyz', eventType: 'created', eventId: 'my-id' },
            { key: 'events.chats.created' }
        ]);
    });

    it('should publish metadata to rabbit', async () => {

        const publish = Sinon.fake();
        const publisher = { publish };
        const info = Sinon.fake();
        const transport = new RabbitTransport(publisher, { sample: 'metadata' }, { info });

        await transport.publish('chats', 'xyz', 'created', {
            id: 1
        }, 'my-id');

        expect(info.calledOnce).to.equal(true);
        expect(publish.calledOnce).to.equal(true);
        expect(publish.getCall(0).args).to.equal([
            { data: { id: 1 }, stream: 'chats', streamId: 'xyz', eventType: 'created', eventId: 'my-id' },
            { key: 'events.chats.created', headers: { sample: 'metadata' } }
        ]);
    });
});
