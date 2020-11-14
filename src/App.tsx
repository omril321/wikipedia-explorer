import './App.scss';
import * as React from 'react';
import { useState } from 'react';
import classnames from 'classnames';
import { useFileLoader } from './useFileLoader';

type NAV_DIRECTION = 'NONE' | 'FORWARD' | 'BACKWARD';

const EMPTY_PLACEHOLDER = {content: [], path: []};

const DIRECTION_TO_CLASS = {
  'NONE': undefined,
  'FORWARD': 'forward',
  'BACKWARD': 'backward'
};
//TODO: use a "loading" for each directory


const FolderView = ({ onFileClicked, folder }: { onFileClicked: (string: string) => void, folder: string[] }) => {
  return (
    <div className="folder-view">
      {
        folder.map((dir, index) => (
          <button className="folder-item" key={index} onClick={() => onFileClicked(dir)}>{dir}</button>
        ))
      }
    </div>
  )
}


const Navigator = () => {
  //TODO: organize the directories in a linked-list or something similar
  const { currentFolder, navigateBackFromCurrentFolder, longestNavigationStack, navigateToFolder } = useFileLoader();

  const navigationStackWithPlaceholder = [...longestNavigationStack, EMPTY_PLACEHOLDER]; //TODO: can this be better..?
  const [direction, setDirection] = useState<NAV_DIRECTION>('NONE');

  const onFolderClicked = (folder: string) => {
    navigateToFolder(folder)
    setDirection('FORWARD');
  }

  const onBackClicked = () => {
    navigateBackFromCurrentFolder();
    setDirection('BACKWARD');
  }

  const folderClassAtIndex = (index: number) => {
    const displayedIndex = currentFolder.path.length - 1;
    if(index === displayedIndex) {
      return 'current-folder';
    }
    if(index === displayedIndex - 1) {
      return 'previous-folder';
    }
    if(index === displayedIndex + 1) {
      return 'next-folder';
    }
    return 'hidden-folder'
  }

  return (
    <div className="navigator">
      <div>
        <button onClick={onBackClicked}>BACK</button>
      </div>
      <div className={classnames("folders-container", DIRECTION_TO_CLASS[direction])}>
        {navigationStackWithPlaceholder.map((folder, index) => (
          <div className={folderClassAtIndex(index)}>
            <FolderView key={index} folder={folder.content} onFileClicked={onFolderClicked} />
          </div>
        ))}
      </div>
    </div>
  )
}

const App = () => {
  return <Navigator></Navigator>
}


export default App;
