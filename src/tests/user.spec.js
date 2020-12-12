import app from 'src';
import crypto from "crypto";
import request from 'supertest';
import { User } from "models";
import testData from "tests/fixtures/testData"
import messages from "utils/messages"

describe('user', () => {
  const users = testData.users;
  let newUserId;

  it('should return all users',(done) => {
    const mock = jest.spyOn(User, 'findAll');

    mock.mockImplementation(() => users);

      request(app)
      .get('/v1/users')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err, res) {
        if (err) throw err;

        expect(res.body.length).toEqual(users.length)

        done()
      });
  });

  it('should return a single user',(done) => {
    const mock = jest.spyOn(User, 'findByPk');

    mock.mockImplementation((id) => users.find(user => user._id === id));

      request(app)
      .get(`/v1/users/${users[0]._id}`)
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err, res) {
        if (err) throw err;

        const { _id, name } = res.body;

        expect(_id).toEqual(users[0]._id)
        expect(name).toEqual(users[0].name)
        done()
      });
  });

  it('should not return a single user with wrong id',(done) => {
    const mock = jest.spyOn(User, 'findByPk');

    mock.mockImplementation((id) => users.find(user => user._id === id));

      request(app)
      .get(`/v1/users/5fd299a5342b1c417a253ce9`)
      .expect('Content-Type', /json/)
      .expect(400)
      .end(function(err, res) {
        if (err) throw err;

        expect(res.body.message).toEqual(messages.userNotFound)
        done()
      });
  });

  it('should create a new user',(done) => {
    const newUser = {
      name: "New user"
    };

    const mock = jest.spyOn(User, 'create');

    mock.mockImplementation(user => {
      const userCreated = { ...user, _id: crypto.randomBytes(12).toString('hex') };

      users.push(userCreated)

      return userCreated;
    });

    request(app)
      .post(`/v1/users`)
      .expect('Content-Type', /json/)
      .send(newUser)
      .expect(200)
      .end(function(err, res) {
        if (err) throw err;

        const { name, _id } = res.body;

        newUserId = _id;

        expect(name).toEqual(newUser.name)
        done()
      });
  });

  it('should not update a new user with wrong id',(done) => {
    const newUser = {
      name: "New user modified"
    };

    const mock = jest.spyOn(User, 'findByPk');

    mock.mockImplementation((id) => {
      return users.find(user => user._id === id)
    });

    request(app)
      .put(`/v1/users/5fd20ccd9514265ca6a9ac8f`)
      .expect('Content-Type', /json/)
      .send(newUser)
      .expect(400)
      .end(function(err, res) {
        if (err) throw err;

        expect(res.body.message).toEqual(messages.userNotFound)
        done()
      });
  });

  it('should update a new user',(done) => {
    const modifiedUser = {
      name: "New user modified"
    };

    const mock = jest.spyOn(User, 'findByPk');

    mock.mockImplementation((id) => {

      return {
        ...users.find(user => user._id === id),
        update: () => {
          const userIndex = users.findIndex((user => user._id === id));

          users[userIndex] = { ...users[userIndex], ...modifiedUser }
        }
      }
    });

    request(app)
      .put(`/v1/users/${newUserId}`)
      .expect('Content-Type', /json/)
      .send(modifiedUser)
      .expect(200)
      .end(function(err, res) {
        if (err) throw err;

        const { message } = res.body;

        expect(message).toEqual(messages.userUpdated)
        done()
      });
  });

  it('should not delete a user with wrong id',(done) => {
    const mock = jest.spyOn(User, 'findByPk');

    mock.mockImplementation((id) => {
      return users.find(user => user._id === id)
    });

    request(app)
      .delete(`/v1/users/5fd20ccd9514265ca6a9ac8f`)
      .expect('Content-Type', /json/)
      .expect(400)
      .end(function(err, res) {
        if (err) throw err;

        expect(res.body.message).toEqual(messages.userNotFound)
        done()
      });
  });

  it('should delete a user',(done) => {
    const mock = jest.spyOn(User, 'findByPk');

    mock.mockImplementation((id) => {
      return {
        ...users.find(user => user._id === id),
        destroy: () => {
          const userIndex = users.findIndex((user => user._id === id));

          users.splice(userIndex, 1);
        }
      }
    });

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