const http = require('http');
const fs = require('fs');
const url = require('url');
const qs = require('querystring');
const path = require('path');
const mysql = require('mysql');

const db = mysql.createConnection({
  host     : 'localhost',
  user     : 'nodejs',
  password : '#jit120425',
  database : 'nodetutorials'
});
db.connect();

const template = require('./lib/template.js');

const port = 1004;
const hostname = '127.0.0.1';

let app = http.createServer( (request, response) => {  // 서버 생성 초입
  let currentUrl = request.url;
  let queryData = url.parse(currentUrl, true).query;
  
  let pathname = url.parse(currentUrl, true).pathname;
  if(pathname == '/') { // 1-1. if문 > url:/의 페이지 출력
    if(queryData.id == undefined){ // 2-1. if문 > 쿼리스트링이 비어있는 홈페이지 출력
      db.query('SELECT id, title FROM topic', function(error1, results1) {
        if (error1) { throw error1; }
        let title = 'Welcome';
        let data = 'Hello, Node.js';
        let writelist = template.list(results1);
        let html = template.html(title, writelist,
          `<h2>${title}</h2>${data}`,
          '<a href="/create">create</a>');
        response.writeHead(200);
        response.end(html);
      });
    } else { // 2-2. if문 > 쿼리스트링이 있는 id column 글 출력
      db.query(`SELECT id, title FROM topic`, function(error1, listQuery) { // 글 목록 생성
        if (error1) { throw error1; }
        let titleList = template.list(listQuery);
        db.query(`SELECT * FROM topic WHERE id=?`, [queryData.id], function(error2, dataQuery) { // 본문을 생성 후 html 렌더링
          if (error2) { throw error2; }
          let html = template.html(dataQuery[0].title, titleList, 
          `<h2>${dataQuery[0].title}</h2>${dataQuery[0].description}`,
         `<a href="/create">create</a>
          <a href="/update?id=${dataQuery[0].id}">update</a>
          <form action="delete_process" method="post">
            <input type="hidden" name="id" value="${dataQuery[0].id}">
            <input type="submit" name="submit" value="delete">
          </form>`)
          response.writeHead(200);
          response.end(html);
        });
      });
    }
  } else if(pathname == '/create') { // 1-2. if문 > 글 생성 form 페이지
    db.query('SELECT id, title FROM topic', function(error1, results1) {
      if (error1) { throw error1; }
      let title = 'Create';
      let data = `
        <form action="/create_process" method="post">
          <p><input type="text" placeholder="제목을 입력해주세요" name="title"></p>
          <p><textarea placeholder="내용을 입력해주세요" name="description"></textarea></p>
          <p><input type="submit"></p>
        </form>`;
      let writelist = template.list(results1);
      let html = template.html(title, writelist,
        `<h2>${title}</h2>${data}`,
        '');
      response.writeHead(200);
      response.end(html);
    });
  } else if(pathname == '/create_process') { // 1-3. if문 > 글 생성 post 처리페이지
    let body = '';
    request.on('data', function(data) {
      body += data;
    });
    request.on('end', function() {
      let post = qs.parse(body);
      db.query(`INSERT INTO topic (title, description, created, author_id)
      VALUE (?, ?, NOW(), ?)`, [post.title, post.description, 1],
      function(error, results) {
        if(error) { throw error; }
        response.writeHead(302, {Location: `/?id=${results.insertId}`});
        response.end();
      });
    });
  } else if(pathname == '/update') { // 1-4. if문 > 글 수정 form 페이지
    db.query('SELECT id, title FROM topic', function(error1, results1) {
      if (error1) { throw error1; }
      let writelist = template.list(results1);
      db.query('SELECT * FROM topic WHERE id=?', [queryData.id], function(error2, results2) {
        if (error2) { throw error2; } 
        let html = template.html(results2.title, writelist,
       `<form action="/update_process" method="post">
         <input type="hidden" value="${results2[0].id}" name="id">
         <p><input type="text" value="${results2[0].title}" name="title"></p>
         <p><textarea placeholder="내용을 입력해주세요" name="description">${results2[0].description}</textarea></p>
         <p><input type="submit"></p>
        </form>`, '');
        response.writeHead(200);
        response.end(html);
      });
    });
  } else if(pathname == '/update_process') { // 1-5. if문 > 글 수정 post 처리페이지
    let body = '';
    request.on('data', function(data) {
      body += data;
    });
    request.on('end', function() {
      let post = qs.parse(body);
      db.query('UPDATE topic SET title=?, description=? WHERE id=?', 
      [post.title, post.description, post.id], function(error, results) {
        if (error) { throw error; }
        response.writeHead(302, {Location : `/?id=${post.id}`});
        response.end();
      });
    });
  } else if(pathname == '/delete_process') { // 1-6. if문 > 글 삭제 post 처리페이지
    let body = '';
    request.on('data', function(data) {
      body += data;
    });
    request.on('end', function() {
      db.query('DELETE FROM topic WHERE id=?', [qs.parse(body).id], function(error, results) {
        if (error) { throw error; }
        response.writeHead(302, {Location: `/`});
        response.end();
      });
      // filteredId = path.parse(id).base;
      // fs.unlink(`./data/${filteredId}`, function(error){
      //   response.writeHead(302, {Location: `/`});
      //   response.end();
      // });
    });
  } else { // 1-7. if문 > url:not found 404의 페이지 출력
    response.statusCode = 404;
    response.setHeader('Content-Type', 'text/plain');
    response.end('Not found..');
  }
}); // 서버 생성 종단

app.listen(port, hostname, () => {
    console.log(`Server running at ${hostname}:${port}`);
});