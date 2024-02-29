import { useEffect, useState, useRef } from 'react';
// import * as faceLandmarksDetection from "@tensorflow-models/face-landmarks-detection";
import * as blazeface from "@tensorflow-models/blazeface";
import Webcam from 'react-webcam';
import * as tf from '@tensorflow/tfjs-core';
import '@tensorflow/tfjs';
import { Box, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import 'animate.css';


function FaceDetectionCam({handleMultipleFaces}) {
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

                    if (detections.length > 1 || detections.length == 0) {
                        handleMultipleFaces();
                        console.log("Multiple Faces Detected");
                    }
                }
            })();
        }, 1000);

        return () => {
            clearInterval(timerIntervalId);
        };
    }, []);


    return (
        <>
            <Box sx={{
                position: "absolute",
                bottom: 'calc(50% - 200px)',
                right: 0,
                zIndex: 9,
                width: "300px",
            }}
                className="animate__animated animate__fadeInRight"
            >
                <Box sx={{
                    opacity: hide ? 0 : 1,
                    borderRadius: "10px",
                    overflow: "hidden",
                    height: "160px",
                    transition: "opacity 0.2s",
                }}>
                    <Webcam
                        ref={camRef}
                        style={{
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
                            top: 0,
                            right: 0,
                            textAlign: "center",
                            zIndex: 9,
                            width: '300px',
                            objectFit: "cover",
                        }}
                    />
                    <IconButton style={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        zIndex: 9,
                    }} onClick={() => setHide(true)}>
                        <CloseIcon />
                    </IconButton>
                </Box>
                <Box>
                    <IconButton style={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        zIndex: 9,
                        display: hide ? "block" : "none",
                        height: "80px",
                        borderRadius: "5px 0 0 5px",
                        backgroundColor: "rgba(0,0,0,0.2)",
                        padding: "0 2px",
                        '& svg': {
                            fontSize: "10px",
                        }
                    }} onClick={() => setHide(false)}>
                        <ArrowBackIosNewIcon />
                    </IconButton>
                </Box>

            </Box>
        </>
    )
}

export default FaceDetectionCam;
