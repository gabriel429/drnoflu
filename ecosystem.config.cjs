module.exports = {
  apps: [
    {
      name: "drnoflu",
      cwd: "/var/www/drnoflu",
      script: "npm",
      args: "start",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
      time: true,
    },
  ],
};
