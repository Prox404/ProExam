import { Box } from "@mui/material";
import AntiCopy from "~/components/AntiCopy";
import FaceDetectionCam from "~/components/FaceDetectionCam";
import NoiseAlert from "~/components/NoiseAlert";

function TakeExam() {

    return (
        <Box sx={{
            padding: {
                xs: '10px',
                md: '15px',
            }
        }}>
            <AntiCopy>
            <h1>Take Exam</h1>
            {/* <NoiseAlert /> */}
            <FaceDetectionCam />
            </AntiCopy>
        </Box>
    );
}

export default TakeExam;