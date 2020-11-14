import './App.scss';
import * as React from 'react';
import { useState } from 'react';
import classnames from 'classnames';
import { FOLDER_WITH_METADATA, useFileLoader } from './useFileLoader';

type NAV_DIRECTION = 'NONE' | 'FORWARD' | 'BACKWARD';

const EMPTY_PLACEHOLDER: FOLDER_WITH_METADATA = { path: [], folderFileListing: { state: 'loaded', value: [] } };

const DIRECTION_TO_CLASS = {
  'NONE': undefined,
  'FORWARD': 'forward',
  'BACKWARD': 'backward'
};
//TODO: use a "loading" for each directory


const FolderView = ({ onFileClicked, folder }: { onFileClicked: (string: string) => void, folder: FOLDER_WITH_METADATA }) => {
  if(folder.folderFileListing.state === 'failed') {
    return <div> FAILED </div>
  }
  if(folder.folderFileListing.state === 'loading') {
    return <div> LOADING </div>
  }

  return (
    <div className="folder-view">
      {
        folder.folderFileListing.value.map((dir, index) => (
          <button className="folder-item" key={index} onClick={() => onFileClicked(dir)}>{dir}</button>
        ))
      }
    </div>
  )
}


const Navigator = () => {
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
      <div>PATH: {currentFolder.path.join(' -> ')}</div>
      <div className={classnames("folders-container", DIRECTION_TO_CLASS[direction])}>
        {navigationStackWithPlaceholder.map((folder, index) => (
          <div className={folderClassAtIndex(index)}>
            <FolderView key={index} folder={folder} onFileClicked={onFolderClicked} />
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
