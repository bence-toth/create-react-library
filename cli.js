#!/usr/bin/env node
const React = require('react');
const importJsx = require('import-jsx');
const {render} = require('ink');
const meow = require('meow');

const ui = importJsx('./ui');

const {input, flags} = meow(`
	Some help text will come here.
`);

render(
	React.createElement(ui, {
		packageName: input,
		flags
	})
);
