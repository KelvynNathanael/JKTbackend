// passport-config.js
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const userModel = require('./models/userModel'); // Import the userModel

function initialize(passport) {
    const authenticateUser = async (name, password, done) => {
        try {
          const user = await userModel.findOne({ name });
      
          if (!user) {
            return done(null, false, { message: 'Username not found' });
          }
      
          const isPasswordCorrect = await bcrypt.compare(password, user.password);
      
          if (!isPasswordCorrect) {
            return done(null, false, { message: 'Wrong Password' });
          }
      
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      };

    passport.use(new LocalStrategy({ usernameField: 'name' }, authenticateUser));

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        userModel.findById(id, (err, user) => {
            done(err, user);
        });
    });
}

module.exports = initialize
