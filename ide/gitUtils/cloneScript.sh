#!/bin/sh
workspaceDir=$1
email=$2
username=$3
repo=$4

APP_HOME="$( cd -- "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"
log=log_file.txt

##If there are existing files move them to temporary folder (explicit copy then delete for database events)
destDir="/tmp/gitGarbage/$(date +%s)/files/"
mkdir -p $destDir
rm -rf "$workspaceDir/.git"
cp "$workspaceDir/"* $destDir
rm -rf "$workspaceDir/"{*,.*}

##Perform git clone
cd $workspaceDir
git clone $repo "$workspaceDir"

##Move files from the temporary folder back here


##Setup local git user
cd $workspaceDir
git config user.name "$username"
git config user.email "$email"

sleep 2
mv -v $destDir/* $workspaceDir/