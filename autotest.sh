#!/bin/bash
if [ "$#" -ne 1 ]; then
    echo "Usage: $0 LANGUAGE"
	exit
fi
ln -s src_${1,,} src
cp test_makefiles/easymake_${1,,}.js easymake.js
make
make run
rm src
rm easymake.js
rm -R .ezmake_files
rm bin/*
