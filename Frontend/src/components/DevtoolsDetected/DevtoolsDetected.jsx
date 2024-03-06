import { useEffect } from "react";
import devTools from "devtools-detect";

function DevtoolsDetected({handleDevtoolsDetected}) {
  const isDevToolsOpen = () => {
    return devTools.isOpen;
  };

  useEffect(() => {
    setInterval(() => {
      if (isDevToolsOpen()) {
        debugger
        handleDevtoolsDetected();
      }
      console.log(isDevToolsOpen());
    }, 5000);

    return () => {
      clearInterval();
    };
  }, []);

  return (
    <></>
  );

}

export default DevtoolsDetected;