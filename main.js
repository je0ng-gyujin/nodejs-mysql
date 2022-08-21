const http = require('http');
const fs = require('fs');
const url = require('url');
const qs = require('querystring');
const path = require('path');
const sanitizeHtml = require('sanitize-html');

const template = require('./lib/template.js');

const port = 1004;
const hostname = '127.0.0.1';

let app = http.createServer( (request, response) => {  // 서버 생성 초입
  let currentUrl = request.url;
  let queryData = url.parse(currentUrl, true).query;
  
  let pathname = url.parse(currentUrl, true).pathname;
  if(pathname == '/') { // 1-1. if문 > url:/의 페이지 출력
    if(queryData.id == undefined){ // 2-1. if문 > 쿼리스트링이 비어있는 홈페이지 출력
      fs.readdir('./data', function(error, filelist) {        
        let title = 'Welcome';
        let data = 'Hello, Node.js';
        let writelist = template.list(filelist);
        let html = template.html(title, writelist, 
          `<h2>${title}</h2>${data}`, 
          '<a href="/create">create</a>');
        response.writeHead(200);
        response.end(html);
      });
    } else {
      fs.readdir('./data', function(error1, filelist) { // 2-2. if문 > 쿼리스트링이 있는 ./data 글 출력
        let filteredId = path.parse(queryData.id).base;
        fs.readFile(`./data/${filteredId}`, 'utf8', function(error2, data) {
          let title = queryData.id;
          let sanitizedTitle = sanitizeHtml(title);
          let sanitizedDescription = sanitizeHtml(data);
          let writelist = template.list(filelist);
          let html = template.html(sanitizedTitle, writelist, 
            `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`, 
            `<a href="/create">create</a>
             <a href="/update?id=${sanitizedTitle}">update</a>
             <form action="delete_process" method="post">
              <input type="hidden" name="id" value="${sanitizedTitle}">
              <input type="submit" name="submit" value="delete">
             </form>`);
          response.writeHead(200);
          response.end(html);
        });
      });
    }
  } else if(pathname == '/create') { // 1-2. if문 > 글 생성 form 페이지
    fs.readdir('./data', function(error, filelist) {
      title = 'Web - Create';
      writelist = template.list(filelist);
      html = template.html(title, writelist, 
      `<form action="/create_process" method="post">
        <p><input type="text" placeholder="제목을 입력해주세요" name="title"></p>
        <p><textarea placeholder="내용을 입력해주세요" name="description"></textarea></p>
        <p><input type="submit"></p>
      </form>`, '');
      response.writeHead(200);
      response.end(html);
    });
  } else if(pathname == '/create_process') { // 1-3. if문 > 글 생성 post 처리페이지
    let body = '';
    request.on('data', function(data) {
      body += data;
    });
    request.on('end', function() {
      let title = qs.parse(body).title;
      let description = qs.parse(body).description;
      fs.writeFile(`./data/${title}`, description, 'utf8', function(error) {
        response.writeHead(302, {Location: `/?id=${title}`});
        response.end();
      });
    });
  } else if(pathname == '/update') { // 1-4. if문 > 글 수정 form 페이지
    fs.readdir('./data', function(error1, filelist) { // 2-2. if문 > 쿼리스트링이 있는 ./data 글 출력
      let filteredId = path.parse(queryData.id).base;
      fs.readFile(`./data/${filteredId}`, 'utf8', function(error2, data) {
        let title = queryData.id;
        let writelist = template.list(filelist);
        let html = template.html(title, writelist, 
          `<form action="/update_process" method="post">
            <input type="hidden" value="${title}" name="id">
            <p><input type="text" value="${title}" name="title"></p>
            <p><textarea placeholder="내용을 입력해주세요" name="description">${data}</textarea></p>
            <p><input type="submit"></p>
          </form>`, '');
        response.writeHead(200);
        response.end(html);
      });
    });
  } else if(pathname == '/update_process') { // 1-4. if문 > 글 수정 post 처리페이지
    let body = '';
    request.on('data', function(data) {
      body += data;
    });
    request.on('end', function() {
      let id = qs.parse(body).id;
      let title = qs.parse(body).title;
      let description = qs.parse(body).description;
      fs.rename(`./data/${id}`, `./data/${title}`, function(error) {
        fs.writeFile(`./data/${title}`, description, 'utf8', function(error) {
          response.writeHead(302, {Location : `/?id=${title}`});
          response.end();
        });
      });
    });
  } else if(pathname == '/delete_process') { // 1-5. if문 > 글 삭제 post 처리페이지
    let body = '';
    request.on('data', function(data) {
      body += data;
    });
    request.on('end', function() {
      let id = qs.parse(body).id;
      filteredId = path.parse(id).base;
      fs.unlink(`./data/${filteredId}`, function(error){
        response.writeHead(302, {Location: `/`});
        response.end();
      });
    });
  } else { // 1-4. if문 > url:not found 404의 페이지 출력
    response.statusCode = 404;
    response.setHeader('Content-Type', 'text/plain');
    response.end('Not found..');
  }
}); // 서버 생성 종단

app.listen(port, hostname, () => {
    console.log(`Server running at ${hostname}:${port}`);
});