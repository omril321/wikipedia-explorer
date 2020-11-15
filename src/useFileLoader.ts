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

export interface FolderWithMetadata {
    path: string[],
    folderFileListing:
        {state: 'loading'} |
        {state: 'failed'} |
        {state: 'loaded', value: string[]},
}

export interface NavigationStack {
    stack: FolderWithMetadata[];
    currentDepthIndex: number;
}

const staticFileContent = { //TODO: load this from wikipedia
    [ROOT]: [DIR1],
    [DIR1]: [DIR2, DIR4],
    [DIR2]: [DIR3, DIR7],
    [DIR3]: [DIR8, DIR9, DIR10],
    [DIR4]: [DIR6, DIR5],
} as { [key: string]: string[] };

function loadedStaticFolderAtPath(fullPath: string[]): FolderWithMetadata {
    const folderKey = fullPath[fullPath.length - 1];
    return { path: fullPath, folderFileListing: { state: 'loaded', value: staticFileContent[folderKey] } };
}

async function getFolderContent(folderKey: string): Promise<string[]> {
    const staticResult = staticFileContent[folderKey];
    if(staticResult !== undefined) {
        return staticResult;
    }
    throw new Error('directory doesn\'t exist');
}

export const useFileLoader = () => {
    const [longestNavigationStack, setLongestNavigationStack] = useState<NavigationStack>({ currentDepthIndex: 0, stack: [loadedStaticFolderAtPath([ROOT])] });

    const navigateToFolder = (folder: string) => {
        const currentFolder = longestNavigationStack.stack[longestNavigationStack.currentDepthIndex];
        const newDepth = longestNavigationStack.currentDepthIndex + 1;
        if(currentFolder.folderFileListing.state !== 'loaded') {
            //TODO: handle
            throw new Error()
        }
        const newCurrentFolder = loadedStaticFolderAtPath([...currentFolder.path, folder]);
        const stack = newCurrentFolder.path.map((_, index) => loadedStaticFolderAtPath(newCurrentFolder.path.slice(0, index + 1)));
        setLongestNavigationStack({stack, currentDepthIndex: newDepth});
    }

    const navigateBackFromCurrentFolder = () => {
        setLongestNavigationStack(currLongStack => {
            return {...currLongStack, currentDepthIndex: currLongStack.currentDepthIndex - 1};
        });
    }

    return { longestNavigationStack, navigateToFolder, navigateBackFromCurrentFolder };
}

