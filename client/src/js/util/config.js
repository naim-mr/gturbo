// address of the Flask server (VUE_APP_SERVER_URL overrides it at build time)
module.exports = {
  SERVER_URL: process.env.VUE_APP_SERVER_URL || 'http://127.0.0.1:5000'
}
