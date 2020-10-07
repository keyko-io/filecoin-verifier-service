#!/usr/bin/env bash

__PWD=$PWD
__DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
__PARENT_DIR=$(dirname $__DIR)

LOTUS_BIN="lotus"
LOTUS_SEED="lotus-seed"
LOTUS_MINER="lotus-miner"

##### Functions

restart_lotus() {

  echo "restarting"

}

configure_lotus() {

  mkdir ~/.lotus
  mkdir ~/.lotusminer

  echo -e "\nPre-seal some sectors:\n"
  $LOTUS_SEED pre-seal --sector-size 2KiB --num-sectors 2

  export ROOT=t101

  echo -e "\nCreate the genesis block and start up the first node:\n"
  $LOTUS_SEED genesis new localnet.json
  $LOTUS_SEED genesis add-miner localnet.json ~/.genesis-sectors/pre-seal-t01000.json
  jq '. + {VerifregRootKey: {Type: "multisig", Balance: "50000000000000000000000000", Meta: { Signers: ["t1cncuf2kvfzsmsij3opaypup527ounnpwhiicdci"], Threshold: 1 }}}' localnet.json > localnet2.json

  cp localnet2.json localnet.json
  tmux new-session -s lotus -n script -d bash setup.sh

  cp ~/config.toml ~/.lotus/config.toml
  sleep 5
#  $LOTUS_BIN daemon --lotus-make-genesis=dev.gen --genesis-template=localnet.json --bootstrap=false
  tmux new-window -t lotus:1 -n daemon -d $LOTUS_BIN daemon --lotus-make-genesis=dev.gen --genesis-template=localnet.json --bootstrap=false

  $LOTUS_BIN wait-api
  echo -e "\nImporting the genesis miner key:\n"
  $LOTUS_BIN wallet import ~/.genesis-sectors/pre-seal-t01000.key
  $LOTUS_BIN wallet import rootkey1

  sleep 3
  echo -e "\nSetting up the genesis miner:\n"
  $LOTUS_MINER init --genesis-miner --actor=t01000 --sector-size=2KiB \
    --pre-sealed-sectors=~/.genesis-sectors \
    --pre-sealed-metadata=~/.genesis-sectors/pre-seal-t01000.json --nosync

  sleep 3
  echo -e "\nStarting up the miner:\n"
  cp ~/config-miner.toml ~/.lotusminer/config.toml
  tmux new-window -t lotus:2 -n miner -d $LOTUS_MINER run --nosync
#  $LOTUS_MINER run --nosync
  tmux new-window -t lotus:3 -n service -d bash run-service.sh
}

restart_lotus() {
  tmux new-session -s lotus -n script -d bash -c "sleep 10000000"
  tmux new-window -t lotus:1 -n daemon -d $LOTUS_BIN daemon --genesis=dev.gen --bootstrap=false
  $LOTUS_BIN wait-api
  tmux new-window -t lotus:2 -n miner -d $LOTUS_MINER run --nosync
  tmux new-window -t lotus:3 -n service -d bash run-service.sh
}

main() {

  echo -e "\nUsing Lotus Path: $LOTUS_PATH \n"

  if [ -f ~/.lotusminer/token ]; then
    restart_lotus
  else
    configure_lotus
  fi

  sleep 10

  echo "Token for node: $(cat ~/.lotus/token)"
  echo "Token for miner: $(cat ~/.lotusminer/token)"
  echo "Token for service: $(cat /filecoin-verifier-service/token)"

  sleep 1000000000
}

#### Main

main
