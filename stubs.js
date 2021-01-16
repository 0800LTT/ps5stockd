const cheerio = require('cheerio')

const STUBS = {
    'Gamestop': {
        digitalInStockCallback: (pageContents) => {
            const $ = cheerio.load(pageContents)
            const isOutOfStock = $('div#product_2 div.prodBuy').text().toLowerCase().includes('out of stock')
            return !isOutOfStock
        },
        standardInStockCallback: (pageContents) => {
            const $ = cheerio.load(pageContents)
            const isOutOfStock = $('div#product_2 div.prodBuy').text().toLowerCase().includes('out of stock')
            return !isOutOfStock
        }
    },

    'Littlewoods Ireland': {
        digitalInStockCallback: (pageContents) => {
            return !pageContents.includes('https://content.littlewoodsireland.ie/assets/static/2020/09/events/ps5-slices/ps5-stock-coming-soon/registerinterestpage-desktop.jpg')
        },
        standardInStockCallback: (pageContents) => {
            return !pageContents.includes('https://content.littlewoodsireland.ie/assets/static/2020/09/events/ps5-slices/ps5-stock-coming-soon/registerinterestpage-desktop.jpg')
        }
    },

    'Argos': {
        digitalInStockCallback: (pageContents) => {
            const needle = 'Sorry, PlayStation®5 is currently unavailable.'.toLowerCase()
            return !pageContents.toLowerCase().includes(needle)   
        },
        standardInStockCallback: (pageContents) => {
            const needle = 'Sorry, PlayStation®5 is currently unavailable.'.toLowerCase()
            return !pageContents.toLowerCase().includes(needle)   
        }
    },

    'Smyths Toys': {
        digitalInStockCallback: (pageContents) => {
            return !pageContents.toLowerCase().includes('Out of Stock. Expected in stock: January 2021'.toLowerCase())    
        },
        standardInStockCallback: (pageContents) => {
            return !pageContents.toLowerCase().includes('Out of Stock. Expected in stock: January 2021'.toLowerCase())    
        },
    }
}

module.exports = STUBS