import { View } from 'keystone';

export default function (req, res) {
  const view = new View(req, res);
  view.render('index');
}
