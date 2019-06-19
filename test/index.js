'use strict';

const Code = require('@hapi/code');
const Lab = require('@hapi/lab');

const lab = exports.lab = Lab.script();
const { it, describe } = lab;
const expect = Code.expect;

describe('event sourcing client', () => {

    it('should be exported as function', () => {

        const Client = require('../index');

        expect(typeof Client).to.equal('function');
    });
});
