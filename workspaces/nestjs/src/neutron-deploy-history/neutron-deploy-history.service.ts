import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { NeutronDeployHistory } from './neutron-deploy-history.entity';
import {NeutronDeployHistoryCreateVo} from "src/neutron-deploy-history/vo/neutron-deploy-history.create.vo";
import {precondition} from "src/util/precondition";

@Injectable()
export class NeutronDeployHistoryService {
  constructor(
    @InjectRepository(NeutronDeployHistory)
    private readonly neutronDeployHistoryRepository: Repository<NeutronDeployHistory>,
  ) {}

  async findOne(id: number): Promise<NeutronDeployHistory | null> {
    return await this.neutronDeployHistoryRepository.findOne({
      where: {
        id: id,
      },
    });
  }

  async find(
    chainId: string,
    offset: number,
    fetchSize: number,
  ): Promise<NeutronDeployHistory[]> {
    precondition(
      0 < fetchSize && fetchSize <= 50,
      `max fetchSize must be greater than 0 and less than or equal 50. Requested fetchSize=${fetchSize}`,
    );

    return await this.neutronDeployHistoryRepository.find({
      where: {
        chainId,
        id: MoreThan(offset),
      },
      take: fetchSize,
      order: {
        id: 'ASC',
      },
    });
  }

  async create(deployHistoryCreateVo: NeutronDeployHistoryCreateVo) {
    const history = await this.neutronDeployHistoryRepository.findOne({
      where: {
        chainId: deployHistoryCreateVo.chainId,
        contractAddress: deployHistoryCreateVo.contractAddress,
      },
    });

    if (!history) {
      await this.neutronDeployHistoryRepository.save(
        NeutronDeployHistory.create(deployHistoryCreateVo),
      );
      return;
    }

    history.contractAddress = deployHistoryCreateVo.contractAddress;
    history.codeId = deployHistoryCreateVo.codeId;
    history.compileTimestamp = deployHistoryCreateVo.compileTimestamp;
    history.checksum = deployHistoryCreateVo.checksum;
    history.txHash = deployHistoryCreateVo.txHash;
    history.isSrcUploaded = deployHistoryCreateVo.isSrcUploaded;
    history.updatedBy = deployHistoryCreateVo.createdBy;
    history.updatedAt = new Date();

    await this.neutronDeployHistoryRepository.save(history);
  }
}
