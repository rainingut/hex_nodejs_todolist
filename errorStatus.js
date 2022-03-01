function errorStatus (res) {
  const headers = {
    'Access-Control-Allow-Headers':'Content-Type, Content-Length, Authorization, X-Required-With',
    'Access-Control-Allow-Origin':'*',
    'Access-Control-Allow-Methods':'GET, POST, PATCH, DELETE, OPTIONS',
    'Content-Type':'application/json',
  };
  res.writeHead(400, headers);
  res.write(JSON.stringify({status:'fail', message:'錯誤'}));
  res.end();
}

module.exports = errorStatus;