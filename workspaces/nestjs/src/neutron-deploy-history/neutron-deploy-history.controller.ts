import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { NeutronDeployHistoryService } from 'src/neutron-deploy-history/neutron-deploy-history.service';
import { NeutronDeployHistoryCreateDto } from 'src/neutron-deploy-history/dto/neutron-deploy-history-create.dto';
import { NeutronDeployHistoryDto } from 'src/neutron-deploy-history/dto/neutron-deploy-history.dto';
import { NeutronDeployHistoryCreateVo } from 'src/neutron-deploy-history/vo/neutron-deploy-history.create.vo';

@Controller('neutron-deploy-histories')
export class NeutronDeployHistoryController {
  constructor(private deployHistoryService: NeutronDeployHistoryService) {}

  @Get('')
  async find(
    @Query('chainId') chainId: string,
    @Query('offset') offset = 0,
    @Query('fetchSize') fetchSize = 50,
  ): Promise<NeutronDeployHistoryDto[]> {
    return await this.deployHistoryService.find(chainId, offset, fetchSize);
  }

  @Post('')
  create(@Body() deployHistoryCreateDto: NeutronDeployHistoryCreateDto) {
    const vo = new NeutronDeployHistoryCreateVo();
    vo.chainId = deployHistoryCreateDto.chainId;
    vo.account = deployHistoryCreateDto.account;
    vo.codeId = deployHistoryCreateDto.codeId;
    vo.contractAddress = deployHistoryCreateDto.contractAddress;
    vo.compileTimestamp = deployHistoryCreateDto.compileTimestamp;
    vo.deployTimestamp = deployHistoryCreateDto.deployTimestamp;
    vo.txHash = deployHistoryCreateDto.txHash;
    vo.checksum = deployHistoryCreateDto.checksum;
    vo.isSrcUploaded = deployHistoryCreateDto.isSrcUploaded;
    vo.createdBy = deployHistoryCreateDto.createdBy;
    return this.deployHistoryService.create(vo);
  }
}
