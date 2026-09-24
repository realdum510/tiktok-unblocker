import barePkg from '@tomphttp/bare-server-node';

const { createBareServer } = barePkg;
const bare = createBareServer('/api/bare/');

export const config = {
  api: { bodyParser: false },
};

export default function handler(req, res) {
  const { rest = [] } = req.query;
  const sub = Array.isArray(rest) ? rest.join('/') : String(rest);
  const qIndex = req.url.indexOf('?');
  const q = qIndex === -1 ? '' : req.url.slice(qIndex);
  req.url = '/api/bare/' + sub + q;
  if (bare.shouldRoute(req)) {
    bare.routeRequest(req, res);
  } else {
    res.statusCode = 404;
    res.end('Not found');
  }
}
