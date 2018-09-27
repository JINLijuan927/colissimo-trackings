#!/bin/sh

echo "============================= push to heroku production ================================"
git push production deploy:master -f
