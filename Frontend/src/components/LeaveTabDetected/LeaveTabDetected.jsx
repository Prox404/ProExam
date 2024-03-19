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
        <h1>LeaveTabDetected</h1>
    </>
}

export default LeaveTabDetected;