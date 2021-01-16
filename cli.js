#!/usr/bin/env node

const process = require('process')
const run = require('./stockd')

run(process.env.AIRTABLE_API_KEY, process.env.AIRTABLE_BASE_ID)
    .then(() => console.log('All records updated'))
    .catch(e => console.error(e))
