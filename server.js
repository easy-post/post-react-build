const express = require("express");
const fs = require("fs").promises;
const path = require("path");

const HOST_NAME = "127.0.0.1";
const PORT = "3333";

const app = express();

app.use(express.static(path.join(__dirname, "static")));

app.get("/login", (req, res)=>{
  getHtml("login.html")
  .then(html=>{
    res.header("Content-Type", "text/html");
    res.statusCode = 200;
    res.send(html);
  })
});

app.get("*", (req, res)=>{
  getHtml("index.html")
  .then(html=>{
    res.header("Content-Type", "text/html");
    res.statusCode = 200;
    res.send(html);
  })
});

app.listen(PORT, ()=>{
  console.log(`====== Server is running : http://${HOST_NAME}"${PORT}`);
});


async function getHtml(fileName){
  const html = await fs.readFile(path.join(__dirname, fileName));
  return html;
}