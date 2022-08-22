# nodejs-mysql
필수 설치
node.js, mysql

필요한 모듈
npm install pm2 --global
npm install html-sanitize --save
npm install mysql

웹서버 가동, 중지
pm2 start ./main.js --watch --no-deamon
pm2 stop ./main.js