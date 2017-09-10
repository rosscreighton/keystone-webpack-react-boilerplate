import doapi from 'doapi';
import nodeSSH from 'node-ssh';

const args = process.argv.slice(2);

const accessToken = args[0];
const dropletName = args[1];
const sshFingerprint = args[2];

const DOClient = new doapi({
  token: accessToken,
});

async function main() {
  const dropletId = await createDroplet();
  const dropletAddress = await getDropletAddress(dropletId);
  const ssh = new nodeSSH();

  await ssh.connect({
    host: dropletAddress,
    username: 'root',
    privateKey: '/Users/rosscreighton/.ssh/id_rsa'
  });

  await installNode(ssh);
}

async function createDroplet() {
  console.log(`creating droplet: ${dropletName}`);

  const res = await DOClient.dropletNew({
    name: dropletName,
    region: 'nyc3',
    size: '512mb',
    image: 'mongodb-16-04',
    ssh_keys: [sshFingerprint],
  });

  return res.id;
}

async function getDropletAddress(id) {
  console.log(`getting droplet address: ${dropletName}`);
  const res = await DOClient.dropletGet(id);
  return res.networks.v4[0].ip_address;
}

async function installNode(ssh) {

}

main();
