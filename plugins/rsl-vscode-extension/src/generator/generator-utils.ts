import path from 'path';
import * as vscode from 'vscode';

/**
 * Retrieves the file name from a path.
 *
 * @param filePath The file path.
 * @returns The file name.
 */
export function getFileName(filePath: string): string {
    return path.basename(filePath);
}

/**
 * Retrieves the file name without the extension from a path.
 *
 * @param filePath The file path.
 * @returns The file name.
 */
export function getFileNameWithoutExtension(filePath: string): string {
    return path.basename(filePath, path.extname(filePath)).replace(/[.-]/g, '');
}

/**
 * Writes the provided content to the specified URI.
 *
 * @param uri     The URI of the file to write.
 * @param content The content to write.
 */
export async function writeFile(uri: vscode.Uri, content: string | Buffer) {
    let writeData: Buffer;
    if (typeof content === 'string') {
        writeData = Buffer.from(content, 'utf8');
    } else {
        writeData = content;
    }
    await vscode.workspace.fs.writeFile(uri, writeData);
}
