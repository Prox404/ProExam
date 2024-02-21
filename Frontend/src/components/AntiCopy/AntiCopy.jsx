import { useEffect } from 'react';

function AntiCopy({children}) { 

    useEffect(() => {
        const handleCopy = (e) => {
          e.preventDefault();
          e.stopPropagation();
        };
    
        // Bắt sự kiện copy khi component được mount
        document.body.addEventListener('copy', handleCopy);
    
        // Cleanup handler khi component unmount
        return () => {
          document.body.removeEventListener('copy', handleCopy);
        };
      }, []);

    return (
        <div style={{
            userSelect: 'none',
        }}>
            {children}
        </div>
    )
 }

export default AntiCopy;