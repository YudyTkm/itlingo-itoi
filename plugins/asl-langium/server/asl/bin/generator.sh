#!/bin/bash
inputFile=$2
typeofbuild="$1"
all="All"
outputDir=$3
APP_HOME="$( cd -- "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"

rm $APP_HOME/generator.properties
rm -R $APP_HOME/../lib/src-gen

if [ "$typeofbuild" != "$all" ]; then
    echo "PLATFORM=$typeofbuild" > $APP_HOME/generator.properties
fi

cd $APP_HOME
echo "$APP_HOME"
echo "java -cp $APP_HOME/../lib/org.itlingo.asl.ide-1.0.0-SNAPSHOT-ls.jar org.itlingo.asl.generator.Main $2"
java -cp $APP_HOME/../lib/org.itlingo.asl.ide-1.0.0-SNAPSHOT-ls.jar org.itlingo.asl.generator.Main $2
mv $outputDir/src-gen $outputDir/src-gen-$(date +%s)
mv $APP_HOME/src-gen $outputDir