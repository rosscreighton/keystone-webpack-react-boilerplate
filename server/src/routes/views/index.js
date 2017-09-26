import keystone, { View } from 'keystone';

export default function (req, res) {
  const view = new View(req, res);

  view.render('index', {
    clientJSFile: keystone.get('client js file'),
    clientCSSFile: keystone.get('client css file'),
  });
}
