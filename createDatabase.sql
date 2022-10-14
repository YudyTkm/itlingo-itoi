CREATE TABLE t_files (
filename varchar unique not null,
workspace varchar,
create_date TIMESTAMP not null default now(),
change_date TIMESTAMP,
file bytea );

postgres://postgres:postgres@172.21.160.1:5432/itlingo



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


cd /home/theia
git clone https://github.com/genlike/asl-vscode-extension.git
chmod +x /home/theia/asl-vscode-extension/server/mydsl/bin/org.xtext.itlingo.asl.ide-1.0.0-SNAPSHOT-ls.jar
chmod +x /home/theia/asl-vscode-extension/server/mydsl/bin/start-ls-itlingo
chmod +x /home/theia/asl-vscode-extension/server/mydsl/bin/start-ls-itlingo.bat
cd /home/theia/asl-vscode-extension
yarn
vsce package
cp asl-vscode-xtext-0.0.5.vsix /home/theia/pub/plugins/
cd .. && rm -R ./asl-vscode-extension