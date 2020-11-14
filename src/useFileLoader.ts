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

type FOLDER_CONTENT = string[];

const folderContents = {
    [ROOT]: [DIR1],
    [DIR1]: [DIR2, DIR4],
    [DIR2]: [DIR3, DIR7],
    [DIR3]: [DIR8, DIR9, DIR10],
    [DIR4]: [DIR6, DIR5],
} as { [key: string]: FOLDER_CONTENT };

interface FOLDER_WITH_METADATA {
    path: string[],
    content: FOLDER_CONTENT,
}

export const useFileLoader = () => {
    const [currentFolder, setCurrentFolder] = useState<FOLDER_WITH_METADATA>({path: [ROOT], content: folderContents[ROOT]});
    const [longestNavigationStack, setLongestNavigationStack] = useState<FOLDER_WITH_METADATA[]>([currentFolder]); //TODO: this data duplication is proably redundant

    const navigateToFolder = (folder: string) => {
        // const newPath = [...currentFolder.path, folder];
        const newCurrentFolder = { path: [...currentFolder.path, folder], content: folderContents[folder] };
        setCurrentFolder(newCurrentFolder);
        setLongestNavigationStack([...longestNavigationStack, newCurrentFolder]);
    }

    const navigateBackFromCurrentFolder = () => {
        setCurrentFolder(curr => {
            const newPath = [...curr.path].reverse().slice(1).reverse();
            const newCurrentFolder = newPath[newPath.length - 1];
            const newContent = folderContents[newCurrentFolder];
            return {content: newContent, path: newPath};
        });
    }

    return {currentFolder, navigateBackFromCurrentFolder, longestNavigationStack, navigateToFolder}
}

