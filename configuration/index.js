if (process.env.NODE_ENV === 'test') {
  module.exports = {
    Jwt_Secret: process.env.JWT_SECRET,
    oauth: {
      google: {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET
      },
      facebook: {
        clientID: process.env.FACEBOOK_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_SECRET_ID
      }
    },
  };
} else {
  module.exports = {
    Jwt_Secret: process.env.JWT_SECRET,
    oauth: {
      google: {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET
      },
      facebook: {
        clientID: process.env.FACEBOOK_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_SECRET_ID
      }
    },
  };
}
