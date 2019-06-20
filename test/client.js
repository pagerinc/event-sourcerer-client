'use strict';

const Code = require('@hapi/code');
const Lab = require('@hapi/lab');

const Client = require('../lib/client');

const lab = exports.lab = Lab.script();
const { it, describe } = lab;
const expect = Code.expect;

describe('event sourcing client', () => {

    it('should be exported as function', () => {

        expect(typeof Client).to.equal('function');
    });

    it('should delegate publishing to configured transport', () => {

        const stream = 'chats';
        const eventType = 'chatCreated';
        const data = { key: 'value' };

        const transport = {
            publish: (_stream, _eventType, _data) => ({
                stream: _stream,
                eventType: _eventType,
                data: _data
            })
        };
        const client = new Client(transport);

        expect(client.publish(stream, eventType, data)).to.equal({
            stream, eventType, data
        });
    });
});
