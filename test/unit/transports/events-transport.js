'use strict';

const Code = require('@hapi/code');
const Lab = require('@hapi/lab');
const Sinon = require('sinon');

const EventsTransport = require('../../../lib/transports/events-transport');

const lab = exports.lab = Lab.script();
const { it, describe } = lab;
const expect = Code.expect;

describe('event sourcing client rabbit transport', () => {

    const args = [
        { id: 1 },
        {
            key: 'chats.created',
            headers: {
                stream: 'chats',
                streamId: 'xyz',
                eventType: 'created',
                eventId: 'my-id',
                asOf: undefined
            }
        }
    ];

    it('should publish to rabbit', async () => {

        const publish = Sinon.fake();
        const publisher = { publish };
        const info = Sinon.fake();
        const transport = new EventsTransport(publisher, null, { info });

        await transport.publish('chats', 'xyz', 'created', {
            id: 1
        }, 'my-id');

        expect(info.calledOnce).to.equal(true);
        expect(publish.getCall(0).args).to.equal(args);
    });
});
