"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const langium_1 = require("langium");
const node_1 = require("langium/node");
const node_2 = require("vscode-languageserver/node");
const rsl_module_1 = require("./rsl-module");
const langium_sprotty_1 = require("langium-sprotty");
// Create a connection to the client
const connection = (0, node_2.createConnection)(node_2.ProposedFeatures.all);
// Inject the shared services and language-specific services
const { shared } = (0, rsl_module_1.createRslServices)(Object.assign({ connection }, node_1.NodeFileSystem));
// Start the language server with the shared services
(0, langium_1.startLanguageServer)(shared);
(0, langium_sprotty_1.addDiagramHandler)(connection, shared);
//# sourceMappingURL=main.js.map