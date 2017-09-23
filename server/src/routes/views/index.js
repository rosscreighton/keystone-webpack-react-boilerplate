import keystone, { View } from 'keystone';

export default function (req, res) {
  const view = new View(req, res);
  view.render('index', {
    clientBundleFile: keystone.get('client bundle file'),
  });
}
