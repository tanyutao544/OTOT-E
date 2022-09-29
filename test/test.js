process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
let Contacts = require('../contactModel');

let chai = require('chai');
let chaiHttp = require('chai-http');
let index = require('../index.js');
let should = chai.should();


chai.use(chaiHttp);

describe('Contacts', () => {
  beforeEach((done) => { //Before each test we empty the database
      Contacts.remove({}, (err) => { 
         done();           
      });        
  });
/*
* Test the /GET route on an empty database
*/
describe('/GET contacts', () => {
    it('it should GET all the contacts', (done) => {
      chai.request(index)
          .get('/api/contacts')
          .end((err, res) => {
                res.should.have.status(200);
                res.body.data.should.be.a('array');
                res.body.data.length.should.be.eql(0);
            done();
          });
    });
});

});