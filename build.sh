#!/bin/sh

echo "============================= git checkout deploy ==========================="
git checkout -B deploy

echo "============================= git commit ============================="
git add .
git commit -am 'deploy'
