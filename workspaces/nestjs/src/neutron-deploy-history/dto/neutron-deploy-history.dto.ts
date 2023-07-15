export class NeutronDeployHistoryDto {
  id: number;
  chainId: string;
  account: string;
  codeId: string;
  contractAddress: string;
  isImmutable: boolean;
  compileTimestamp: number | null;
  deployTimestamp: number | null;
  txHash: string | null;
  checksum: string | null;
  isSrcUploaded: boolean;
  verifiedCodeId: string | null;
  envOsVersion: string | null;
  envOsName: string | null;
  envOsMachine: string | null;
  envBuildScript: string | null;
  envOptimizerScript: string | null;
  envRustcVersion: string | null;
  envCargoWasmVersion: string | null;
  createdAt: Date;
  createdBy: string;
  updatedAt: Date | null;
  updatedBy: string | null;
}
