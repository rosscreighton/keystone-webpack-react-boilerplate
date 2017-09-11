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
  //const droplets = await DOClient.dropletGetAll();
  //droplets.forEach(droplet => {
    //DOClient.dropletDestroy(droplet.id);
  //})
  const dropletId = await createDroplet();
  const dropletAddress = await getDropletAddress(dropletId);
  const sshClient = new nodeSSH();
  await connectSSH(sshClient, dropletAddress);
  await installNginx(sshClient);
  await installNVM(sshClient);
  console.log(`getting a new shell session`);
  sshClient.dispose();
  await connectSSH(sshClient, dropletAddress);
  await installNode(sshClient);
  await installYarn(sshClient);
  console.log('DONE');
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

async function installNginx(sshClient) {
  console.log(`installing nginx`);
  const update = await sshClient.execCommand('apt-get update');
  console.log(update.stderr);
  const install = await sshClient.execCommand('apt-get -y install nginx');
  console.log(install.stderr);
}

async function installNVM(sshClient) {
  console.log(`installing build packages`);
  const buildTools = await sshClient.execCommand('apt-get -y install build-essential libssl-dev');
  console.log(buildTools.stderr);
  console.log(`installing nvm`);
  const nvm = await sshClient.execCommand('curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.4/install.sh | bash');
  console.log(nvm.stderr);
}

async function installNode(sshClient) {
  console.log(`installing node`);
  const source = await sshClient.execCommand('source ~/.nvm/nvm.sh');
  console.log(source.stderr);
  const node = await sshClient.execCommand('bash -ic "nvm install node"');
  console.log(node.stderr);
}

async function installYarn(sshClient) {
  console.log(`installing yarn`);
  const repo = await sshClient.execCommand('curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -');
  console.log(repo.stderr);
  const repo2 = await sshClient.execCommand('echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list');
  console.log(repo2.stderr);
  const update = await sshClient.execCommand('apt-get update');
  console.log(update.stderr);
  const yarn = await sshClient.execCommand('apt-get -y install yarn');
  console.log(yarn.stderr);
}

main();
