const http = require('http');
const { v4: uuidv4 } = require('uuid');
const errorStatus = require('./errorStatus');
const todos=  [{id: uuidv4(), title:'今天要刷牙'}];

const requestListener = (req, res) => {
  const headers = {
    'Access-Control-Allow-Headers':'Content-Type, Content-Length, X-Requested-With, Authorization',
    'Access-Control-Allow-Origin':'*',
    'Access-Control-Allow-Methods':'GET, POST, PATCH, DELETE, OPTIONS',
    'Content-Type':'application/json',
  };

  let body = '';
  req.on('data', chunk => body += chunk)
  // 取得所有todo list
  if(req.url=="/todos" && req.method=='GET'){
    res.writeHead(200, headers);
    res.write(JSON.stringify(todos));
    res.end();
  }

  // 新增單筆todo item
  else if(req.url=='/todos' && req.method=='POST') {
    req.on('end', () => {
      const fail = (error=null) => {
        console.log('錯誤', error);
        return (
          res.write(JSON.stringify({
            status: 'fail',
            message: error,
          }))
        )
      }

      try {
        const result = JSON.parse(body);
        if(result.title) {
          const todo = {
            id: uuidv4(), 
            title: result.title,
          };
          todos.push(todo);
          res.writeHead(200, headers);
          res.write(JSON.stringify({
            status: 'success',
            data: todos,
          }));
        }
        else {  errorStatus(res); }
      } 
      catch(error) {  errorStatus(res)    }
      res.end();
    });
  }

  // 刪除所有todo list
  else if(req.url=='/todos' && req.method=='DELETE'){
    todos.length = 0;
    res.writeHead(200, headers);
    res.write(JSON.stringify({status:'success', data: todos, delete:'yes'}));
    res.end();
  }

  // 刪除單筆todo item
  else if (req.url.startsWith('/todos/') && req.method=='DELETE'){
    const uuid = req.url.split('/').pop();
    const idx = todos.findIndex(item => item.id === uuid);
    if(idx !== -1 ){ 
      todos.splice(idx,1); 
      res.writeHead(200, headers);
      res.write(JSON.stringify({status:'success', data: todos, delete:'yes'}));
      res.end();
    }
    else{ errorStatus(res) }
  }
  
  // 修改單筆todo item
  else if(req.url.startsWith('/todos/') && req.method=='PATCH'){
    req.on('end', () => {
      try {
        const result = JSON.parse(body);
        const uuid = req.url.split('/').pop();
        const idx = todos.findIndex(item => item.id === uuid);
        if ( result.title && idx !== -1 ) {
          todos[idx] = { id: uuid, ...result};
          res.writeHead(200, headers);
          res.write(JSON.stringify({status:'success', data:todos, method: 'PATCH'}));
          res.end();
        }
        else { errorStatus(res) }
      }
      catch { errorStatus(res); }
    })
  }

  else if(req.method=='OPTIONS'){
    res.writeHead(200, headers);
    res.end();
  }
  else {
    res.writeHead(404, headers);
    res.write(JSON.stringify({status:'fail', message:`查無此頁${req.url}`}));
    res.end();
  }
}

const server = http.createServer(requestListener);
server.listen(3005);