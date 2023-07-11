import { injectable, inject } from '@theia/core/shared/inversify';
import { CommandContribution,MessageService, CommandHandler, CommandRegistry, MenuContribution, MenuModelRegistry, Command } from '@theia/core/lib/common';
import { KeybindingContribution, KeybindingRegistry, QuickInputService } from '@theia/core/lib/browser';
import { GIT_COMMANDS, GIT_MENUS } from '@theia/git/lib/browser/git-contribution';
import { EditorManager } from '@theia/editor/lib/browser'
import {
    TabBarToolbarContribution,
    TabBarToolbarItem,
    TabBarToolbarRegistry
} from '@theia/core/lib/browser/shell/tab-bar-toolbar';
import axios from 'axios';
// import { SharedStringServer } from '../node/SharedStringServer';
// import { SharedStringClientImpl } from './SharedStringClientImpl';

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

export const StartCollab: Command = {
    id: 'itoicollab.startCollab',
    label: 'Start Collaboration'
};

export const JoinCollab : Command = {
    id: 'itoicollab.joinCollab',
    label: 'Join Collaboration'
};

export const StopCollab : Command = {
    id: 'itoicollab.stopCollab',
    label: 'Stop Collaboration'
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
        });

    }
    async registerMenus(menus: MenuModelRegistry): Promise<void> {
        
    }
}



@injectable()
export class TheiaExampleCommandContribution implements CommandContribution {

    @inject(QuickInputService)
    protected readonly quickInputService: QuickInputService;
    @inject(MessageService) 
    protected readonly  messageService: MessageService;
    @inject(CommandRegistry) 
    protected readonly  commands: CommandRegistry;
    @inject(EditorManager)
    protected readonly editorManager: EditorManager;

    constructor(){}


   async registerCommands(commands: CommandRegistry): Promise<void> {
        
        // commands.unregisterCommand(GIT_COMMANDS.PULL);
        // commands.unregisterCommand(GIT_COMMANDS.PULL_DEFAULT);
        commands.unregisterCommand(GIT_COMMANDS.PULL_DEFAULT_FAVORITE);
        // commands.unregisterCommand(GIT_COMMANDS.PUSH);
        // commands.unregisterCommand(GIT_COMMANDS.PUSH_DEFAULT);
        commands.unregisterCommand(GIT_COMMANDS.PUSH_DEFAULT_FAVORITE);
        commands.unregisterCommand(GIT_COMMANDS.CLONE);
        commands.unregisterCommand(GIT_COMMANDS.FETCH);

        GIT_MENUS.SUBMENU_PULL_PUSH.label = "Extended Actions";
        GIT_COMMANDS.FETCH.label = "Clone...";
        
        GIT_COMMANDS.PULL_DEFAULT_FAVORITE.label = "New branch";
        GIT_COMMANDS.PUSH_DEFAULT_FAVORITE.label = "Checkout branch";

        commands.registerCommand(GIT_COMMANDS.FETCH, {
            execute: () => { 
                this.myGitClone(); 
            } 
        } as CommandHandler);
        // commands.registerCommand(GIT_COMMANDS.PUSH, {
        //     execute:  () => { this.myGitPush(); } 
        // } as CommandHandler);
        commands.registerCommand(GIT_COMMANDS.PULL_DEFAULT_FAVORITE, {
            execute:  () => { this.myGitBranch(); } 
        } as CommandHandler);
        // commands.registerCommand(GIT_COMMANDS.PUSH_DEFAULT_FAVORITE, {
        //     execute:  () => { this.myGitCheckout(); } 
        // } as CommandHandler);
        // commands.registerCommand(GIT_COMMANDS.PULL, {
        //     execute: () => { this.myGitPull(); } 
        // } as CommandHandler);
        // commands.registerCommand(StartCollab, {
        //     execute: () => { 
        //         this.messageService.info("Start!");
        //         commands.executeCommand('setContext', 'itoi-collab.showStop', true);
        //         this.sharedStringClientImpl.startCollab() }
        // });
        // commands.registerCommand(StopCollab, {
        //     execute: () => {
        //         this.messageService.info("Stop!");
        //         commands.executeCommand('setContext', 'itoi-collab.showStop', false);
        //         this.stopCollab(); }
        // });
        // commands.registerCommand(JoinCollab, {
        //     execute: () => { 
        //         this.messageService.info("Join!");
        //         commands.executeCommand('setContext', 'itoi-collab.showStop', true);
        //         this.sharedStringClientImpl.joinCollab(); 
        //     }
        // });

        

    }
    myGitCheckout() {
        let inputBox1 = this.quickInputService.createInputBox();
        inputBox1.description = "Please insert the branch name to checkout:"
        inputBox1.placeholder = "Checkout branch"
        inputBox1.value = '';
        inputBox1.ignoreFocusOut = true;
        inputBox1.onDidAccept(() => {
            axios.get("/gitCheckout", {params:{ data: inputBox1.value }})
            .then((e) =>{
                this.messageService.info("Checkout output: " + e.data.output);
            });
            inputBox1.hide();
        });
        inputBox1.show();

   
    }
    myGitBranch() {
        let inputBox1 = this.quickInputService.createInputBox();
        inputBox1.description = "Please insert the new branch name:"
        inputBox1.placeholder = "New Branch"
        inputBox1.value = '';
        inputBox1.ignoreFocusOut = true;
        inputBox1.onDidAccept(() => {
            axios.get("/gitBranch", {params:{data:inputBox1.value }})
            .then((e) =>{
                this.messageService.info("Branch output: " + e.data.output);
            });
            inputBox1.hide();
        });
        inputBox1.show();
    }

