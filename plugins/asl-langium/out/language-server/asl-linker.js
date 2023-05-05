"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AslLinker = void 0;
const langium_1 = require("langium");
class AslLinker extends langium_1.DefaultLinker {
    //private services: AslServices;
    constructor(services) {
        super(services);
        //    this.services = services;
    }
}
exports.AslLinker = AslLinker;
//# sourceMappingURL=asl-linker.js.map