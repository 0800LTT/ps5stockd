# PS5Stockd

I got tired of checking multiple stores to see if the PS5 was back in stock.
So I made this tiny program to constantly check the status and update the data in [Airtable](https://airtable.com/).

If you want to change the stores or add new ones, just alter the `stubs.js` file.

You'll need to define the `AIRTABLE_API_KEY` and `AIRTABLE_BASE_ID` environment variables.
The program will pick them up automatically.

## How to use this

```
$ AIRTABLE_API_KEY='<your API key>' AIRTABLE_BASE_ID='<base id>' npm run ps5stockd
```