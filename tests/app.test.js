const mongoose = require("mongoose");
const request = require("supertest");
const app = require('../app')

beforeEach((done) => {
    mongoose.connect("mongodb://localhost:27017/JestDB",
      { useNewUrlParser: true, useUnifiedTopology: true },
      () => done());
  });
  
afterAll((done) => {
mongoose.connection.db.dropDatabase(() => {
    mongoose.connection.close(() => done())
});
});

describe("POST /signup", () => {

  describe("when passed a username, email and password", () => {
    const post = {name: "username", email: "username@gmail.com", password: ""};
    test("should respond with a 200 status code", async () => {
      const response = await request(app).post("/signup").send({ 
        name: "username",
        email: "username@gmail.com", 
        password: "12345678" 
      })
      expect(response.statusCode).toBe(200)
      expect(response.body.user.name).toBe(post.name)
      expect(response.body.user.email).toBe(post.email)
    })
  });

  describe("when email is missing", () => {
    test("should reponse success:false", async () => {
      const response = await request(app).post("/signup").send({ 
        name: "username1",
        email: "", 
        password: "12345678" 
      })
      expect(response.statusCode).toBe(400)
      expect(response.body.success).toBe(false)
    })
  });

  describe("when try to register another user with exists email", () => {
    test("should reponse email exists", async () => {
      const response = await request(app).post("/signup").send({ 
        name: "Another User",
        email: "username@gmail.com", 
        password: "12345678" 
      })
      expect(response.statusCode).toBe(400)
      expect(response.body.message).toBe("email exists")
    })
  });

});

describe("POST /login", () => {

  describe("If user passed email that is not in database", ()=>{
    test("should reponse email not found", async()=>{
      const response = await request(app).post("/login").send({ 
        email: "wrongemail@gmail.com", 
        password: "12345678" 
      })
      expect(response.body.message).toBe("Auth failed ,email not found")
    })
  });

  describe("If user password is wrong", ()=>{
    test("should reponse password doesn't match", async()=>{
      const response = await request(app).post("/login").send({ 
        email: "username@gmail.com", 
        password: "password111" 
      })
      expect(response.body.message).toBe("password doesn't match")
    })
  });

  describe("If everything is ok", ()=>{
    test("should reponse 200 status", async()=>{
      const response = await request(app).post("/login").send({ 
        email: "username@gmail.com", 
        password: "12345678" 
      })
      expect(response.statusCode).toBe(200)
      expect(response.body.email).toBe("username@gmail.com")
    })
  });

});

describe("GET /logout", ()=>{
  describe("should response 200 status", ()=>{
    test('GET /logout', async () => {
      const response = await request(app).get('/logout');
      expect(response.status).toBe(200);
    });
  });
});

describe("GET /news", ()=>{
  describe("at /news endpoint should return 200 status", ()=>{
    test("GET /news", async()=>{
      const response = await request(app).get('/news');
      expect(response.status).toBe(200);
    });
  });

  describe("at /news?search=politics endpoint should return 200 status", ()=>{
    test("GET /news?search=politics", async()=>{
      const response = await request(app).get('/news?search=politics');
      expect(response.status).toBe(200);
    });
  });

});

describe("GET /weather", ()=>{
  describe("at /weather endpoint should return 200 status", ()=>{
    test("GET /weather", async()=>{
      const response = await request(app).get('/weather');
      expect(response.status).toBe(200);
    });
  });
});