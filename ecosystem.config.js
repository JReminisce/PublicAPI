module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps : [
    // First application
    {
      name            : 'PublicAPI',
      script          : './app.js',
      max_restarts    : 10,
      restart_delay   : 1000,
      instances       : 1,
      exec_mode       : 'fork',
      merge_logs      : false,
      log_date_format : 'YYYY-MM-DD HH:mm:ss.SSS',
      env : {
      },
      env_development : {
        NODE_ENV : 'development',
        watch : true,
        MONGODB_URI : 'mongodb://localhost:27017/'
      },
      env_production : {
        NODE_ENV  : 'production',
        MONGODB_URI : 'mongodb://localhost:27017/'
      }
    }
  ],
  /**
   * Deployment section
   * http://pm2.keymetrics.io/docs/usage/deployment/
   */
   // Deploy not configured
  deploy : {
    production : {
      user : 'node',
      host : '212.83.163.1',
      ref  : 'origin/master',
      repo : 'git@github.com:repo.git',
      path : '/var/www/production',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production'
    },
    dev : {
      user : 'node',
      host : '212.83.163.1',
      ref  : 'origin/master',
      repo : 'git@github.com:repo.git',
      path : '/var/www/development',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env dev',
      env  : {
        NODE_ENV: 'dev'
      }
    }
  }
};
