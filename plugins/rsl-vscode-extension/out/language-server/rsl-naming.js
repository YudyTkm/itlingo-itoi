"use strict";
/******************************************************************************
 * Copyright 2021 TypeFox GmbH
 * This program and the accompanying materials are made available under the
 * terms of the MIT License, which is available in the project root.
 ******************************************************************************/
Object.defineProperty(exports, "__esModule", { value: true });
exports.QualifiedNameProvider = void 0;
// export function toQualifiedName(pack: PackageSystem, childName: string): string {
//     return (isPackageSystem(pack.$container) ? toQualifiedName(pack.$container, pack.name) : pack.name) + '.' + childName;
// }
class QualifiedNameProvider {
    /**
     * @param qualifier if the qualifier is a `string`, simple string concatenation is done: `qualifier.name`.
     *      if the qualifier is a `PackageDeclaration` fully qualified name is created: `package1.package2.name`.
     * @param name simple name
     * @returns qualified name separated by `.`
     */
    getQualifiedName(qualifier, name) {
        let prefix = qualifier;
        let res;
        if (name === '')
            return '';
        if (prefix.hasOwnProperty('name')) {
            res = prefix.name + '.' + name;
        }
        else if (prefix.$container) {
            res = this.getQualifiedName(prefix.$container, name);
        }
        else {
            res = name;
        }
        return res;
    }
}
exports.QualifiedNameProvider = QualifiedNameProvider;
//# sourceMappingURL=rsl-naming.js.map