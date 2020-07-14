'use strict';

const Code = require('@hapi/code');
const Lab = require('@hapi/lab');
const Sinon = require('sinon');

const EventsTransport = require('../../../lib/transports/events-transport');

const lab = exports.lab = Lab.script();
const { it, describe } = lab;
const expect = Code.expect;

describe('events transport', () => {

    it('should publish to rabbit', async () => {

        const publish = Sinon.fake();
        const publisher = { publish };
        const info = Sinon.fake();
        const transport = new EventsTransport(publisher, null, { info });

        await transport.publish('chats', 'xyz', 'created', {
            id: 1
        }, 'my-id');

        expect(info.calledOnce).to.equal(true);
        expect(publish.getCall(0).args).to.equal([
            {
                id: 1,
                stream: 'chats',
                streamId: 'xyz',
                eventType: 'created',
                eventId: 'my-id',
                asOf: undefined
            },
            { key: 'chats.created' }
        ]);
    });

    it('should include metadata, if provided', async () => {

        const publish = Sinon.fake();
        const publisher = { publish };
        const info = Sinon.fake();
        const transport = new EventsTransport(publisher, { data: 'my metadata' }, { info });

        await transport.publish('chats', 'xyz', 'created', {
            id: 1
        }, 'my-id');

        expect(info.calledOnce).to.equal(true);
        expect(publish.getCall(0).args).to.equal([
            {
                id: 1,
                stream: 'chats',
                streamId: 'xyz',
                eventType: 'created',
                eventId: 'my-id',
                asOf: undefined
            },
            { key: 'chats.created', headers: { data: 'my metadata' } }
        ] );
    });
});
