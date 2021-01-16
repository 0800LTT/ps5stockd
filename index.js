const process  = require('process')
const axios    = require('axios')
const Airtable = require('airtable')
const STUBS    = require('./stubs')
const dateFormat = require('dateformat')

const apiKey = process.env.AIRTABLE_API_KEY 
const base = new Airtable({apiKey: apiKey}).base(process.env.AIRTABLE_BASE_ID)


async function main() {
    const stockTable = base('Stock')

    const records = await base('Stock').select({
        view: 'Grid view'
    }).firstPage()
    

    const now = new Date()
    const nowString = dateFormat(now, 'dddd, mmmm dS, yyyy, h:MM:ss TT')

    const awaitables = records.map(async function(record) {
            const store = record.get('Store')

            console.log(`Fetching ${store} digital console status`)
            const digitalUrl = record.get('Digital URL')
            const digitalInStockCallback = STUBS[store].digitalInStockCallback
            const digitalUrlContents = (await axios.get(digitalUrl)).data

            
            console.log(`Fetching ${store} standard console status`)
            const standardUrl = record.get('Standard URL')
            const standardUrlContents = (await axios.get(standardUrl)).data
            const standardInStockCallback = STUBS[store].standardInStockCallback

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
        })

    await base('Stock').replace(await Promise.all(awaitables))
}

main()
    .then(() => console.log('All records updated'))
    .catch(e => console.error(e)) //console.error(e))