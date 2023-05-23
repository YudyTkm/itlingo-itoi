import { ContainerModule } from 'inversify';
import { BackendApplicationContribution } from '@theia/core/lib/node';
import { SwitchWSBackendContribution } from './WorkspaceApi-backend-contribution';
import { SharedStringClient, SharedStringServer, SharedStringServerNode } from './SharedStringServer';
import { ConnectionHandler, JsonRpcConnectionHandler } from '@theia/core';

export default new ContainerModule(bind => {
    bind(BackendApplicationContribution).to(SwitchWSBackendContribution);
    bind(SharedStringServer)
    .to(SharedStringServerNode)
    .inSingletonScope();
  bind(ConnectionHandler)
    .toDynamicValue(
      ctx =>
        new JsonRpcConnectionHandler<SharedStringClient>(
          "/services/greeter",
          client => {
            const sharedStringServer = ctx.container.get<SharedStringServer>(
              SharedStringServer
            );
            sharedStringServer.setClient(client);
            return sharedStringServer;
          }
        )
    )
    .inSingletonScope();
});