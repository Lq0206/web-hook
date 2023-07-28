/*
 * @Author: lqi 575920678@qq.com
 * @Date: 2023-07-28 10:51:39
 * @LastEditors: lqi 575920678@qq.com
 * @LastEditTime: 2023-07-28 10:59:04
 * @FilePath: /CICD/web-hook/webhook.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
let crypto = require('crypto')
let http = require('http')
let SECRET = '123456'

function sign(body) {
  return 'sha1=' + crypto.createHmac('sha1', SECRET).update(body).digest('hex')
}

let server = http.createServer(function (req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  if (req.method === 'POST' && req.url === '/webhook') {
    let buffers = []
    req.on('data', function(buffer) {
      buffers.push(buffer)
    })
    req.on('end', function() {
      let body = Buffer.concat(buffers)
      let event = req.headers['x-github-event'] // event push

      let signature = req.headers['x-hub-signature']
      
      if (signature !== sign(body)) {
        return res.end('Not Allowed')
      }
    })
    res.setHeader('Content-Type', 'application/JSON')
    res.end(JSON.stringify({ ok: true }))
  } else {
    res.end('500')
  }
})

server.listen(8088, function() {
  console.log('webhook service started ...')
})