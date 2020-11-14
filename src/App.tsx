import './App.scss';
import * as React from 'react';
import { useState } from 'react';
import classnames from 'classnames';

type NAV_DIRECTION = 'NONE' | 'FORWARD' | 'BACKWARD';

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

const EMPTY_PLACEHOLDER = '___empty_placeholder___';

const Navigator = () => {
  //TODO: organize the directories in a linked-list or something similar
  const folderContents = {
    [EMPTY_PLACEHOLDER]: [],
    [ROOT]: [DIR1],
    [DIR1]: [DIR2, DIR4],
    [DIR2]: [DIR3, DIR7],
    [DIR3]: [DIR8, DIR9, DIR10],
    [DIR4]: [DIR6, DIR5],
  } as { [key: string]: string[] };

  const [currFolderPath, setCurrFolderPath] = useState([ROOT]);
  const [direction, setDirection] = useState<NAV_DIRECTION>('NONE');
  const [longestNavigatablePath, setLongestNavigatablePath] = useState(currFolderPath);

  const onFileClicked = (dir: string) => {
    const newPath = [...currFolderPath, dir];
    setCurrFolderPath(newPath);
    setLongestNavigatablePath([...newPath, EMPTY_PLACEHOLDER]);
    setDirection('FORWARD');
  }

  const onBackClicked = () => {
    setCurrFolderPath(curr => ([...curr].reverse().slice(1).reverse()));
    setDirection('BACKWARD');
  }

  const folderClass = (index: number) => {
    const displayedIndex = currFolderPath.length - 1;
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
        {longestNavigatablePath.map((folderKey, index) => (
          <div className={folderClass(index)}>
            <FolderView key={index} folder={folderContents[folderKey]} onFileClicked={onFileClicked} />
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
