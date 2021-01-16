const process  = require('process')
const axios    = require('axios')
const Airtable = require('airtable')
const STUBS    = require('./stubs')

const apiKey = process.env.AIRTABLE_API_KEY 
const base = new Airtable({apiKey: apiKey}).base(process.env.AIRTABLE_BASE_ID)


async function main() {
    const stockTable = base('Stock')

    base('Stock').select({
        view: 'Grid view'
    }).firstPage(async function(err, records) {
        if (err) {
            console.error(err)
            return
        }

        const awaitables = records.map(async function(record) {
            const store = record.get('Store')

            const digitalUrl = record.get('Digital URL')
            const digitalInStockCallback = STUBS[store].digitalInStockCallback
            const digitalUrlContents = (await axios.get(digitalUrl)).data

            const standardUrl = record.get('Standard URL')
            const standardUrlContents = (await axios.get(standardUrl)).data
            const standardInStockCallback = STUBS[store].standardInStockCallback

            return {
                'id': record.id,
                fields: {
                    'Store': store,
                    'Digital URL': digitalUrl,
                    'Digital Status': digitalInStockCallback(digitalUrlContents) ? 'In Stock' : 'Not In Stock',
                    'Standard URL': standardUrl,
                    'Standard Status': standardInStockCallback(standardUrlContents) ? 'In Stock' : 'Not In Stock',
                }
            }
        })


        base('Stock').replace(await Promise.all(awaitables), function(err, records) {
            if (err) {
                console.error(err)
                return
            }

            records.forEach( r => console.log(r.get('Updated At')))

        })
    })
}

main()
    .then(() => console.log('updating'))
    .catch(e => console.error(e)) //console.error(e))