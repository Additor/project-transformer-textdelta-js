//Load Module
const deltaToPlaintext = require('./index');

//Load snapshot files
const embedJson = require('./snapshots/embed.json');
const fullJson = require('./snapshots/full.json');
const imageJson = require('./snapshots/image.json');
const inlineStyledJson = require('./snapshots/inlineStyled.json');
const listJson = require('./snapshots/list.json');
const tableJson = require('./snapshots/table.json');
const textJson = require('./snapshots/text.json');

//Load result files
const embedPlaintext = require('./result/embed.json');
const fullPlaintext = require('./result/full.json');
const imagePlaintext = require('./result/image.json');
const inlineStyledPlaintext = require('./result/inlineStyled.json');
const listPlaintext = require('./result/list.json');
const tablePlaintext = require('./result/table.json');
const textPlaintext = require('./result/text.json');

//Test cases
describe('Type Check', () =>{
    it('Insert the text `I\'m good.`',()=>{
        return expect(deltaToPlaintext('I`m good.')).rejects.toThrow(TypeError);
    })
    it('Insert the `ops` key, not the array type',()=>{
        return expect(deltaToPlaintext({'ops':{}})).rejects.toThrow(TypeError);
    })
})

describe('Return a plaintext', () => {
    it('snapshots/embed.json to equal plaintext', ()=>{
        return deltaToPlaintext(embedJson).then(function(data){
            expect(data).toBe(embedPlaintext.data);
        });
    });
    it('snapshots/full.json to equal plaintext', ()=>{
        return deltaToPlaintext(fullJson).then(function(data){
            expect(data).toBe(fullPlaintext.data);
        });
    });
    it('snapshots/image.json to equal plaintext', ()=>{
        return deltaToPlaintext(imageJson).then(function(data){
            expect(data).toBe(imagePlaintext.data);
        });
    });
    it('snapshots/inlineStyled.json to equal plaintext', ()=>{
        return deltaToPlaintext(inlineStyledJson).then(function(data){
            expect(data).toBe(inlineStyledPlaintext.data);
        });
    });
    it('snapshots/list.json to equal plaintext', ()=>{
        return deltaToPlaintext(listJson).then(function(data){
            expect(data).toBe(listPlaintext.data);
        });
    });
    it('snapshots/table.json to equal plaintext', ()=>{
        return deltaToPlaintext(tableJson).then(function(data){
            expect(data).toBe(tablePlaintext.data);
        });
    });
    it('snapshots/text.json to equal plaintext', ()=>{
        return deltaToPlaintext(textJson).then(function(data){
            expect(data).toBe(textPlaintext.data);
        });
    });
});