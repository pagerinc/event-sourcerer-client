'use strict';

const Code = require('@hapi/code');
const Lab = require('@hapi/lab');
const Sinon = require('sinon');

const RabbitTransport = require('../../lib/transports/multi-key-rabbit');

const lab = exports.lab = Lab.script();
const { it, describe } = lab;
const expect = Code.expect;

describe('event sourcing client legacy rabbit transport', () => {

    it('should publish to rabbit', async () => {

        const publish = Sinon.fake();
        const publisher = { publish };
        const transport = new RabbitTransport(publisher);

        await transport.publish('chats', 'xyz', 'users.joined', { id: 1 });

        expect(publish.calledOnce).to.equal(true);
        expect(publish.getCall(0).args).to.equal([
            { id: 1 },
            { key: 'chats.users.joined' }
        ]);
    });
});
