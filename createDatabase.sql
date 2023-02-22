CREATE TABLE t_files (
filename varchar unique not null,
workspace varchar,
create_date TIMESTAMP not null default now(),
change_date TIMESTAMP,
file bytea );

export DATABASE_URL=postgres://itlingo:itlingo@172.21.240.1:5432/itlingo



cd /home/theia
git clone https://github.com/genlike/rsl-vscode-extension.git
chmod +x /home/theia/rsl-vscode-extension/server/mydsl/bin/org.xtext.itlingo.rsl.ide-1.0.0-SNAPSHOT-ls.jar
chmod +x /home/theia/rsl-vscode-extension/server/mydsl/bin/start-ls-itlingo
chmod +x /home/theia/rsl-vscode-extension/server/mydsl/bin/start-ls-itlingo.bat
npm install -g vsce
cd /home/theia/rsl-vscode-extension
yarn
vsce package
cp rsl-vscode-xtext-0.0.5.vsix /home/theia/pub/plugins/
cd /home/theia && rm -R ./rsl-vscode-extension



rm -R /tmp/vscode-unpacked/asl-vscode-xtext-0.0.5.vsix
rm /home/theia/pub/plugins/asl-vscode-xtext-0.0.5.vsix
cd /home/theia
git clone https://github.com/genlike/asl-vscode-extension.git
chmod +x /home/theia/asl-vscode-extension/server/asl/bin/generator.sh
chmod +x /home/theia/asl-vscode-extension/server/asl/bin/importer.sh
chmod +x /home/theia/asl-vscode-extension/server/asl/bin/start-asl-ls-itlingo
chmod +x /home/theia/asl-vscode-extension/server/asl/bin/start-asl-ls-itlingo.bat
cd /home/theia/asl-vscode-extension
yarn
vsce package
cp asl-vscode-xtext-0.0.5.vsix /home/theia/pub/plugins/
cd .. && rm -R ./asl-vscode-extension
cd /home/theia/pub/browser-app
yarn theia start  --plugins=local-dir:../plugins  --hostname 0.0.0.0 --port 3000




rm -R /tmp/vscode-unpacked/rsl-vscode-xtext-0.0.5.vsix
rm /home/theia/pub/plugins/rsl-vscode-xtext-0.0.5.vsix
cd /home/theia
git clone https://github.com/genlike/rsl-vscode-extension.git
chmod +x /home/theia/rsl-vscode-extension/server/rsl/bin/start-ls-itlingo
chmod +x /home/theia/rsl-vscode-extension/server/rsl/bin/start-ls-itlingo.bat
cd /home/theia/rsl-vscode-extension
yarn
cd webview
yarn
cd ..
vsce package
cp rsl-vscode-xtext-0.0.5.vsix /home/theia/pub/plugins/
cd /home/theia/pub/browser-app
yarn theia start  --plugins=local-dir:../plugins  --hostname 0.0.0.0 --port 3000




drwxr-xr-x 3 root root     4096 Jan  4 00:45 ../
-rw-r--r-- 1 root root   466898 Jan  4 00:41 org.itlingo.rsl.ide-1.0.0-SNAPSHOT.jar
-rwxr-xr-x 1 root root 21396946 Jan  4 00:41 org.xtext.itlingo.rsl.ide-1.0.0-SNAPSHOT-ls.jar*
-rwxr-xr-x 1 root root    10214 Jan  4 00:41 start-ls-itlingo*
-rw-r--r-- 1 root root     7568 Jan  4 00:41 start-ls-itlingo_
-rwxr-xr-x 1 root root     2795 Jan  4 00:41 start-ls-itlingo.bat*
