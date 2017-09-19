module.exports = {
  apps : [
    {
      name: 'server',
      script: 'dist/index.js',
      wait_ready: true,
      cwd: '/var/www/current/server',
      node_args: '-r "dotenv/config"'
    },
  ],
};
