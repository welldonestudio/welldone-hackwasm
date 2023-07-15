import { Column, Entity, PrimaryColumn } from 'typeorm';
import {
  ENV_NEUTRON_BUILD_SCRIPT,
  ENV_NEUTRON_OPTIMIZER_SCRIPT,
} from 'src/neutron-deploy-history/script';
import { NeutronDeployHistoryCreateVo } from 'src/neutron-deploy-history/vo/neutron-deploy-history.create.vo';
import { OS_MACHINE } from 'src/const/build-env';

@Entity('neutron_deploy_history')
export class NeutronDeployHistory {
  @PrimaryColumn() id: number;
  @Column({ type: 'varchar', nullable: false }) chainId: string;
  @Column({ type: 'varchar', nullable: false }) account: string;
  @Column({ type: 'varchar', nullable: false }) codeId: string;
  @Column({ type: 'varchar', nullable: false }) contractAddress: string;
  @Column({ type: 'boolean', nullable: true }) isImmutable: boolean;
  @Column({ type: 'bigint', nullable: true }) compileTimestamp: number | null;
  @Column({ type: 'bigint', nullable: true }) deployTimestamp: number | null;
  @Column({ type: 'varchar', nullable: true }) checksum: string | null;
  @Column({ type: 'varchar', nullable: false }) txHash: string | null;
  @Column({ type: 'boolean', nullable: false }) isSrcUploaded: boolean;
  @Column({ type: 'varchar', nullable: true }) verifiedCodeId: string | null;
  @Column({ type: 'varchar', nullable: true }) envOsVersion: string | null;
  @Column({ type: 'varchar', nullable: true }) envOsName: string | null;
  @Column({ type: 'varchar', nullable: true }) envOsMachine: string | null;
  @Column({ type: 'varchar', nullable: true }) envRustcVersion: string | null;
  @Column({ type: 'varchar', nullable: true }) envCargoWasmVersion:
    | string
    | null;
  @Column({ type: 'varchar', nullable: true }) envBuildScript: string | null;
  @Column({ type: 'varchar', nullable: true }) envOptimizerScript:
    | string
    | null;
  @Column({ type: 'timestamp', nullable: false }) createdAt: Date;
  @Column({ type: 'varchar', nullable: false }) createdBy: string;
  @Column({ type: 'timestamp', nullable: true }) updatedAt: Date | null;
  @Column({ type: 'varchar', nullable: true }) updatedBy: string | null;

  static create(vo: NeutronDeployHistoryCreateVo) {
    const neutronDeployHistory = new NeutronDeployHistory();
    neutronDeployHistory.chainId = vo.chainId;
    neutronDeployHistory.account = vo.account;
    neutronDeployHistory.codeId = vo.codeId;
    neutronDeployHistory.contractAddress = vo.contractAddress;
    neutronDeployHistory.compileTimestamp = vo.compileTimestamp;
    neutronDeployHistory.deployTimestamp = vo.deployTimestamp;
    neutronDeployHistory.txHash = vo.txHash;
    neutronDeployHistory.checksum = vo.checksum;
    neutronDeployHistory.isSrcUploaded = vo.isSrcUploaded;
    neutronDeployHistory.verifiedCodeId = null;
    neutronDeployHistory.envOsVersion = '22.04.1';
    neutronDeployHistory.envOsName = 'Ubuntu';
    neutronDeployHistory.envRustcVersion = '1.68.0';
    neutronDeployHistory.envCargoWasmVersion = '0.4.1';
    neutronDeployHistory.envOsMachine = OS_MACHINE;
    neutronDeployHistory.envBuildScript = ENV_NEUTRON_BUILD_SCRIPT;
    neutronDeployHistory.envOptimizerScript = ENV_NEUTRON_OPTIMIZER_SCRIPT;
    neutronDeployHistory.createdAt = new Date();
    neutronDeployHistory.createdBy = vo.createdBy;

    return neutronDeployHistory;
  }
}
