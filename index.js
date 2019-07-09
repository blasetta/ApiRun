
'use strict';

const express = require('express');
const app = express();

var config = require('./config');

const {Datastore} = require('@google-cloud/datastore');
const ds = new Datastore();
const kind = 'Book';

// Imports the Google Cloud client library.
const {Storage} = require('@google-cloud/storage');

// Instantiates a client. If you don't specify credentials when constructing
// the client, the client library will look for credentials in the
// environment.
const storage = new Storage();

// Makes an authenticated API request.
app.get('/store', (req, res) => {
    console.log('ci sono :');
    storage
        .getBuckets()
        .then((results) => {
            const buckets = results[0];
            res.json({
                buckets: buckets,
                result: "OK"
            });
            console.log('Buckets:');
            buckets.forEach((bucket) => {
                console.log(bucket.name);
            });

        })
        .catch((err) => {
            console.error('ERROR:', err);
            res.json({
                error: err,
                result: "KO"
            });
        });
});

app.get('/', (req, res) => {
    console.log('Hello world received a request.');

    const target = process.env.TARGET || 'World';
    res.send(`Hello ${target}!`);
});

app.get('/set', (req, res) => {
    console.log('Hello world received a request.');

    const target = process.env.TARGET || 'set';
    res.send(`Hello ${target}!`);
});


app.get('/get', (req, res) => {
    console.log('Hello world received a request.');

    const target = process.env.TARGET || 'get';
    res.send(`Hello ${target}!`);
});

app.get('/q', (req, res) => {

    const myquery = ds.createQuery([kind]);
    /*.limit(limit)
     .order('title')
     .start(token);*/

    ds.runQuery(myquery, (err, entities, nextQuery) => {
        if (err) {
            console.log(err);
            return;
        }
        const hasMore =
            (nextQuery.moreResults !== Datastore.NO_MORE_RESULTS)
                ? nextQuery.endCursor
                : false;
        // use your nice callback
        res.json({
            items: entities,
            nextPageToken: hasMore
        });
    });
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log('Hello world listening on port', port);
});