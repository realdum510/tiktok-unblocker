import barePkg from '@tomphttp/bare-server-node';

const { createBareServer } = barePkg;
const bare = createBareServer('/api/bare/');

export const config = {
  api: { bodyParser: false },
};

export default function handler(req, res) {
  if (bare.shouldRoute(req)) {
    bare.routeRequest(req, res);
  } else {
    res.statusCode = 404;
    res.end('Not found');
  }
}
