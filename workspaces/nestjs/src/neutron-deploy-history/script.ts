import { OS_PLATFORM, OS_PLATFORM_DARWIN } from 'src/const/build-env';

const RUST_OPTIMIZER_IMG_DARWIN = 'cosmwasm/rust-optimizer-arm64:0.12.11';
const RUST_OPTIMIZER_IMG_LINUX = 'cosmwasm/rust-optimizer:0.12.11';
const RUST_OPTIMIZER_IMG =
  OS_PLATFORM === OS_PLATFORM_DARWIN
    ? RUST_OPTIMIZER_IMG_DARWIN
    : RUST_OPTIMIZER_IMG_LINUX;

export const NEUTRON_BUILD_COMMAND = 'cargo';
export const NEUTRON_BUILD_COMMAND_ARGS = ['wasm', 'build'];
export const ENV_NEUTRON_BUILD_SCRIPT = [
  NEUTRON_BUILD_COMMAND,
  ...NEUTRON_BUILD_COMMAND_ARGS,
].join(' ');

export const NEUTRON_OPTIMIZER_COMMAND = 'docker';
export const NEUTRON_OPTIMIZER_COMMAND_ARGS = [
  'run',
  '--rm',
  '-v',
  '"$(pwd)":/code',
  '--mount',
  'type=volume,source="$(basename "$(pwd)")_cache",target=/code/target',
  '--mount',
  'type=volume,source=registry_cache,target=/usr/local/cargo/registry',
  RUST_OPTIMIZER_IMG,
];
export const ENV_NEUTRON_OPTIMIZER_SCRIPT = [
  NEUTRON_OPTIMIZER_COMMAND,
  ...NEUTRON_OPTIMIZER_COMMAND_ARGS,
].join(' ');
