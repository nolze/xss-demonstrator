const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')

const http = require('http')

let mainWindow

const PORT = 8080
const HOSTNAME = "localhost"

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 600,
    alwaysOnTop: true
  })

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // mainWindow.webContents.openDevTools()

  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})

http.createServer(function (req, res) {
  res.writeHead(200, {})
  res.end("", 'utf-8')
  let pathname = path.dirname(req.url)
  let ref = req.headers.referer, refUrl, refPath
  if (ref) {
    refUrl = new url.URL(ref)
    refPath = refUrl.host + refUrl.pathname
  }
  // console.log(pathname)
  // Default -- Copy cookie
  if (pathname === "/") {
    let cookieBody = path.basename(req.url).replace(/^\?/, "")
    let header = "Cookie: " + cookieBody
    console.log(ref, refPath, cookieBody, header)
    mainWindow.webContents.session.clearStorageData()
    mainWindow.loadURL(url.format({
      pathname: refPath,
      protocol: refUrl.protocol,
      slashes: true,  
    }),
    {
      extraHeaders: header,
    })
  }
  // Other modes
  // else if (path === "...") {} ...
}).listen(PORT, HOSTNAME)
