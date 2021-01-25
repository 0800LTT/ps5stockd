@echo off

set ZipFileName="stockd.zip"

rm %ZipFileName%

7z a -tzip %ZipFileName% lambda_function.js stockd.js stubs.js package.json node_modules
