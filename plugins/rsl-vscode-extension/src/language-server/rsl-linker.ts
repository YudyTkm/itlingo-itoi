import { DefaultLinker } from 'langium';
//import { Cancellatio nToken } from 'vscode-languageserver';
//import { Model } from './generated/ast';
import { RslServices } from './rsl-module';



export class RslLinker extends DefaultLinker {
    //private services: AslServices;
    constructor(services: RslServices){
        super(services);
    //    this.services = services;
    }
}