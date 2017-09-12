import doapi from 'doapi';
import nodeSSH from 'node-ssh';

const args = process.argv.slice(2);

const accessToken = args[0];
const dropletName = args[1];
const sshFingerprint = args[2];

const DOClient = new doapi({
  token: accessToken,
});

const sshClient = new nodeSSH();

async function main() {
  const dropletId = await createDroplet();
  const dropletAddress = await getDropletAddress(dropletId);
  await connectSSH(sshClient, dropletAddress);
  await installNginx();
  await installNVM();
  await installNode();
  await installYarn();
  sshClient.dispose();
  console.log('DONE');
}

async function execCommand(command) {
  const res = await sshClient.execCommand(command);
  console.log(res.stderr);
}

async function createDroplet() {
  console.log(`creating droplet with name: ${dropletName}`);

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
  console.log(`getting droplet address`);
  const info = await DOClient.dropletGet(id);
  const networkInfo = info.networks.v4[0];

  if (networkInfo) {
    return networkInfo.ip_address;
  } else {
    return getDropletAddress(id);
  }
}

async function connectSSH(sshClient, dropletAddress) {
  console.log(`connecting to droplet @ ${dropletAddress}`);
  try {
    const res = await sshClient.connect({
      host: dropletAddress,
      username: 'root',
      privateKey: '/Users/rosscreighton/.ssh/id_rsa',
    });
    console.log('connection successful');
    return res;
  } catch (e) {
    console.log(e);
    console.log('could not connect. trying again in 5000ms');
    await new Promise(resolve => setTimeout(() => { resolve('waited') }, 5000));
    return connectSSH(sshClient, dropletAddress);
  }
}

async function installNginx() {
  console.log(`installing nginx`);
  await execCommand('apt-get update');
  await execCommand('apt-get -y install nginx');
}

async function installNVM() {
  console.log(`installing build packages`);
  await execCommand('apt-get -y install build-essential libssl-dev');
  console.log(`installing nvm`);
  await execCommand('curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.4/install.sh | bash');
}

async function installNode() {
  console.log(`installing node`);
  await execCommand('bash -ic "nvm install node"');
}

async function installYarn() {
  console.log(`installing yarn`);
  await execCommand('curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -');
  await execCommand('echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list');
  await execCommand('apt-get update');
  await execCommand('apt-get -y install yarn');
}

main();
