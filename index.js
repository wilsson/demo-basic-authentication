const http = require('http');

const unAuthorized = (res) => {
  res.setHeader('WWW-Authenticate', 'unautorized');
  res.end('Not Autorized');
};

const extractUser = (data) => {
  const [ user, pass ] = data.split(':');
  return { user, pass };
}

const decodeBase64 = (code) => {
  const buff = new Buffer.from(code, 'base64');
  return buff.toString('ascii');
};

const basicAuth = (req) => {
  if(req.headers.authorization === undefined) return null;
  const [ type, credential ] = req.headers.authorization.split(' ');
  if(type !== 'Basic') return null;
  return credential;
};

const requestListener = (req, res) => {
  console.log('request headers', req.headers);
  const credential = basicAuth(req);

  if(credential === null) {
    unAuthorized(res);
    return;
  }

  const decode = decodeBase64(credential);
  const data = extractUser(decode);
  console.log('data', data);

  res.writeHead(200);
  res.end('ok');
};

const server = http.createServer(requestListener);
server.listen(8080);