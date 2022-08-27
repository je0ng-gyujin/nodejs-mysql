const db = require('./db.js');
const template = require('./template.js');
const url = require('url');

exports.home = function(request, response) {
    db.query('SELECT id, title FROM topic', function(error, results) {
        if (error) { throw error; }
        let writelist = template.list(results);
        let html = template.html('Welcome', writelist,
        `<h2>Welcome</h2>Hello, Node.js`,
        '<a href="/create">create</a>');
        response.writeHead(200);
        response.end(html);
    });
}

exports.page = function(request, response) {
    let currentUrl = request.url;
    let queryData = url.parse(currentUrl, true).query;
    db.query(`SELECT id, title FROM topic`, function(error1, listQuery) { // 글 목록 생성
        if (error1) { throw error1; }
        let titleList = template.list(listQuery);
        db.query(`SELECT * FROM topic LEFT JOIN author ON topic.author_id=author.id WHERE topic.id=?`, [queryData.id], function(error2, dataQuery) { // 본문을 생성 후 html 렌더링
          if (error2) { throw error2; }
          let html = template.html(dataQuery[0].title, titleList, 
         `<h2>${dataQuery[0].title}</h2>
          ${dataQuery[0].description}
          <p>by ${dataQuery[0].name}</p>`,
         `<a href="/create">create</a>
          <a href="/update?id=${queryData.id}">update</a>
          <form action="delete_process" method="post">
            <input type="hidden" name="id" value="${dataQuery[0].id}">
            <input type="submit" name="submit" value="delete">
          </form>`)
          response.writeHead(200);
          response.end(html);
        });
    });
}