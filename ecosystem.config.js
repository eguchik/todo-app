module.exports = {
  apps : [{
    name: 'todo',
    script: 'bin/www',
    watch: '.',
    "env_webhook": {
      "port": 80,
      "path": "/webhook",
      "secret": "SECRET"
  },
  }],

  deploy : {
    production : {
      user : 'ec2-user',
      host : '54.65.73.21',
      key  : 'test.pem',
      ref  : 'origin/master',
      repo : 'git@github.com:eguchik/todo.git',
      path : '/home/ec2-user/todo_pm',
      'post-setup': "sudo docker-compose up -d --build",
      'post-deploy' : 'pwd'
    }
  }
};
