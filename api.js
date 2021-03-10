const fetch = require('node-fetch');

async function getPrice(coin, currency) {
    const uri = 'https://api.coingecko.com/api/v3/simple/price?ids=' + coin + '&vs_currencies=' + currency + '&include_market_cap=false&include_24hr_vol=false&//include_24hr_change=false&//include_last_updated_at=false';
    const fetch_price = await fetch(uri);
    const json = await fetch_price.json();
    const price = await json[coin][currency];
    return price;
};

function format(value, currency) {
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
    })
    
    const formatterEUR = new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 2
    })
    
    const formatterBTC = new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'BTC',
        minimumFractionDigits: 6
    })

    if (currency === 'usd') {
        return formatter.format(value.toString());
    }
    if (currency === 'eur') {
        return formatterEUR.format(value.toString());
    }
    if (currency === 'btc') {
        return formatterBTC.format(value.toString());
    }
}

module.exports = {getPrice, format};