import { injectable, inject } from '@theia/core/shared/inversify';
import { CommandContribution,MessageService, CommandHandler, CommandRegistry, MenuContribution, MenuModelRegistry } from '@theia/core/lib/common';
import { KeybindingContribution, KeybindingRegistry, QuickInputService, } from '@theia/core/lib/browser';
import { GIT_COMMANDS, GIT_MENUS } from '@theia/git/lib/browser/git-contribution';

import {
    TabBarToolbarContribution,
    TabBarToolbarItem,
    TabBarToolbarRegistry
} from '@theia/core/lib/browser/shell/tab-bar-toolbar';
// import {  CommonCommands } from '@theia/core/lib/browser';

//import axios from 'axios';

//var g_readOnly:boolean | undefined = undefined;

@injectable()
export class TheiaExampleMenuContribution implements MenuContribution, TabBarToolbarContribution {


    constructor(
        @inject(CommandRegistry) protected readonly  commands: CommandRegistry
    ){
    }


    protected asSubMenuItemOf(submenu: { group: string; label: string; menuGroups: string[]; }, groupIdx: number = 0): string {
        return submenu.group + '/' + submenu.label + '/' + submenu.menuGroups[groupIdx];
    }

    registerToolbarItems(registry: TabBarToolbarRegistry): void {
        const registerItem = (item: TabBarToolbarItem) => {
            const commandId = item.command;
            const id = '__git.tabbar.toolbar.' + commandId;
            const command = this.commands.getCommand(commandId);
            this.commands.registerCommand({ id, iconClass: command && command.iconClass }, {
                execute: ( ...args) =>  this.commands.executeCommand(commandId, ...args),
                isEnabled: ( ...args) => this.commands.isEnabled(commandId, ...args),
            });
            item.command = id;
            registry.registerItem(item);
        };

        registerItem({
            id: GIT_COMMANDS.CLONE.id,
            command: GIT_COMMANDS.CLONE.id,
            tooltip: GIT_COMMANDS.CLONE.label,
            group: this.asSubMenuItemOf(GIT_MENUS.SUBMENU_PULL_PUSH, 0)
        })

    }
    async registerMenus(menus: MenuModelRegistry): Promise<void> {
    }
}



@injectable()
export class TheiaExampleCommandContribution implements  CommandContribution {

    @inject(QuickInputService)
    protected readonly quickInputService: QuickInputService;
    

    constructor(
        @inject(MessageService) protected readonly  messageService: MessageService,
        @inject(CommandRegistry) protected readonly  commands: CommandRegistry
    ){
    }


   async registerCommands(commands: CommandRegistry): Promise<void> {
        
        // const readOnly = await getReadonly();
        //     if(readOnly){
        //         commands.unregisterCommand(WorkspaceCommands.FILE_DELETE);
        //         commands.unregisterCommand(WorkspaceCommands.NEW_FILE);
        //         commands.unregisterCommand(WorkspaceCommands.ADD_FOLDER);
        //         commands.unregisterCommand(WorkspaceCommands.NEW_FOLDER);
        //         commands.unregisterCommand(WorkspaceCommands.FILE_DUPLICATE);
        //         commands.unregisterCommand(WorkspaceCommands.FILE_RENAME);
        //         commands.unregisterCommand(CommonCommands.PASTE);
        //         commands.unregisterCommand(CommonCommands.COPY);
        //     } else {
        //         commands.registerCommand(WorkspaceCommands.FILE_DELETE);
        //         commands.registerCommand(WorkspaceCommands.NEW_FILE);
        //         commands.registerCommand(WorkspaceCommands.ADD_FOLDER);
        //         commands.registerCommand(WorkspaceCommands.NEW_FOLDER);
        //         commands.registerCommand(WorkspaceCommands.FILE_DUPLICATE);
        //         commands.registerCommand(WorkspaceCommands.FILE_RENAME);
        //         commands.registerCommand(CommonCommands.PASTE);
        //         commands.registerCommand(CommonCommands.COPY);
        //     }
        commands.unregisterCommand(GIT_COMMANDS.PULL);
        commands.unregisterCommand(GIT_COMMANDS.PULL_DEFAULT);
        commands.unregisterCommand(GIT_COMMANDS.PULL_DEFAULT_FAVORITE);
        commands.unregisterCommand(GIT_COMMANDS.PUSH);
        commands.unregisterCommand(GIT_COMMANDS.PUSH_DEFAULT);
        commands.unregisterCommand(GIT_COMMANDS.PUSH_DEFAULT_FAVORITE);
        commands.unregisterCommand(GIT_COMMANDS.CLONE);
        commands.unregisterCommand(GIT_COMMANDS.FETCH);

        GIT_MENUS.SUBMENU_PULL_PUSH.label = "Pull, Push, Clone";
        commands.registerCommand(GIT_COMMANDS.PULL, {
            execute: () => { this.myGitPull(); } 
        } as CommandHandler);
        commands.registerCommand(GIT_COMMANDS.PUSH, {
            execute:  () => { this.myGitPush(); } 
        } as CommandHandler);

        GIT_COMMANDS.FETCH.label = "Clone...";
        commands.registerCommand(GIT_COMMANDS.FETCH, {
            execute: () => { this.myGitClone(); } 
        } as CommandHandler);
    }

    myGitPull(){
        this.messageService.log("yo");
        console.log("yo pull");
    }
    myGitPush(){
        this.messageService.log("yo");
        console.log("yo push");
    }
    myGitClone(){
        this.messageService.log("yo");
        console.log("yo clone");
    }

}


@injectable()
export class TheiaExampleKeybindingContribution implements KeybindingContribution {
    async registerKeybindings(keybindings: KeybindingRegistry): Promise<void> {
        //const readOnly = await getReadonly()
            // if(readOnly){
            //     keybindings.unregisterKeybinding("ctrl+v");
            //     keybindings.unregisterKeybinding("cmd+v");
            //     keybindings.unregisterKeybinding("ctrl+c");
            //     keybindings.unregisterKeybinding("cmd+c");
            // }
    }
}




// async function getReadonly(): Promise<boolean>{
//     console.log("g_readonly= " + g_readOnly);
//     if(g_readOnly == undefined) {
//         const result = await axios.get<any>('/getWorkspace',{},)
//         g_readOnly = !result.data.readonly;
//         console.log("g_readonly= " + g_readOnly);
//         return g_readOnly ?? false;
//     }
//     return g_readOnly;
// }


