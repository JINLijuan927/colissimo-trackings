#!/bin/sh

echo "============================= push to heroku staging ================================"
git push staging deploy:master -f
