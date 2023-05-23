/**
 * Generated using theia-extension-generator
 */
import { ContainerModule } from '@theia/core/shared/inversify';
import { TheiaSendBdFileUpdates } from './itlingo-itoi';
import { GettingStartedWidget } from './itlingo-itoi-widget';
import {  TheiaExampleCommandContribution } from './itlingo-itoi-menucontribution';
import { WidgetFactory, FrontendApplicationContribution, bindViewContribution, WebSocketConnectionProvider  } from '@theia/core/lib/browser';
import * as monaco from '@theia/monaco-editor-core';
//import { KeybindingContribution } from '@theia/core/lib/browser';

import { CommandContribution } from '@theia/core/lib/common';

import '../../src/browser/style/index.css';
import { SharedStringClient, SharedStringServer } from '../node/SharedStringServer';


export default new ContainerModule(bind => {
    // add your contribution bindings here
    bind(FrontendApplicationContribution).to(TheiaSendBdFileUpdates);
    bindViewContribution(bind, TheiaSendBdFileUpdates);
    bind(FrontendApplicationContribution).toService(TheiaSendBdFileUpdates);
    bind(CommandContribution).to(TheiaExampleCommandContribution);
    bind(TheiaExampleCommandContribution).toSelf();
    //bind(KeybindingContribution).to(TheiaExampleKeybindingContribution);
    bind(GettingStartedWidget).toSelf();
    bind(WidgetFactory).toDynamicValue(context => ({
        id: GettingStartedWidget.ID,
        createWidget: () => context.container.get<GettingStartedWidget>(GettingStartedWidget),
    })).inSingletonScope();
    bind(SharedStringServer).toDynamicValue(ctx => {
        const sharedStringClient: SharedStringClient = {
          onGreet: (greetings: string) => console.log("received greetings: " + greetings),
          onSharedStringChange(type, position, text) {
            const theiaCommandContrib = ctx.container.get<TheiaExampleCommandContribution>(TheiaExampleCommandContribution);
            const codeModel = theiaCommandContrib.getEditor()?.getControl().getModel() as monaco.editor.ITextModel;
            const codeEditor = theiaCommandContrib.getEditor()?.getControl() as monaco.editor.ICodeEditor;
            console.log("received sharedString change: " + text);
            switch (type) {
              case "insert":
                  const posRange1 = offsetsToRange(codeModel, position, undefined);
                  const texti = text || "";
                  codeEditor.executeEdits("remote", [{ range: posRange1, text: texti }]);
                break;
                case "remove":
                  const posRange = offsetsToRange(codeModel, position,position + text.length);
                  const textr = "";
                  codeEditor.executeEdits("remote", [{ range: posRange, text: textr }]);
                break;
              default:
                break;
            }
          },
        };
        const connection = ctx.container.get(WebSocketConnectionProvider);

        return connection.createProxy<SharedStringServer>(
          "/services/greeter",
          sharedStringClient
        );
      });
});

function  offsetsToRange(codeModel: monaco.editor.ITextModel, offset1: number , offset2?: number): monaco.Range {
      const pos1 = codeModel.getPositionAt(offset1);
      const pos2 = typeof offset2 === "number" ? codeModel.getPositionAt(offset2) : pos1;
  const range = new monaco.Range(
      pos1.lineNumber,
      pos1.column,
      pos2.lineNumber,
      pos2.column,
  );
  return range;
  };

