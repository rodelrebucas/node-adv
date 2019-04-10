const { expect } = require('chai');
const assert = require('assert');

it('should pass always', () => {
  expect(true).to.be.equal(true);
  assert.equal(true, true);
});
