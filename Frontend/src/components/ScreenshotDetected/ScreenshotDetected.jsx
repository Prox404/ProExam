import { useEffect } from "react"

function ScreenshotDetected({handlesCreenshotDetected}) {

    useEffect(() => {
        const handleBeforeUnload = (event) => {
            event.preventDefault();
            event.cancelBubble = true;
            event.stopImmediatePropagation();
            event.returnValue = ""; 
            handlesCreenshotDetected();
        };

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
            if (( event.metaKey && event.shiftKey )) {
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
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    return <>
    </>
}

export default ScreenshotDetected;