var assert = chai.assert;
var expect = chai.expect;

mocha.setup({
    ui: 'bdd',
    globals: [ ]
});

_.templateSettings = { interpolate : /\{\{(.+?)\}\}/g };
