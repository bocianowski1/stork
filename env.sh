#!/bin/bash

for line in $(cat .env); do
  if [[ $line == \#* ]]; then
    continue
  fi
  echo "export $line"
  export $line
done