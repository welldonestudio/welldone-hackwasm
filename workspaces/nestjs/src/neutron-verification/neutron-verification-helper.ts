import { spawnSync } from 'child_process';
import { mkdirSync } from 'fs';
import { precondition } from 'src/util/precondition';
import { OS_PLATFORM, OS_PLATFORM_DARWIN } from 'src/const/build-env';

const BASE_PATH = process.cwd();
const FILENAME = 'contract.wasm';
export type NeutronChainId = 'mainnet' | 'testnet';

export class NeutronVerificationHelper {
  static checksum(chainId: NeutronChainId, codeId: string) {
    const dir = `${BASE_PATH}/temp/neutron/${chainId}/${codeId}`;
    mkdirSync(`${BASE_PATH}/temp/neutron/${chainId}/${codeId}`, {
      recursive: true,
    });
    const { status: wasmStatus } = spawnSync(
      'neutrond',
      [
        'query',
        'wasm',
        'code',
        codeId,
        FILENAME,
        '--node',
        'https://rpc-palvus.pion-1.ntrn.tech:443',
      ],
      {
        cwd: dir,
      },
    );
    precondition(
      wasmStatus === 0,
      `neutrond error. chainId=${chainId}, codeId=${codeId}, status=${wasmStatus}`,
    );

    return this.sha256(dir);
  }

  private static sha256(dir: string) {
    return OS_PLATFORM === OS_PLATFORM_DARWIN
      ? this.sha256MacOs(dir)
      : this.sha256Linux(dir);
  }

  private static sha256MacOs(dir: string) {
    const result = spawnSync(
      'openssl',
      ['dgst', '-sha256', `${dir}/${FILENAME}`],
      {
        cwd: dir,
      },
    );
    precondition(result.status === 0, ``);
    const str: string = (result.output[1] as any).toString();
    return str.split('= ')[1].slice(0, 64);
  }

  static sha256Linux(dir: string) {
    const result = spawnSync('sha256sum', [`${dir}/${FILENAME}`], {
      cwd: dir,
    });
    precondition(result.status === 0, ``);
    const str: string = (result.output[1] as any).toString();
    return str.split(' ')[0].slice(0, 64);
  }

  static rpcUrl(chainId: NeutronChainId) {
    if (chainId === 'testnet') {
      return `https://rpc-palvus.pion-1.ntrn.tech`;
    }

    throw new Error(`Unsupported Neutron RPC chainId=${chainId}`);
  }
}
