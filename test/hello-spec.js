var hello = require('../src/js/hello');

describe('hello', function () {
  it('should not throw', function () {
    expect(hello).not.toThrow();
  });
});
