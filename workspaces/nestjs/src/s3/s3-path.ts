export class S3Path {
  static bucket() {
    return 'wds-code-build';
  }

  static srcKey(
    chainName: string,
    chainId: string,
    account: string,
    timestamp: string,
  ) {
    return `${chainName}/${chainId}/${account}/${timestamp}/${timestamp}.zip`;
  }
}
