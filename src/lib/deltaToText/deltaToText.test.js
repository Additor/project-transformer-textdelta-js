//Load Module
const deltaToPlaintext = require('./deltaToText.js');

//Load snapshot files
const embedJson = require('../../test/snapshots/embed.json');
const fullJson = require('../../test/snapshots/full.json');
const imageJson = require('../../test/snapshots/image.json');
const inlineStyledJson = require('../../test/snapshots/inlineStyled.json');
const listJson = require('../../test/snapshots/list.json');
const tableJson = require('../../test/snapshots/table.json');
const textJson = require('../../test/snapshots/text.json');

//Load result files
const embedPlaintext = require('../../test/result/embed.json');
const fullPlaintext = require('../../test/result/full.json');
const imagePlaintext = require('../../test/result/image.json');
const inlineStyledPlaintext = require('../../test/result/inlineStyled.json');
const listPlaintext = require('../../test/result/list.json');
const tablePlaintext = require('../../test/result/table.json');
const textPlaintext = require('../../test/result/text.json');

//Test cases
describe('Type Check', () => {
  it("Insert the text `I'm good.`", () => {
    return expect(deltaToPlaintext('I`m good.')).rejects.toThrow(TypeError);
  });
  it('Insert the `ops` key, not the array type', () => {
    return expect(deltaToPlaintext({ ops: {} })).rejects.toThrow(TypeError);
  });
});

describe('Return a plaintext', () => {
  it('snapshots/embed.json to equal plaintext', () => {
    return deltaToPlaintext(embedJson).then(function(data) {
      expect(data).toBe(embedPlaintext.data);
    });
  });
  it('snapshots/full.json to equal plaintext', () => {
    return deltaToPlaintext(fullJson).then(function(data) {
      expect(data).toBe(fullPlaintext.data);
    });
  });
  it('snapshots/image.json to equal plaintext', () => {
    return deltaToPlaintext(imageJson).then(function(data) {
      expect(data).toBe(imagePlaintext.data);
    });
  });
  it('snapshots/inlineStyled.json to equal plaintext', () => {
    return deltaToPlaintext(inlineStyledJson).then(function(data) {
      expect(data).toBe(inlineStyledPlaintext.data);
    });
  });
  it('snapshots/list.json to equal plaintext', () => {
    return deltaToPlaintext(listJson).then(function(data) {
      expect(data).toBe(listPlaintext.data);
    });
  });
  it('snapshots/table.json to equal plaintext', () => {
    return deltaToPlaintext(tableJson).then(function(data) {
      expect(data).toBe(tablePlaintext.data);
    });
  });
  it('snapshots/text.json to equal plaintext', () => {
    return deltaToPlaintext(textJson).then(function(data) {
      expect(data).toBe(textPlaintext.data);
    });
  });
});
