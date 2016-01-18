var request = require('supertest');
var server = require('./server');

request(server)
    .get('/s')
    .end(function(err,res) {
        console.log(err,res);
    })
