declare global {

  export namespace Chai {

    interface LanguageChains {
      always: Assertion;
    }

    interface Assertion {
      /**
       * true if the spy was called at least once.
       */
      requested: Assertion;
      /**
       * @param count The number of recorded calls.
       */
      requestedWith(body: any): Assertion;
      /**
       * true if the spy was called exactly once.
       */
      requestedWithHeaders(headers: object): Assertion;
      /**
       * true if the spy was called exactly twice.
       */
      requestedWithHeadersMatch(headers: object): Assertion;
    }
  }
}

declare var chaiNock: {(chai: any, utils: any): void, setTimeout: (timeout: number) => void};
declare namespace chaiNock { }
export = chaiNock;
