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
    it('it should GET all the contacts', (done) => {
      let contact = new Contacts({name: "John", email: "test@gmail.com", gender: "male", phone: "92992987"})
      contact.save((err, contact) => {
        chai.request(index)
          .get('/api/contacts')
          .end((err, res) => {
                res.should.have.status(200);
                res.body.data.should.be.a('array');
                res.body.data.length.should.be.eql(1);
            done();
          });
    });
});

});
/*
* Test the /GET route on a database with document
*/
describe('/POST contact', () => {
  it('it should not POST a contact without name field', (done) => {
    let contact = {
        email: "test@gmail.com",
        gender: "male",
        phone: "88888888"
    }
      chai.request(index)
      .post('/api/contacts')
      .send(contact)
      .end((err, res) => {
            res.should.have.status(400);
            res.body.should.be.a('object');
            res.body.should.have.property('message').eql('name and/or email is missing!')
        done();
      });
  });

  it('it should not POST a contact with duplicate phone field', (done) => {
    let contact = new Contacts({name: "John", email: "test@gmail.com", gender: "male", phone: "92992987"})
    contact.save((err, contact) => {
      contact = {
        name: "josh",
        email: "test2@gmail.com",
        gender: "male",
        phone: "92992987"
    }
      chai.request(index)
      .post('/api/contacts')
      .send(contact)
      .end((err, res) => {
            res.should.have.status(400);
            res.body.should.be.a('object');
            res.body.should.have.property('message').eql('Phone number and/or email already exists')
        done();
      });
    });
  });

  it('it should POST a contact', (done) => {
    let contact = {
      name: "john",
      email: "test@gmail.com",
      gender: "male",
      phone: "88888888"
  }
    chai.request(index)
    .post('/api/contacts')
    .send(contact)
    .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('message')
      done();
    });
  })
});



})
