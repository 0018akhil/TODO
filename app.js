const express = require('express');
const app = express();
const pug = require('pug');
const bodyParse = require('body-parser');
const mongoose = require('mongoose');

app.use(bodyParse.urlencoded({ extended: true }));

app.set('view engine', 'pug');

const url = "mongodb://127.0.0.1:27017/datastore";
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

const Schema = mongoose.Schema;

const dataSchema = new Schema({
    itemName: String,
    cheak: { type: Boolean, default: 0 }
});

const listItems = mongoose.model('items', dataSchema);

app.get('/', (req, res) => {
    listItems.find((err, itemList) => {
        res.render('index', { items: itemList });
    });

});

app.post('/', (req, res) => {
    let tasks = req.body.list;
    const item = new listItems({ itemName: tasks });
    item.save();
    res.redirect('/');
});

app.post('/cheaked', (req, res) => {
    const filter = { itemName: req.body.taskname };
    listItems.findOneAndDelete(filter, () => {
        res.redirect('/');
    });
});

app.listen(3030, () => {
    console.log('hosted at port 3030');
});