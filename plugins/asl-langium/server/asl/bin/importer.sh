#!/bin/bash
typeofbuild="$1"
all="All"
outputDir=$2
inputDIr=$3
APP_HOME="$( cd -- "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"

java -cp $APP_HOME/../lib/org.itlingo.asl.ide-1.0.0-SNAPSHOT-ls.jar org.itlingo.asl.importer.Program 1 $3 "output.asl" $1

mv output.asl $2/output$(date +%s).asl