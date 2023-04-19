workspaceFolder=$1

cd $workspaceFolder
find .git -type d | xargs chmod 755
find .git/objects -type f | xargs chmod 444
find .git -type f | grep -v /objects/ | xargs chmod 644