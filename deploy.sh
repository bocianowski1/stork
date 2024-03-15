#!/bin/bash

echo "Building for production..."

cd web && pnpm build && cd ..

fly deploy

