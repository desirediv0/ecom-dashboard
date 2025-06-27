sudo nano /etc/nginx/sites-available/muscelx

sudo ln -s /etc/nginx/sites-available/muscelx /etc/nginx/sites-enabled/

sudo nginx -t
sudo systemctl restart nginx

sudo certbot certonly --nginx -d muscle-x.com -d www.muscle-x.com

cat ecosystem.config.js
module.exports = {
apps: [
{
name: 'muscelx-client',
cwd: '/root/ecom-muscelx/client',
script: 'npm',
args: 'start',
env: {
PORT: 3007,
NODE_ENV: 'production'
},
error_file: "/root/.pm2/logs/muscelx-client-error.log",
out_file: "/root/.pm2/logs/muscelx-client-out.log",
log_date_format: "YYYY-MM-DD HH:mm:ss",
max_memory_restart: "500M"
},
{
name: 'muscelx-admin',
cwd: '/root/ecom-muscelx/admin',
script: 'npm',
args: 'run preview',
env: {
PORT: 4179,
NODE_ENV: 'production',
HOST: '0.0.0.0'
},
error_file: "/root/.pm2/logs/muscelx-admin-error.log",
out_file: "/root/.pm2/logs/muscelx-admin-out.log",
log_date_format: "YYYY-MM-DD HH:mm:ss",
max_memory_restart: "500M"
},
{
name: 'muscelx-server',
cwd: '/root/ecom-muscelx/server',
script: 'npm',
args: 'start',
env: {
PORT: 4007,
NODE_ENV: 'production'
},
error_file: "/root/.pm2/logs/muscelx-server-error.log",
out_file: "/root/.pm2/logs/muscelx-server-out.log",
log_date_format: "YYYY-MM-DD HH:mm:ss",
max_memory_restart: "500M"
}
]
};
