const chai = require("chai");
var chaiHttp = require('chai-http');
var should = chai.should();
var assert = require('chai').assert;
var expect = require('chai').expect;

const url = "http://localhost:3000";

chai.use(chaiHttp);

describe('Blobs', function() {
  it('should list all expenses / GET');
  it('should successfully add expense / PUT');
  it('should successfully delete expense /clear DELETE');
})

it('should list all expenses / GET',function(done){
  chai.request(url)
  .get("/")
  .end(function(err, res){
    res.should.have.status("200");
    res.body.should.be.a("array");
    assert.isAtLeast(res.body.length,1,"Length is " + res.body.length);
    done();
  });
})

it('should successfully add expense /add PUT',function (done) {
    chai.request(url)
    .put("/add")
    .send({"name":"test_name","money":"15.00","currency":"EUR","expense":"2099-07-25"})
    .end(function (err, res) {
      res.should.have.status("200");
      chai.request(url)
      .get("/")
      .end(function(err, res){        
        res.should.have.status("200");
        res.body.should.be.a("array");
        expect(res.body).to.deep.include.members([{"name":"test_name","money":"15.00","currency":"EUR","expense":"2099-07-25"}]);
        done();
      });
    })
});

it('should successfully delete expense /clear DELETE',function (done) {
    chai.request(url)
    .delete("/clear?expense=2099-07-25")
    .send({"expense":"2099-07-25"})
    .end(function (err, res) {      
      res.should.have.status("200");
      chai.request(url)
      .get("/")
      .end(function(err, res){        
        res.should.have.status("200");
        res.body.should.be.a("array");
        expect(res.body).to.not.deep.include.members([{"expense":"2099-07-25"}]);        
        done();
      });
    })
});
