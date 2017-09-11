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

main();
