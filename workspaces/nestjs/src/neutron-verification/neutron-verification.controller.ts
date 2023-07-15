import { Body, Controller, Get, Post, Query } from '@nestjs/common';

import { NeutronChainId } from 'src/neutron-verification/neutron-verification-helper';
import {
  NeutronVerificationResult,
  NeutronVerificationService,
} from 'src/neutron-verification/neutron-verification.service';

export class NeutronVerificationReqDto {
  chainId: NeutronChainId;
  contractAddress: string;
}

@Controller('verification/neutron')
export class NeutronVerificationController {
  constructor(private neutronVerificationService: NeutronVerificationService) {}

  @Post('')
  async verify(
    @Body() neutronVerificationReqDto: NeutronVerificationReqDto,
  ): Promise<NeutronVerificationResult> {
    return await this.neutronVerificationService.verify(
      neutronVerificationReqDto.chainId,
      neutronVerificationReqDto.contractAddress,
    );
  }

  @Get('checksum')
  checksum(
    @Query('chainId') chainId: NeutronChainId,
    @Query('codeId') codeId: string,
  ): string {
    return this.neutronVerificationService.checksum(chainId, codeId);
  }
}
