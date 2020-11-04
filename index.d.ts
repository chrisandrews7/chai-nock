declare global {

  export namespace Chai {

    interface LanguageChains {
      always: Assertion;
    }

    interface Assertion {
      requested: Promise<Assertion>;
      requestedWith(body: any): Promise<Assertion>;
      requestedWithHeaders(headers: object): Promise<Assertion>;
      requestedWithHeadersMatch(headers: object): Promise<Assertion>;
    }
  }
}

declare var chaiNock: {(chai: any, utils: any): void, setTimeout: (timeout: number) => void};
declare namespace chaiNock { }
export = chaiNock;
