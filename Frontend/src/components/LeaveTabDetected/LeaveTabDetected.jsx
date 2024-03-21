function LeaveTabDetected({onLeaveTabDetected}) {  

    document.addEventListener("visibilitychange", function () {
        if (document.visibilityState === 'hidden') {
            console.log('Người dùng đang rời tab');
        } else {
            onLeaveTabDetected();
            console.log('Người dùng quay lại tab');
        }
    });

    return <>
    </>
}

export default LeaveTabDetected;