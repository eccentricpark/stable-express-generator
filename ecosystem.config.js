module.exports = {
  apps: [{
    name: 'app',
    script: './dist/app.js',
    instances: 1,
    exec_mode: 'fork',
    watch : true,
    ignorw_watch : ["node_modules", "log", ".gitignore", ".env.*"],
    log_date_format : "YYYY-MM-DD HH:MM:ZZZ",
    error_file : "./log/app-error.log",
    out_file : "./log/app-log.log"
  }]
}