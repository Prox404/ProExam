import { useEffect } from 'react';

function AntiCopy({ children, handleCopyDetection }) {

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