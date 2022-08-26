module.exports = {
    html:function(_title, _writelist, _body, control) { // 본문을 렌더링하는 html
      return `<!doctype HTML>
      <html>
      <head>
        <title>WEB2 - ${_title}</title>
        <meta charset="utf-8">
      </head>
      <body>
        <h1><a href="/">WEB</a></h1>
        ${_writelist}
        ${control}
        ${_body}
      </body>
      </html>`;
    },
    list:function(_flielist) { // title column의 내용을 글목록으로 생성
      let _writelist = '<ul>';
      for(let i = 0; i < _flielist.length; i++) {
        _writelist += `<li><a href="/?id=${_flielist[i].id}">${_flielist[i].title}</a></li>`;
      }
      _writelist += '</ul>';
      return _writelist;
    },
    authorSelect:function(authors, author_id) { // 작성자 목록을 드롭박스 형태로 작성
      let tag = '';
        for(let i = 0; i < authors.length; i++) {
          let selected = '';
          if(authors[i].id === author_id) {
            selected = ' selected'
          }
          tag += `<option value="${authors[i].id}"${selected}>${authors[i].name}</option>`;
        }
      return `
        <select name="author">
          ${tag}
        </select>
      `
    }
}