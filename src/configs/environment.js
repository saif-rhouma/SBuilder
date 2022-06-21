const environment = {
  port: parseInt(process.env.PORT) || 5009,
  nodeEnv: process.env.NODE_ENV || 'production',
  session: {
    cookie: { maxAge: 60000 },
    secret: 'woot',
    resave: false,
    saveUninitialized: false,
  },
};

export default environment;
