import { useEffect } from 'react';

function AntiCopy({ children, handleCopyDetection }) {
  useEffect(() => {
    const clearClipboardInterval = setInterval(() => {
      // Tạo một phần tử input tạm thời
      navigator.clipboard.writeText("");
      console.log("Run");
    }, 3000);

    // Dừng interval khi component bị unmount
    return () => clearInterval(clearClipboardInterval);
  }, []);
  return (
    <div style={{
      userSelect: 'none',
      height: '100%',

    }}>
      {children}
    </div>
  )
}

export default AntiCopy;