    myGitPull(){
        axios.get("/gitPull", {params:{ }})
        .then((e) =>{
            this.messageService.info("Pull output: " + e.data.output);
        });
        // let repo = localStorage.getItem("gituser.repo");
        // let accessCode = localStorage.getItem("gituser.accesscode");
        // let inputBox1 = this.quickInputService.createInputBox();
        // inputBox1.description = "Please input the repository url"
        // inputBox1.placeholder = "https://github.com/username/repo.git"
        // inputBox1.value = repo ?? '';
        // inputBox1.onDidAccept(() => {
        //     localStorage.setItem("gituser.repo",inputBox1.value ?? '');
        //     let inputBox2 = this.quickInputService.createInputBox();
        //     inputBox2.description = "Please input your access code"
        //     inputBox2.placeholder = "******"
        //     inputBox2.password = true
        //     inputBox2.value = accessCode ?? '';
        //     inputBox2.onDidAccept(() => {
        //         localStorage.setItem("gituser.accesscode",inputBox2.value ?? '');
        //         let repoUrl = insertAccessCodeIntoRepo(inputBox1.value?? '', inputBox2.value?? '');
        //         axios.get("/gitPull", {params:{ repoUrl:repoUrl}});
        //         inputBox2.hide();
        //     });
        //     inputBox1.hide();
        //     inputBox2.show();
        // });
        // inputBox1.show();
    }
    myGitPush(){
        axios.get("/gitPush", {params:{ }})
        .then((e) =>{
            this.messageService.info("Push output: " + e.data.output);
        }).catch(e=>{
            this.messageService.error("Was not able to push!");
        });
        // let repo = localStorage.getItem("gituser.repo");
        // let accessCode = localStorage.getItem("gituser.accesscode");
        // let inputBox1 = this.quickInputService.createInputBox();
        // inputBox1.description = "Please input the repository url"
        // inputBox1.placeholder = "https://github.com/username/repo.git"
        // inputBox1.value = repo ?? '';
        // inputBox1.onDidAccept(() => {
        //     localStorage.setItem("gituser.repo",inputBox1.value ?? '');
        //     let inputBox2 = this.quickInputService.createInputBox();
        //     inputBox2.description = "Please input your access code"
        //     inputBox2.placeholder = "******"
        //     inputBox2.password = true
        //     inputBox2.value = accessCode ?? '';
        //     inputBox2.onDidAccept(() => {
        //         localStorage.setItem("gituser.accesscode",inputBox2.value ?? '');
        //         let repoUrl = insertAccessCodeIntoRepo(inputBox1.value?? '', inputBox2.value?? '');
                //axios.get("/gitPush", {params:{ repoUrl:repoUrl}});
        //         inputBox2.hide();
        //     });
        //     inputBox1.hide();
        //     inputBox2.show();
        // });
        // inputBox1.show();
    }
    async myGitClone(){
        //Let the user fillout a form (email, username, access token, repo)
        let inputBox1 = this.quickInputService.createInputBox();
        inputBox1.description = "Please input your username"
        inputBox1.placeholder = "john"
        inputBox1.value = localStorage.getItem("gituser.username") ?? '';
        inputBox1.ignoreFocusOut = true;
        inputBox1.onDidAccept(() => {
            gitUser.username = inputBox1.value?.toString() ?? '';
            let inputBox2 = this.quickInputService.createInputBox();
            inputBox2.description = "Please input your access code"
            inputBox2.placeholder = "******"
            inputBox2.password = true
            inputBox2.value = localStorage.getItem("gituser.accesscode") ?? '';
            inputBox2.ignoreFocusOut = true;
            inputBox2.onDidAccept(() => {
                gitUser.accessCode = inputBox2.value?.toString() ?? '';
                let inputBox3 = this.quickInputService.createInputBox();
                inputBox3.description = "Repository url";
                inputBox3.value = localStorage.getItem("gituser.repo") ?? '';
                inputBox3.placeholder = "https://github.com/username/repo.git";
                inputBox3.password = false;
                inputBox3.ignoreFocusOut = true;
                inputBox3.onDidAccept(() => {
                    gitUser.repository = inputBox3.value?.toString() ?? '';
                    this.callCloneBatch();
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

    callCloneBatch() {
        localStorage.setItem("gituser.username", gitUser.username);
        localStorage.setItem("gituser.accesscode", gitUser.accessCode);
        localStorage.setItem("gituser.repo", gitUser.repository);
        //let commandString = `${gitUser.email} ${gitUser.username} ${gitUser.accessCode} ${gitUser.repository}`
        let repoUrl = insertAccessCodeIntoRepo(gitUser.repository, gitUser.accessCode);
        gitUser.repository = repoUrl;
        let encoded = Buffer.from(JSON.stringify(gitUser)).toString("base64");
        axios.get("/cloneRepo", {params:{
            data:encoded
        }}).then(()=>{
            this.messageService.info("Clonned Successfully!");
        });
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







function insertAccessCodeIntoRepo(repo: string, accessCode: string ) {
    return [repo.slice(0,8), accessCode, "@", repo.slice(8)].join('');
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


