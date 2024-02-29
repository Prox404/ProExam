import { useEffect } from 'react';

function AntiCopy({children, handleCopyDetection}) { 

    useEffect(() => {
        const handleCopy = (e) => {
          e.preventDefault();
          e.stopPropagation();
          handleCopyDetection();
        };
    
        // Bắt sự kiện copy khi component được mount
        document.body.addEventListener('copy', handleCopy);

        window.addEventListener('keydown', (event) => {
          if ((event.ctrlKey || event.metaKey) && (event.key === 'c' || event.key === 'C')) {
            // Xử lý sự kiện khi nhấn Ctrl + C
            handleCopy(event);
          } else if ((event.ctrlKey || event.metaKey) && (event.key === 'v' || event.key === 'V')) {
            // Xử lý sự kiện khi nhấn Ctrl + V
            handleCopy(event);
          }
        });
    
        // Cleanup handler khi component unmount
        return () => {
          document.body.removeEventListener('copy', handleCopy);
          window.removeEventListener('keydown', handleCopy);
        };
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