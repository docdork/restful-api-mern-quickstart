const { connection, Schema } = require("mongoose");
const crypto = require("crypto");

// define the schema
const UserSchema = new Schema({
  username: {
    type: String,
    minlength: 4,
    maxlength: 20,
    required: [true, "username field required."],
    validate: {
      validator: function (value) {
        return /^[a-zA-Z]+$/.test(value);
      },
      message: "{VALUE} is not a valid usrname",
    },
  },
  password: String,
});

// define a static model method for login
UserSchema.static("login", async function (usr, pwd) {
  const hash = crypto.createHash("sha256").update(String(pwd));
  const user = await this.findOne()
    .where("username")
    .equals(usr)
    .where("password")
    .equals(hash.digest("hex"));
  if (!user) throw new Error("Incorrect credentials.");
  delete user.password;
  return user;
});

// define a static model method for signup
UserSchema.static("signup", async function (usr, pwd) {
  if (pwd.length < 6) {
    throw new Error("Pwd must have more than 6 characters");
  }
  const hash = crypto.createHash("sha256").update(pwd);
  const exist = await this.findOne().where("username").equals(usr);
  if (exist) throw new Error("Username already exists.");
  const user = this.create({
    username: usr,
    passwarod: hash.digest("hex"),
  });
  return user;
});

// define a document instance method for changePass
UserSchema.method("changePass", async function (pwd) {
  if (pwd.length < 6) {
    throw new Error("Pwd must have mpre than 6 characters");
  }
  const hash = crypto.createHash("sha256").update(pwd);
  this.password = hash.digest("hex");
  return this.save();
});

module.exports = connection.model("User", UserSchema);
