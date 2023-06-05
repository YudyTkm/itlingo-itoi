/**
 * Generated using theia-extension-generator
 */
import { ContainerModule } from '@theia/core/shared/inversify';
import { TheiaSendBdFileUpdates } from './itlingo-itoi';
import { GettingStartedWidget } from './itlingo-itoi-widget';
import {  TheiaExampleCommandContribution } from './itlingo-itoi-menucontribution';
import { WidgetFactory, FrontendApplicationContribution, bindViewContribution, WebSocketConnectionProvider  } from '@theia/core/lib/browser';
import { CommandContribution } from '@theia/core/lib/common';

import '../../src/browser/style/index.css';
import {  ItoiServer } from '../node/ItoiServer';
import { ItoiClientNode } from './ItoiClient';

export default new ContainerModule(bind => {
    // add your contribution bindings here
    bind(FrontendApplicationContribution).to(TheiaSendBdFileUpdates);
    bindViewContribution(bind, TheiaSendBdFileUpdates);
    bind(FrontendApplicationContribution).toService(TheiaSendBdFileUpdates);
    bind(CommandContribution).to(TheiaExampleCommandContribution);
    bind(TheiaExampleCommandContribution).toSelf();
    // bind(SharedStringClientImpl).toSelf().inSingletonScope();
    bind(GettingStartedWidget).toSelf();
    bind(WidgetFactory).toDynamicValue(context => ({
        id: GettingStartedWidget.ID,
        createWidget: () => context.container.get<GettingStartedWidget>(GettingStartedWidget),
    })).inSingletonScope();

    bind(ItoiServer).toDynamicValue(ctx => {
        const connection = ctx.container.get(WebSocketConnectionProvider);
        return connection.createProxy<ItoiServer>(
          "/services/itoi",
          ItoiClientNode
        );
      });
});





