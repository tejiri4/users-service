import app from 'src';
import request from 'supertest';
import messages from "utils/messages"

describe('user', () => {
  let newUserId;
  
  const newUser = {
    name: "New user"
  };

  it('should create a new user',(done) => {
    request(app)
      .post(`/v1/users`)
      .expect('Content-Type', /json/)
      .send(newUser)
      .expect(200)
      .end(function(err, res) {
        if (err) throw err;

        const { name, id } = res.body;

        newUserId = id;

        expect(name).toEqual(newUser.name)
        done()
      });
  });

  it('should return all users',(done) => {
      request(app)
      .get('/v1/users')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err, res) {
        if (err) throw err;

        expect(res.body.count).toEqual(1)

        done()
      });
  });

  it('should return a single user',(done) => {
      request(app)
      .get(`/v1/users/${newUserId}`)
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err, res) {
        if (err) throw err;

        const { id, name } = res.body;

        expect(id).toEqual(newUserId)
        expect(name).toEqual(newUser.name)
        done()
      });
  });

  it('should not return a single user with wrong id',(done) => {
      request(app)
      .get(`/v1/users/6`)
      .expect('Content-Type', /json/)
      .expect(400)
      .end(function(err, res) {
        if (err) throw err;

        expect(res.body.message).toEqual(messages.userNotFound)
        done()
      });
  });

  it('should not update a new user with wrong id',(done) => {
    const updateUser = {
      name: "New user modified"
    };

    request(app)
      .put(`/v1/users/6`)
      .expect('Content-Type', /json/)
      .send(updateUser)
      .expect(400)
      .end(function(err, res) {
        if (err) throw err;

        expect(res.body.message).toEqual(messages.userNotFound)
        done()
      });
  });

  it('should update a new user',(done) => {
    const updateUser = {
      name: "New user modified"
    };

    request(app)
      .put(`/v1/users/${newUserId}`)
      .expect('Content-Type', /json/)
      .send(updateUser)
      .expect(200)
      .end(function(err, res) {
        if (err) throw err;

        const { message } = res.body;

        expect(message).toEqual(messages.userUpdated)
        done()
      });
  });

  it('should not delete a user with wrong id',(done) => {
    request(app)
      .delete(`/v1/users/6`)
      .expect('Content-Type', /json/)
      .expect(400)
      .end(function(err, res) {
        if (err) throw err;

        expect(res.body.message).toEqual(messages.userNotFound)
        done()
      });
  });

  it('should delete a user',(done) => {
    request(app)
      .delete(`/v1/users/${newUserId}`)
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err, res) {
        if (err) throw err;

        const { message } = res.body;

        expect(message).toEqual(messages.userDeleted)
        done()
      });
  });
});