'use strict';

const Code = require('@hapi/code');
const Lab = require('@hapi/lab');
const Sinon = require('sinon');

const RabbitTransport = require('../../lib/transports/single-key-rabbit');

const lab = exports.lab = Lab.script();
const { it, describe } = lab;
const expect = Code.expect;

describe('event sourcing client rabbit transport', () => {

    it('should publish to rabbit', () => {

        const publish = Sinon.fake();
        const info = Sinon.fake();
        const rabbit = {
            topic: () => ({ publish })
        };
        const transport = new RabbitTransport(rabbit, {
            exchangeName: 'events'
        }, { info });

        transport.publish('chats', 'xyz', 'created', {
            id: 1
        });

        expect(info.calledOnce).to.equal(true);
        expect(publish.calledOnce).to.equal(true);
        expect(publish.getCall(0).args).to.equal([
            { id: 1, stream: 'chats', streamId: 'xyz', eventType: 'created' },
            { key: 'events.chats.created' }
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
