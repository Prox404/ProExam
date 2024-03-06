import { useEffect } from 'react';

function ShortCutDetected({ handlesCreenshotDetected, handleCopyDetection }) {

    useEffect(() => {

        const handleCopy = (e) => {
            e.preventDefault();
            e.stopPropagation();
            handleCopyDetection();
        };

        document.body.addEventListener('copy', handleCopy);

        const handleKeyDown = (event) => {
            if (event.key === "PrintScreen") {
                event.preventDefault();
                event.cancelBubble = true;
                event.stopImmediatePropagation();
                event.returnValue = "";
                handlesCreenshotDetected();
                console.log("Screenshot detected");
                return;
            }
            if (event.which === 44) {
                event.preventDefault();
                event.cancelBubble = true;
                event.stopImmediatePropagation();
                event.returnValue = "";
                handlesCreenshotDetected();
                console.log("Screenshot detected");
                return;
            }
            if ((event.metaKey && event.shiftKey)) {
                event.preventDefault();
                event.cancelBubble = true;
                event.stopImmediatePropagation();
                event.returnValue = "";
                handlesCreenshotDetected();
                console.log("Screenshot detected");
                return;
            }
            if ((event.ctrlKey && event.shiftKey && event.key === "I")
                || (event.ctrlKey && event.shiftKey && event.key === "C")) {
                event.preventDefault();
                event.cancelBubble = true;
                event.stopImmediatePropagation();
                event.returnValue = "";
                handlesCreenshotDetected();
                console.log("Screenshot detected");
                return;
            }
            if (event.ctrlKey && event.key == 'p') {
                event.preventDefault();
                event.cancelBubble = true;
                event.stopImmediatePropagation();
                event.returnValue = "";
                handlesCreenshotDetected();
                console.log("Screenshot detected");
            }
            if ((event.ctrlKey || event.metaKey) && (event.key === 'c' || event.key === 'C')) {
                handleCopy(event);
            } else if ((event.ctrlKey || event.metaKey) && (event.key === 'v' || event.key === 'V')) {
                handleCopy(event);
            }
        };

        // window.addEventListener("beforeunload", handleBeforeUnload);
        window.addEventListener("keydown", handleKeyDown);

        return () => {
            // window.removeEventListener("beforeunload", handleBeforeUnload);
            window.removeEventListener("keydown", handleKeyDown);
        };
    });

    return <>
    </>
}

export default ShortCutDetected;