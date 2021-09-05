const assert = require('assert');
const chai = require('chai'), chaiHttp = require('chai-http');
const { expect } = chai;
chai.use(chaiHttp);
const app = 'http://localhost:3000/';

describe('Root Folder', function() {
  describe('#create()', function() {
    it('should return a folder doc', function() {
      chai.request(app)
      .post('v1/folders')
      .send({
        "name": "Test Folder",
        "driveId": "613493eafb13de318bf91ae6"
      }).end(function (err, res){
        expect(res.body.name).to.equal("Test Folder");
      })
    });
  });
});
