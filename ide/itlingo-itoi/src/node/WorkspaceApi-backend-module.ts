import { ContainerModule } from 'inversify';
import { BackendApplicationContribution } from '@theia/core/lib/node';
//import { LanguageServerContribution } from '@theia/languages/lib/node';
import { SwitchWSBackendContribution } from './WorkspaceApi-backend-contribution';
//import { ITLangLanguageServerContribution } from './WorkspaceLS-backend-contribution';

export default new ContainerModule(bind => {
    bind(BackendApplicationContribution).to(SwitchWSBackendContribution);
    //bind(LanguageServerContribution).to(ITLangLanguageServerContribution).inSingletonScope();
});