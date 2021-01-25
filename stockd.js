#!/usr/bin/env node
const Airtable   = require('airtable')
const dateFormat = require('dateformat')
const fetch      = require('node-fetch')
const STUBS      = require('./stubs')

async function getPageContents(url) {
    const response = await fetch(url)
    return await response.text()
}

async function getStockInfo(record, nowString) {
    const store = record.get('Store')

    console.log(`Fetching ${store} digital console status`)
    const digitalUrl = record.get('Digital URL')
    const digitalInStockCallback = STUBS[store].digitalInStockCallback

    let digitalUrlContents = ''
    if (digitalUrl !== undefined) {
        digitalUrlContents = await getPageContents(digitalUrl)
    }

    const standardUrl = record.get('Standard URL')
    const standardInStockCallback = STUBS[store].standardInStockCallback
    let standardUrlContents = ''
    if (standardUrl !== undefined) {
        standardUrlContents = await getPageContents(standardUrl)
    }

    console.log(`Fetched ${store} data`)

    return {
        'id': record.id,
        fields: {
            'Store': store,
            'Digital URL': digitalUrl,
            'Digital Status': digitalInStockCallback(digitalUrlContents) ? 'In Stock' : 'Not In Stock',
            'Standard URL': standardUrl,
            'Standard Status': standardInStockCallback(standardUrlContents) ? 'In Stock' : 'Not In Stock',
            'Updated At': nowString, 
        }
    }
}

async function run(apiKey, baseId) {
    const base = new Airtable({apiKey: apiKey}).base(baseId)
    const stockTable = base('Stock')

    const records = await base('Stock').select({
        view: 'Grid view'
    }).firstPage()
    

    const now = new Date()
    const nowString = dateFormat(now, 'dddd, mmmm dS, yyyy, h:MM:ss TT')

    for (let i = 0; i < records.length; i++) {
        if (records[i].get('Store') === 'Littlewoods Ireland') continue
        let stockInfo = await getStockInfo(records[i], nowString)
        console.log(stockInfo)

        base('Stock').replace([stockInfo])
    }

}

module.exports = run
