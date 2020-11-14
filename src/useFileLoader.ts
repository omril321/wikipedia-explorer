import { useState } from 'react';

const DIR1 = 'dir1';
const DIR2 = 'dir2';
const DIR3 = 'dir3';
const DIR4 = 'dir4';
const DIR5 = 'dir5';
const DIR6 = 'dir6';
const DIR7 = 'dir7';
const DIR8 = 'dir8';
const DIR9 = 'dir9';
const DIR10 = 'dir10';

const ROOT = '___root___';

export interface FOLDER_WITH_METADATA {
    path: string[],
    folderFileListing:
        {state: 'loading'} |
        {state: 'failed'} |
        {state: 'loaded', value: string[]},
}


const staticFileContent = { //TODO: load this from wikipedia
    [ROOT]: [DIR1],
    [DIR1]: [DIR2, DIR4],
    [DIR2]: [DIR3, DIR7],
    [DIR3]: [DIR8, DIR9, DIR10],
    [DIR4]: [DIR6, DIR5],
} as { [key: string]: string[] };

function loadedStaticFolderAtPath(fullPath: string[]): FOLDER_WITH_METADATA {
    const folderKey = fullPath[fullPath.length - 1];
    return { path: fullPath, folderFileListing: { state: 'loaded', value: staticFileContent[folderKey] } };
}

export const useFileLoader = () => {
    const [currentFolder, setCurrentFolder] = useState<FOLDER_WITH_METADATA>(loadedStaticFolderAtPath([ROOT]));
    const [longestNavigationStack, setLongestNavigationStack] = useState<FOLDER_WITH_METADATA[]>([currentFolder]);

    const navigateToFolder = (folder: string) => {
        if(currentFolder.folderFileListing.state !== 'loaded') {
            //TODO: handle
            throw new Error()
        }
        const newCurrentFolder = loadedStaticFolderAtPath([...currentFolder.path, folder]);
        setCurrentFolder(newCurrentFolder);
        const stack = newCurrentFolder.path.map((_, index) => loadedStaticFolderAtPath(newCurrentFolder.path.slice(0, index + 1)));
        setLongestNavigationStack(stack);
    }

    const navigateBackFromCurrentFolder = () => {
        setCurrentFolder(curr => {
            const newPath = [...curr.path].reverse().slice(1).reverse();
            return loadedStaticFolderAtPath(newPath);
        });
    }

    return { currentFolder, longestNavigationStack, navigateToFolder, navigateBackFromCurrentFolder };
}

