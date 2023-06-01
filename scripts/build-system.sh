#!/usr/bin/env bash
set -euo pipefail

TARGET="wasm32-unknown-unknown"
SCRIPT_DIR="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

pushd $SCRIPT_DIR

yarn build

# NOTE: On macOS a specific version of llvm-ar and clang need to be set here.
# Otherwise the wasm compilation of rust-secp256k1 will fail.
if [ "$(uname)" == "Darwin" ]; then
  LLVM_PATH=$(brew --prefix llvm)
  # On macs we need to use the brew versions
  AR="${LLVM_PATH}/bin/llvm-ar" CC="${LLVM_PATH}/bin/clang" cargo build --target $TARGET --release
else
  cargo build --target $TARGET --release
fi
  # go to the root directory
  ROOT_DIR=$SCRIPT_DIR/..

  NEW_SYSTEM_DIR=$ROOT_DIR/target/$TARGET/release/b3_system.wasm

  OLD_SYSTEM_DIR=$ROOT_DIR/wasm/b3_system/b3_system.wasm

  DID_FILE=$ROOT_DIR/backend/b3_system/b3_system.did

  mkdir -p $ROOT_DIR/wasm/b3_system

  printf "\nOptimizing wasm...\n"

  printf "Before optimization: "
  du -h $NEW_SYSTEM_DIR | cut -f1

  #  optimize wasm
  ic-wasm $NEW_SYSTEM_DIR -o $OLD_SYSTEM_DIR shrink --optimize Oz

  #  add candid interface
  ic-wasm $OLD_SYSTEM_DIR -o $OLD_SYSTEM_DIR metadata candid:service -f $DID_FILE -v public

  printf "After optimization: "
  du -h $OLD_SYSTEM_DIR | cut -f1


popd
