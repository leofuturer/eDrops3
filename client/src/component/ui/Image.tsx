import {useState} from 'react';

export function Image({...props}) {
  const [isLoading, setIsLoading] = useState(true);

  function handleLoad() {
    setIsLoading(false);
  }

  return (
    <>
      {isLoading && (
        <div className="border-md shadow-box flex flex-col items-center space-y-2 w-full animate-pulse">
          <div className="w-full aspect-square"></div>
        </div>
      )}
      <img {...props} onLoad={handleLoad} />
    </>
  );
}

export default Image;
