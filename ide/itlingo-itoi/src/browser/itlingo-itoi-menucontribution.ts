import { injectable, inject } from '@theia/core/shared/inversify';
import { CommandContribution,MessageService, CommandHandler, CommandRegistry, MenuContribution, MenuModelRegistry } from '@theia/core/lib/common';
import { KeybindingContribution, KeybindingRegistry, QuickInputService } from '@theia/core/lib/browser';
import { GIT_COMMANDS, GIT_MENUS } from '@theia/git/lib/browser/git-contribution';
import { } from '@theia/core/lib/browser'
import {
    TabBarToolbarContribution,
    TabBarToolbarItem,
    TabBarToolbarRegistry
} from '@theia/core/lib/browser/shell/tab-bar-toolbar';
// import {  CommonCommands } from '@theia/core/lib/browser';

//import axios from 'axios';

//var g_readOnly:boolean | undefined = undefined;

type GitUser = {
    email: string,
    username: string,
    accessCode: string,
}


@injectable()
export class TheiaExampleMenuContribution implements MenuContribution, TabBarToolbarContribution {
    @inject(CommandRegistry) protected readonly  commands: CommandRegistry;

    constructor(
        
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
    @inject(MessageService) 
    protected readonly  messageService: MessageService;
    @inject(CommandRegistry) 
    protected readonly  commands: CommandRegistry;

    constructor(
        
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
        GIT_COMMANDS.FETCH.label = "Clone...";
        commands.registerCommand(GIT_COMMANDS.FETCH, {
            execute: () => { 
                this.myGitClone(); 
            } 
        } as CommandHandler);
        commands.registerCommand(GIT_COMMANDS.PUSH, {
            execute:  () => { this.myGitPush(); } 
        } as CommandHandler);
        commands.registerCommand(GIT_COMMANDS.PULL, {
            execute: () => { this.myGitPull(); } 
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
    async myGitClone(){
        //First ask the user for credentials (email, username, access token)

        let gitUser: GitUser = {
            email: "",
            username: "",
            accessCode: ""
        };
        let inputBoxEmail = this.quickInputService.createInputBox();
        inputBoxEmail.description = "Please input your email"
        inputBoxEmail.placeholder = "john@email.com"
        inputBoxEmail.show();
        inputBoxEmail.onDidChangeValue((text) => {
            console.log("change text");
            gitUser.email = text;
        });
            // opiniao do mocado

        inputBoxEmail.onDidAccept(()=> {
            console.log("didAcceptEmail");
            console.log(gitUser.email);
            let inputBoxUsername = this.quickInputService.createInputBox();
            inputBoxUsername.description = "Please your username"
            inputBoxUsername.placeholder = "johnson"
            inputBoxUsername.onDidChangeValue((text) => {
                gitUser.username = text;
            });
            inputBoxUsername.onDidAccept(()=>{
                let inputBoxPassword = this.quickInputService.createInputBox();
                inputBoxPassword.description = "Please input your access code"
                inputBoxPassword.password = true
                inputBoxPassword.onDidChangeValue((text) => {
                    gitUser.accessCode = text;
                });
                inputBoxPassword.onDidAccept(()=>{
                    console.log(gitUser.email);
                    console.log(gitUser.username);
                    console.log(gitUser.accessCode);
                });
                inputBoxPassword.show();
            });
            inputBoxUsername.show();
        });
            
        
        
        //If there are existing files move them to temporary folder (explicit copy then delete for database events)

        //Perform git clone

        //Move files from the temporary folder back here
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


