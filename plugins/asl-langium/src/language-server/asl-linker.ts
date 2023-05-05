import { DefaultLinker } from 'langium';
//import { Cancellatio nToken } from 'vscode-languageserver';
//import { Model } from './generated/ast';
import { AslServices } from './asl-module';



export class AslLinker extends DefaultLinker {
    //private services: AslServices;
    constructor(services: AslServices){
        super(services);
    //    this.services = services;
    }
}