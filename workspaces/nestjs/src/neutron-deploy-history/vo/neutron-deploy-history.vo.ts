export class NeutronDeployHistoryVo {
  chainId: string;
  account: string;
  packageId: string;
  packageName: string;
  module: string;
  compileTimestamp: number;
  deployTimestamp: number;
  txHash: string;
  srcUrl: string;
}
