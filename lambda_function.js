const process = require('process')
const run = require('./stockd')

exports.handler = async (_) => {
    await run(process.env.AIRTABLE_API_KEY, process.env.AIRTABLE_BASE_ID)
}