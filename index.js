const express = require('express');
const app = express();
const api = require('./api');
const bodyParser = require('body-parser');
const Holdings = require('./holdings');

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.post('/dashboard', (req, res) => {
    var newHoldings = new Holdings ({
        asset: req.body.asset,
        amount: parseInt(req.body.amount),
    });

    newHoldings.save( (err) => {
        if (err) {
            res.type('html').status(500);
            res.send('Error: ' + err);
        }
        else {
            res.redirect('dashboard')
        }   
    });
});

app.get('/dashboard', (req, res) => {
    var currency = req.query.currency ? req.query.currency : "usd";
    Holdings.find (async (err, allHoldings) => {
        if (err) {
            res.type('html').status(500);
            res.send('Error: ' + err); 
        }
        else if (allHoldings.length == 0) {
            res.type('html').status(200);
            res.send('You have no holdings');
        }
        else {
            const priceList = {};
            var portfolioValue = 0.0;
            for (const coin of allHoldings) {
                const price = await api.getPrice(coin.asset, currency);
                priceList[coin.asset] = price;
                temp = parseFloat(coin.amount) * parseFloat(price);
                portfolioValue += temp;
            };
            res.render('dashboard', { holdings : allHoldings, priceList : priceList, portfolioValue : portfolioValue, currency : currency, format :  api.format });
        }   
    });
});

app.get('/update', (req, res) => {
    res.render('update', {asset : req.query.asset})
})

app.post('/update', (req, res) => {
    var newAmount = req.body.amount;
    var coin = req.body.asset;


    if (!newAmount) {
        res.type('html').status(500);
        res.send('Error : please enter amount')
    } 
    else if (isNaN(newAmount) || newAmount <= 0) {
        res.type('html').status(500);
        res.send('Error : please enter valid amount')
    }
    else {
        Holdings.findOne({asset : coin}, (err, holding) => {
            if (err) {
                res.type('html').status(500);
                res.send('Error: ' + err);
            }
            else if (!holding) {
                res.type('html').status(200);
                res.send('No holding named ' + coin)
            }
            holding.amount = newAmount;
            holding.save ( (err) => {
                if (err) {
                    res.type('html').status(500);
                    res.send('Error: ' + err);
                }
                else {
                    res.redirect('/dashboard');
                }
            });
        });
    }
});

app.get('/delete', (req, res) => {
    const coin = req.query.asset;
    Holdings.findOneAndRemove({asset : coin}, (err, holding) => {
        if (err) {
            res.type('html').status(500);
            res.send('Error: ' + err);
        }
        else if (!holding) {
            res.type('html').status(200);
            res.send('No holding named ' + coin);
        }
        else {
            res.redirect('/dashboard');
        }
    })
})

app.use('/public', express.static('public'));

app.use('/', (req, res) => {
    res.redirect('/dashboard');
});

app.listen(3000, () => {
    console.log('Listening on port 3000');
})