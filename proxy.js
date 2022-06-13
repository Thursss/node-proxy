var express = require("express");
var proxy = require("http-proxy-middleware");
var cors = require("cors"); //使用const cors=require(’cors‘)导入中间件
var app = express();
app.use(cors()); //在路由之前调用app.use(cors())配置中间件
app.use(express.static("./public"));

// app.all("*", function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "http://localhost:8086/"); //当允许携带cookies此处的白名单不能写’*’
//   res.header(
//     "Access-Control-Allow-Headers",
//     "content-type,Content-Length, Authorization,Origin,Accept,X-Requested-With"
//   ); //允许的请求头
//   res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT"); //允许的请求方法
//   res.header("Access-Control-Allow-Credentials", true); //允许携带cookies
//   next();
// });

app.use(
  "/api",
  proxy.createProxyMiddleware({
    target: "http://10.12.0.225:8018/dbi/report-admin",
    changeOrigin: true,
    ws: true,
    pathRewrite: {
      "^/api": "",
    },
    onProxyReq(proxyReq, req, res) {
      console.log(req);
      proxyReq.setHeader("cookie", "token=AA23D3CE66491443806C06D2BE49D892");
    },
    // onProxyReq(proxyReq, req) {
    //   // 将本地请求的头信息复制一遍给代理。
    //   // 包含cookie信息，这样就能用登录后的cookie请求相关资源
    //   Object.keys(req.headers).forEach(function (key) {
    //     proxyReq.setHeader(key, req.headers[key]);
    //   });
    // },
    // onProxyRes(proxyRes, req, res) {
    //   // 将服务器返回的头信息，复制一遍给本地请求的响应。
    //   // 这样就能实现 执行完登录后，本地的返回请求中也有相关cookie，从而实现登录功能代理。
    //   Object.keys(proxyRes.headers).forEach(function (key) {
    //     res.append(key, proxyRes.headers[key]);
    //   });
    // },
  })
);

app.get("/name", function (req, res) {
  var data = { name: "Alis" };

  res.json(data); // 直接返回json
});

app.listen(4000);
