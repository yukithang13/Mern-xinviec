const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const JwtStratery = require("passport-jwt").Strategy;
const Account = require("../models/Account");

//lấy mã token từ trình duyệt được lưu trong cookies
const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["access_token"];
  }
  return token;
};

//Authorization
passport.use(
  new JwtStratery(
    {
      jwtFromRequest: cookieExtractor,
      secretOrKey: "QuocLiem",
    },
    (payload, done) => {
      Account.findById({ _id: payload.sub }, (err, user) => {
        if (err) return done(err, false);
        if (user) return done(null, user);
        else return done(null, false);
      });
    }
  )
);

//Authentication sử dụng username và password
passport.use(
  new LocalStrategy((username, password, done) => {
    Account.findOne({ username }, (err, user) => {
      if (err) return done(err);
      //không tồn tại
      if (!user) return done(null, false);
      user.comparePassword(password, done);
    });
  })
);
