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
    list:function(_flielist) { // ./data 디렉토리의 내용을 글목록으로 생성
      let _writelist = '<ul>';
      for(let i = 0; i < _flielist.length; i++) {
        _writelist += `<li><a href="/?id=${_flielist[i]}">${_flielist[i]}</a></li>`;
      }
      _writelist += '</ul>';
      return _writelist;
    }
}