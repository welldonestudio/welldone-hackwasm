export class NeutronDeployHistoryCreateVo {
  chainId: string;
  account: string;
  codeId: string;
  contractAddress: string;
  checksum: string | null;
  compileTimestamp: number | null;
  deployTimestamp: number | null;
  txHash: string | null;
  isSrcUploaded: boolean;
  createdBy: string;
}
