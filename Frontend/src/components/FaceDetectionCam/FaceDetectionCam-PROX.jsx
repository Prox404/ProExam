import { useEffect, useState, useRef } from 'react';
// import * as faceLandmarksDetection from "@tensorflow-models/face-landmarks-detection";
import * as blazeface from "@tensorflow-models/blazeface";
import Webcam from 'react-webcam';
import * as tf from '@tensorflow/tfjs-core';
import '@tensorflow/tfjs';
import { Box } from '@mui/material';



function FaceDetectionCam() {
    const [hide, setHide] = useState(false);

    const camRef = useRef(null);
    const cxtRef = useRef(null);

    const draw = (ctx, predictions) => {
        if (predictions.length > 0) {

            for (let i = 0; i < predictions.length; i++) {
                const start = predictions[i].topLeft;
                const end = predictions[i].bottomRight;
                const size = [end[0] - start[0], end[1] - start[1]];

                // Render a rectangle over each detected face.

                ctx.beginPath();
                ctx.lineWidth = "6";
                ctx.strokeStyle = "red";
                ctx.rect(start[0], start[1], size[0], size[1]);
                ctx.stroke();
            }
        }

    };
    useEffect(() => {
        const timerIntervalId = setInterval(() => {
            (async () => {
                const net = await blazeface.load();
                const returnTensors = !true;

                if (
                    camRef.current !== null &&
                    camRef.current.video.readyState === 4 &&
                    typeof camRef.current !== undefined
                ) {
                    const { video } = camRef.current;
                    const { videoWidth, videoHeight } = video;
                    cxtRef.current.width = videoWidth;
                    cxtRef.current.height = videoHeight;

                    const detections = await net.estimateFaces(video, returnTensors);

                    const cxt = cxtRef.current.getContext("2d");

                    draw(cxt, detections);
                    console.log((detections.length > 1 || detections.length == 0) && "Cheating Detected");
                }
            })();
        }, 1000);

        return () => {
            clearInterval(timerIntervalId);
        };
    }, []);


    return (
        <>
            <Box>
                <Box sx={{
                    opacity: hide ? 0 : 1,
                }}>
                    <Webcam
                        ref={camRef}
                        style={{
                            position: "absolute",
                            // marginLeft: "auto",
                            // marginRight: "auto",
                            top: 0,
                            right: 0,
                            textAlign: "center",
                            zIndex: -1,
                            width: '300px',
                            objectFit: "cover",
                        }}
                    />
    
                    <canvas
                        ref={cxtRef}
                        style={{
                            position: "absolute",
                            // marginLeft: "auto",
                            // marginRight: "auto",
                            top: 0,
                            right: 0,
                            textAlign: "center",
                            zIndex: -1,
                            width: '300px',
                            objectFit: "cover",
                        }}
                    />
                    <button style={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        zIndex: 9,
                    }} onClick={() => setHide(true)}>Hide</button>
                </Box>  
                <Box>
                    <button style={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        zIndex: 9,
                        display: hide ? "block" : "none",
                    }} onClick={() => setHide(false)}>Show</button>
                </Box>
                
            </Box>
        </>
    )
}

export default FaceDetectionCam;