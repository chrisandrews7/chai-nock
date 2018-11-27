const { expect, use} = require('chai');
const nock = require('nock');
const request = require('request-promise-native');

const nockChai = require('../lib/nock-chai');
use(nockChai);

describe('requestedWith() assertions', () => {
  const TEST_URL = 'http://someurl.com';
  const mockArgument = {
    test: 12345,
    value: 6789,
  };

  afterEach(() => {
    nock.cleanAll();
  });

  describe('when asserting on a type that is not a Nock', () => {
    it('throws a type error', () => {
      expect(
        () => expect('NOT_A_NOCK').to.have.been.requestedWith()
      ).to.throw(TypeError);

      expect(
        () => expect({}).to.have.been.requestedWith()
      ).to.throw(TypeError);

      expect(
        () => expect(nock('http://url-without.a').get('/interceptor')).to.have.been.requestedWith()
      ).to.throw(TypeError);
    });
  });

  describe('.requestedWith()', () => {
    describe('when a request to the nock has been made with the correct argument', () => {
      describe('with a simple argument', () => {
        it('passes', () => {
          const requestNock = nock(TEST_URL).get('/').reply(200, 'test');
          request(TEST_URL);
  
          return expect(requestNock).to.have.been.requestedWith('test');
        });
      });

      describe('with an Object as an argument', () => {
        it('passes', () => {
          const requestNock = nock(TEST_URL).get('/').reply(200, mockArgument);
          request(TEST_URL);
  
          return expect(requestNock).to.have.been.requestedWith(mockArgument);
        });
      });
    });

    describe('when a request to the nock has been made but with incorrect arguments', () => {
      it('throws', (done) => {
        const requestNock = nock(TEST_URL).get('/').reply(200, { test: 1 });
        request(TEST_URL);

        const assertion = expect(requestNock).to.have.been.requestedWith(mockArgument);

        return assertion
        .then(() => done.fail('Should have thrown an error'))
        .catch((err) => {
          expect(err.message).to.equal('expected Nock to have been requested with { test: 12345, value: 6789 }, but was requested with { test: 1 }');
          done();
        });
      });
    });
    
    describe('when a request to the nock has not been made', () => {
      it('throws', (done) => {
        const requestNock = nock(TEST_URL).get('/').reply(200);

        const assertion = expect(requestNock).to.have.been.requestedWith(mockArgument);

        return assertion
          .then(() => done.fail('Should have thrown an error'))
          .catch((err) => {
            expect(err.message).to.equal('expected Nock to have been requested, but it was never called');
            done();
          });
      });
    });
  });

  describe('.not.requestedWith()', () => {
    describe('when a request to the nock has been made with the incorrect arguments', () => {
      it('passes', () => {
        const requestNock = nock(TEST_URL).get('/').reply(200, mockArgument);
        request(TEST_URL);

        return expect(requestNock).not.to.have.been.requestedWith('different_value');
      });
    });

    describe('when a request to the nock has not been made', () => {
      it('passes', () => {
        const requestNock = nock(TEST_URL).get('/').reply(200);

        return expect(requestNock).not.to.have.been.requestedWith('different_value');
      });
    });

    describe('when a request to the nock has been made with matching arguments', () => {
      it('throws', (done) => {
        const requestNock = nock(TEST_URL).get('/').reply(200, mockArgument);
        request(TEST_URL);

        const assertion = expect(requestNock).not.to.have.been.requestedWith(mockArgument);

        return assertion
        .then(() => done.fail('Should have thrown an error'))
        .catch((err) => {
          expect(err.message).to.equal('expected Nock to have not been requested with { test: 12345, value: 6789 }');
          done();
        });
      });
    });
  });
});
