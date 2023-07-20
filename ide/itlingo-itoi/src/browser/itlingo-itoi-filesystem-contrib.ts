import { injectable, inject } from '@theia/core/shared/inversify';
import { FileSelection } from '@theia/filesystem/lib/browser/file-selection';
import { FileSystemFrontendContribution, FileSystemCommands } from '@theia/filesystem/lib/browser/filesystem-frontend-contribution'
import { FileUploadResult } from '@theia/filesystem/lib/browser/file-upload-service';
import { environment } from '@theia/core/shared/@theia/application-package/lib/environment';
import { WorkspaceService } from '@theia/workspace/lib/browser/workspace-service';
import { CommandRegistry } from '@theia/core';

@injectable()
export class ItoiFileSystemFrontendContribution extends FileSystemFrontendContribution {

    @inject(WorkspaceService)
    protected readonly workspaceService: WorkspaceService;

    registerCommands(commands: CommandRegistry): void {
        commands.registerCommand(FileSystemCommands.UPLOAD, {
            isEnabled: (...args: unknown[]) => {
                return true;
            },
            isVisible: () => !environment.electron.is(),
            execute: (...args: unknown[]) => {
                const selection = this.getSelection(...args);
                return this.upload(selection);
            }
        });
    }


    protected override async upload(selection: FileSelection | undefined): Promise<FileUploadResult | undefined> {
        
        if(selection && selection.fileStat.isDirectory){
            return super.upload(selection);
        } else {
            console.log("fileupload");
            console.log(this.workspaceService.workspace?.resource);
            let root = this.workspaceService.workspace?.resource;
            if(root) {
                const fileUploadResult = await this.uploadService.upload(this.workspaceService.tryGetRoots()[0].resource.resolveToAbsolute()?? '');
                return fileUploadResult;
            }
           
        }
        
    }

}