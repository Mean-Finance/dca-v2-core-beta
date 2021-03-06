import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import moment from 'moment';
import { BigNumber } from 'ethers';

const deployFunction: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer, governor } = await hre.getNamedAccounts();

  const FEED_REGISTRY_MAINNET_ADDRESS = '0x47Fb2585D2C56Fe188D0E6ec628a38b74fCeeeDf';
  const FEED_REGISTRY_KOVAN_ADDRESS = '0xAa7F6f7f507457a1EE157fE97F6c7DB2BEec5cD0';
  const FEED_REGISTRY_OPTIMISM_KOVAN_ADDRESS = '0x2dfb2c5c013826a0728440d8036305b254ad9cce';
  const FEED_REGISTRY_OPTIMISM_ADDRESS = '0x2dfb2c5c013826a0728440d8036305b254ad9cce';
  const WETH_MAINNET_ADDRESS = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2';
  const WETH_KOVAN_ADDRESS = '0xd0a1e359811322d97991e03f863a0c30c2cf029c';
  const WETH_OPTIMISM_KOVAN_ADDRESS = '0x4200000000000000000000000000000000000006';
  const WETH_OPTIMISM_ADDRESS = '0x4200000000000000000000000000000000000006';

  let registry: string;
  let weth: string;
  let maxDelay: BigNumber;

  switch (hre.network.name) {
    case 'mainnet':
    case 'hardhat':
      registry = FEED_REGISTRY_MAINNET_ADDRESS;
      weth = WETH_MAINNET_ADDRESS;
      maxDelay = BigNumber.from(moment.duration('1', 'day').asSeconds());
      break;
    case 'kovan':
      registry = FEED_REGISTRY_KOVAN_ADDRESS;
      weth = WETH_KOVAN_ADDRESS;
      maxDelay = BigNumber.from(2).pow(32).sub(1);
      break;
    case 'optimismkovan':
      registry = FEED_REGISTRY_OPTIMISM_KOVAN_ADDRESS;
      weth = WETH_OPTIMISM_KOVAN_ADDRESS;
      maxDelay = BigNumber.from(2).pow(32).sub(1);
      break;
    case 'optimism':
      registry = FEED_REGISTRY_OPTIMISM_ADDRESS;
      weth = WETH_OPTIMISM_ADDRESS;
      maxDelay = BigNumber.from(moment.duration('1', 'hour').asSeconds());
      break;
    default:
      throw new Error(`Unsupported chain '${hre.network.name}`);
  }

  await hre.deployments.deploy('ChainlinkOracle', {
    contract: 'contracts/oracles/ChainlinkOracle.sol:ChainlinkOracle',
    from: deployer,
    args: [weth, registry, maxDelay, governor],
    log: true,
  });
};

deployFunction.tags = ['ChainlinkOracle'];
export default deployFunction;
