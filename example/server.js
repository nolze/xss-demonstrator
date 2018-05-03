const http = require('http')

const fs = require('fs')
const path = require('path')
const url = require('url')

const PORT = 8000
const HOSTNAME = 'localhost'

function cookieVal(cookie, key){
  return ((cookie + ';').match(key + '=([^;]*)')||[])[1]
}

http.createServer(function (req, res) {
  let cookie
  console.log(req.headers.cookie, req.headers)
  if (req.headers.cookie === undefined) {
    cookie = "username=Admin"
  } else {
    cookie = req.headers.cookie
  }
  console.log(cookieVal(cookie, "username"))
  fs.readFile('index.html', 'utf8', function (err, data) {
    res.writeHead(200, {
      'Content-Type': 'text/html',
      'X-XSS-Protection': '0',
      'Set-Cookie': cookie
    })
    // console.log(data, cookieVal(cookie, "username"))
    res.end(data.replace(/%NAME%/g, cookieVal(cookie, "username")), 'utf-8')
  })
}).listen(PORT, HOSTNAME)
