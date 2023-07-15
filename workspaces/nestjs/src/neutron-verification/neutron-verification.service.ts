import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NeutronDeployHistory } from 'src/neutron-deploy-history/neutron-deploy-history.entity';
import { S3Service } from 'src/s3/s3.service';
import {
  NeutronChainId,
  NeutronVerificationHelper,
} from 'src/neutron-verification/neutron-verification-helper';
import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { S3Path } from 'src/s3/s3-path';

export interface NeutronVerificationResult {
  chainId: string;
  contractAddress: string;
  isVerified: boolean;
  onchainCodeId: number | null;
  historyCodeId: number | null;
  isImmutable: boolean;
  envOsMachine: string | null;
  envBuildScript: string | null;
  envOptimizerScript: string | null;
  errMsg: string | null;
  srcUrl: string | null;
}

@Injectable()
export class NeutronVerificationService {
  constructor(
    @InjectRepository(NeutronDeployHistory)
    private readonly neutronDeployHistoryRepository: Repository<NeutronDeployHistory>,
    private readonly s3Service: S3Service,
  ) {}

  async verify(
    chainId: NeutronChainId,
    contractAddress: string,
  ): Promise<NeutronVerificationResult> {
    const history = await this.neutronDeployHistoryRepository.findOne({
      where: {
        chainId,
        contractAddress,
      },
    });
    const stargateClient = await CosmWasmClient.connect(
      NeutronVerificationHelper.rpcUrl(chainId),
    );
    const onchainContract = await stargateClient.getContract(contractAddress);
    const onchainCodeId = onchainContract.codeId;
    const historyCodeId = history?.codeId || null;
    const isImmutable = !onchainContract.admin;

    if (!history) {
      return {
        chainId: chainId,
        contractAddress: contractAddress,
        isVerified: false,
        onchainCodeId: onchainCodeId,
        historyCodeId: historyCodeId === null ? null : Number(historyCodeId),
        isImmutable: isImmutable,
        errMsg: `Not found NeutronDeployHistory. chainId=${chainId}, contractAddress=${contractAddress}`,
        envOsMachine: null,
        envBuildScript: null,
        envOptimizerScript: null,
        srcUrl: null,
      };
    }

    if (onchainCodeId.toString() !== historyCodeId) {
      return {
        chainId: chainId,
        contractAddress: contractAddress,
        isVerified: false,
        onchainCodeId: onchainCodeId,
        historyCodeId: historyCodeId === null ? null : Number(historyCodeId),
        isImmutable: isImmutable,
        errMsg: `codeId changed. chainId=${chainId}, contractAddress=${contractAddress}, remix codeId=${historyCodeId}, onchainCodeId=${onchainCodeId}`,
        envOsMachine: history.envOsMachine,
        envBuildScript: history.envBuildScript,
        envOptimizerScript: history.envOptimizerScript,
        srcUrl: null,
      };
    }

    const onchainChecksum = this.checksum(chainId, onchainCodeId.toString());
    const remixChecksum = history.checksum;
    if (onchainChecksum !== remixChecksum) {
      return {
        chainId: chainId,
        contractAddress: contractAddress,
        isVerified: false,
        onchainCodeId: onchainCodeId,
        historyCodeId: historyCodeId === null ? null : Number(historyCodeId),
        isImmutable: isImmutable,
        errMsg: null,
        envOsMachine: history.envOsMachine,
        envBuildScript: history.envBuildScript,
        envOptimizerScript: history.envOptimizerScript,
        srcUrl: null,
      };
    }

    const verifiedSrcUrl = await this.s3Service.downloadUrl(
      S3Path.bucket(),
      S3Path.srcKey(
        'neutron',
        chainId,
        history.account,
        history.compileTimestamp!!.toString(),
      ),
    );
    if (!verifiedSrcUrl) {
      return {
        chainId: chainId,
        contractAddress: contractAddress,
        isVerified: false,
        onchainCodeId: onchainCodeId,
        historyCodeId: historyCodeId === null ? null : Number(historyCodeId),
        isImmutable: isImmutable,
        errMsg: `Not found source. chainId=${chainId}, account=${history.account}, contractAddress=${contractAddress}, remix codeId=${historyCodeId}, onchainCodeId=${onchainCodeId}`,
        envOsMachine: history.envOsMachine,
        envBuildScript: history.envBuildScript,
        envOptimizerScript: history.envOptimizerScript,
        srcUrl: null,
      };
    }

    history.verifiedCodeId = onchainCodeId.toString();
    history.updatedAt = new Date();
    history.updatedBy = 'Verification';

    await this.neutronDeployHistoryRepository.save(history);

    return {
      chainId: chainId,
      contractAddress: contractAddress,
      isVerified: true,
      onchainCodeId: onchainCodeId,
      historyCodeId: historyCodeId === null ? null : Number(historyCodeId),
      isImmutable: isImmutable,
      errMsg: null,
      envOsMachine: history.envOsMachine,
      envBuildScript: history.envBuildScript,
      envOptimizerScript: history.envOptimizerScript,
      srcUrl: verifiedSrcUrl,
    };
  }

  checksum(chainId: NeutronChainId, codeId: string): string {
    return NeutronVerificationHelper.checksum(chainId, codeId);
  }
}
