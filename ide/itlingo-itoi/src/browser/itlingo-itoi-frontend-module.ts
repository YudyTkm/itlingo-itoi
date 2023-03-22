/**
 * Generated using theia-extension-generator
 */
import { ContainerModule } from '@theia/core/shared/inversify';
import { TheiaSendBdFileUpdates } from './itlingo-itoi';
import { GettingStartedWidget } from './itlingo-itoi-widget';
import {  TheiaExampleCommandContribution } from './itlingo-itoi-menucontribution';
import { WidgetFactory, FrontendApplicationContribution, bindViewContribution  } from '@theia/core/lib/browser';
//import { KeybindingContribution } from '@theia/core/lib/browser';

import { CommandContribution } from '@theia/core/lib/common';

import '../../src/browser/style/index.css';


export default new ContainerModule(bind => {
    // add your contribution bindings here
    bind(FrontendApplicationContribution).to(TheiaSendBdFileUpdates);
    bindViewContribution(bind, TheiaSendBdFileUpdates);
    bind(FrontendApplicationContribution).toService(TheiaSendBdFileUpdates);
    bind(CommandContribution).to(TheiaExampleCommandContribution);

    //bind(KeybindingContribution).to(TheiaExampleKeybindingContribution);
    bind(GettingStartedWidget).toSelf();
    bind(WidgetFactory).toDynamicValue(context => ({
        id: GettingStartedWidget.ID,
        createWidget: () => context.container.get<GettingStartedWidget>(GettingStartedWidget),
    })).inSingletonScope();
});



