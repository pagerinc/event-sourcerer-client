'use strict';

const Code = require('@hapi/code');
const Lab = require('@hapi/lab');
const Sinon = require('sinon');

const RabbitTransport = require('../../lib/transports/multi-key-rabbit');

const lab = exports.lab = Lab.script();
const { it, describe } = lab;
const expect = Code.expect;

describe('event sourcing client legacy rabbit transport', () => {

    it('should publish to rabbit', () => {

        const publish = Sinon.fake();
        const rabbit = {
            topic: () => ({ publish })
        };
        const transport = new RabbitTransport(rabbit, {
            exchangeName: 'events'
        });

        transport.publish('chats', 'xyz', 'users.joined', { id: 1 });

        expect(publish.calledOnce).to.equal(true);
        expect(publish.getCall(0).args).to.equal([
            { id: 1 },
            { key: 'chats.users.joined' }
        ]);
    });

    it('should throw error if options are not valid', () => {

        const publish = Sinon.fake();
        const rabbit = {
            topic: () => ({ publish })
        };

        try {
            new RabbitTransport(rabbit, {});
            Code.fail('transport constructor should throw validation error');
        }
        catch (err) {
            expect(err.isJoi).to.equal(true);
            expect(err.name).to.equal('ValidationError');
            expect(err.message).to.equal('child "exchangeName" fails because ["exchangeName" is required]');
        }
    });
});
