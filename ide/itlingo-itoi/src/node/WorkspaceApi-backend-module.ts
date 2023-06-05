import { ContainerModule } from 'inversify';
import { BackendApplicationContribution } from '@theia/core/lib/node';
import { SwitchWSBackendContribution } from './WorkspaceApi-backend-contribution';
import { ItoiClient, ItoiServer, ItoiServerNode } from './ItoiServer';
import { ConnectionHandler, JsonRpcConnectionHandler } from '@theia/core';


export default new ContainerModule(bind => {
    bind(BackendApplicationContribution).to(SwitchWSBackendContribution);
    bind(ItoiServer)
    .to(ItoiServerNode)
    .inSingletonScope();
  bind(ConnectionHandler)
    .toDynamicValue(
      ctx =>
        new JsonRpcConnectionHandler<ItoiClient>(
          "/services/itoi",
          client => {
            const sharedStringServer = ctx.container.get<ItoiServer>(
              ItoiServer
            );
            sharedStringServer.setClient(client);
            return sharedStringServer;
          }
        )
    )
    .inSingletonScope();
});