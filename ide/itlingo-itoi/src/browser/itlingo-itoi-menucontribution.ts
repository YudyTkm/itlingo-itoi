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
import axios from 'axios';

//var g_readOnly:boolean | undefined = undefined;

type GitUser = {
    email: string,
    username: string,
    accessCode: string,
    repository: string
}

const gitUser: GitUser = {
    email: localStorage.getItem("gitEmail") ?? '',
    username: localStorage.getItem("gitUsername") ?? '',
    accessCode: localStorage.getItem("gitAccessCode") ?? '',
    repository: localStorage.getItem("gitRepo") ?? ''
};


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
        let defaultBranch1 = localStorage.getItem("defaultBranch1");
        let defaultBranch2 = localStorage.getItem("defaultBranch2");
        let inputBox1 = this.quickInputService.createInputBox();
        inputBox1.description = "Branch remote"
        inputBox1.placeholder = "origin"
        inputBox1.value = defaultBranch1 ?? 'origin';
        inputBox1.onDidAccept(() => {
            localStorage.setItem("defaultBranch1",inputBox1.value ?? '')
            let inputBox2 = this.quickInputService.createInputBox();
            inputBox2.description = "Branch local"
            inputBox2.placeholder = "main"
            inputBox2.value = defaultBranch2 ?? 'main';
            inputBox2.onDidAccept(() => {
                localStorage.setItem("defaultBranch2",inputBox1.value ?? '');
                axios.get("/gitPull", {params:{ branch1:inputBox1.value ?? '', branch2:inputBox2.value ?? ''}});
                inputBox2.hide();
            });
            inputBox1.hide();
            inputBox2.show();
        });
        inputBox1.show();
    }
    myGitPush(){
        let defaultBranch1 = localStorage.getItem("defaultBranch1");
        let defaultBranch2 = localStorage.getItem("defaultBranch2");
        let inputBox1 = this.quickInputService.createInputBox();
        inputBox1.description = "Branch remote"
        inputBox1.placeholder = "origin"
        inputBox1.value = defaultBranch1 ?? 'origin';
        inputBox1.onDidAccept(() => {
            localStorage.setItem("defaultBranch1",inputBox1.value ?? '')
            let inputBox2 = this.quickInputService.createInputBox();
            inputBox2.description = "Branch local"
            inputBox2.placeholder = "main"
            inputBox2.value = defaultBranch2 ?? 'main';
            inputBox2.onDidAccept(() => {
                localStorage.setItem("defaultBranch2",inputBox1.value ?? '');
                axios.get("/gitPush", {params:{ branch1:localStorage.getItem("defaultBranch1") ?? '', branch2:localStorage.getItem("defaultBranch2") ?? ''}});
                inputBox2.hide();
            });
            inputBox1.hide();
            inputBox2.show();
        });
        inputBox1.show();
    }
    async myGitClone(){
        //Let the user fillout a form (email, username, access token, repo)
        let inputBox1 = this.quickInputService.createInputBox();
        inputBox1.description = "Please input your email"
        inputBox1.placeholder = "john@email.com"
        inputBox1.value = localStorage.getItem("gituser.email") ?? '';
        inputBox1.onDidAccept(() => {
            gitUser.email = inputBox1.value?.toString() ?? '';
            let inputBox2 = this.quickInputService.createInputBox();
            inputBox2.description = "Please your username"
            inputBox2.placeholder = "johnson"
            inputBox2.value = localStorage.getItem("gituser.username") ?? '';
            inputBox2.onDidAccept(() => {
                gitUser.username = inputBox2.value?.toString() ?? '';
                let inputBox3 = this.quickInputService.createInputBox();
                inputBox3.description = "Repository url";
                inputBox3.value = localStorage.getItem("gituser.repo") ?? '';
                inputBox3.placeholder = "https://username:token@github.com/username/repo.git";
                inputBox3.password = false;
                inputBox3.onDidAccept(() => {
                    gitUser.repository = inputBox3.value?.toString() ?? '';
                    callCloneBatch();
                    inputBox3.hide();
                });
                inputBox2.hide();
                inputBox3.show();    
            });
            inputBox1.hide();
            inputBox2.show();
        });
        inputBox1.show();
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





function callCloneBatch() {
    let encoded = Buffer.from(JSON.stringify(gitUser)).toString("base64");
    localStorage.setItem("gituser.email", gitUser.email);
    localStorage.setItem("gituser.username", gitUser.username);
    localStorage.setItem("gituser.repo", gitUser.repository);
    //let commandString = `${gitUser.email} ${gitUser.username} ${gitUser.accessCode} ${gitUser.repository}`
    axios.get("/cloneRepo", {params:{
        data:encoded
    }});
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


