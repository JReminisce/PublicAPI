const LocalStrategy = require('passport-local').Strategy
const FacebookStrategy = require('passport-facebook').Strategy

const User = require('../models/user')
const configAuth = require('./auth')

module.exports = function (passport) {
  passport.serializeUser(function(user, done) {
    done(null, user);
  })

  passport.deserializeUser(function(user, done) {
    done(null, user);
  })

  passport.use(new FacebookStrategy({
      clientID      : configAuth.facebookAuth.clientID,
      clientSecret  : configAuth.facebookAuth.clientSecret,
      callbackURL   : configAuth.facebookAuth.callbackURL,
      profileFields : configAuth.facebookAuth.profileFields
    },
    function(accessToken, refreshToken, profile, done) {
      process.nextTick(function() {
        User.findOne({'facebook.id' : profile.id}, function(err, user) {
          if (err) {
            return done(err)
          } else if (user) {
            return done(null, user)
          } else {
            let newUser = new User()
            newUser.facebook.id = profile.id
            newUser.facebook.token = accessToken
            newUser.facebook.name = profile.name.givenName + ' ' + profile.name.familyName
            newUser.facebook.email = profile.emails[0].value

            newUser.save(function(err) {
              if (err) {
                throw err
              } else {
                return done(null, newUser)
              }
            })
          }
        })
      })
    }
  ))
}
