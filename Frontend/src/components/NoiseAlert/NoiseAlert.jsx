import React, { useState, useEffect, useRef } from 'react';
import { useDebounce } from 'use-debounce';

const NoiseAlert = ({ handleNoiseDetection }) => {
  const [volume, setVolume] = useState(0);
  const offsetRef = useRef(0);
  const offsetValueRef = useRef(null);
  const intervalRef = useRef(null);

  // Debounce handleNoiseDetection function with 500ms delay
  const [debouncedHandleNoiseDetection] = useDebounce(handleNoiseDetection, 3000);

  useEffect(() => {
    let mediaStream;
    const fetchData = async () => {
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        const context = new AudioContext();
        const source = context.createMediaStreamSource(mediaStream);
        const processor = context.createScriptProcessor(2048, 1, 1);
        const analyser = context.createAnalyser();

        analyser.smoothingTimeConstant = 0.8;
        analyser.fftSize = 256;

        source.connect(analyser);
        analyser.connect(processor);
        processor.connect(context.destination);

        processor.onaudioprocess = () => {
          let data = new Uint8Array(analyser.frequencyBinCount);
          analyser.getByteFrequencyData(data);
          let rms = 0;

          for (let i = 0; i < data.length; i++) {
            if (data[i] > 120) data[i] = 120;
            rms += data[i] * data[i];
          }
          rms = Math.sqrt(rms / data.length);

          offsetRef.current = parseInt(offsetValueRef.current?.value || 0);
          if (offsetValueRef.current) {
            offsetValueRef.current.innerText = offsetRef.current;
          }
          const value = rms + offsetRef.current;
          setVolume(Math.round(value));
        };
      } catch (error) {
        console.error('Error accessing microphone:', error);
      }
    };

    fetchData();

    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
      }
      clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => {
    if (volume > 50) {
      // Call the debounced function
      debouncedHandleNoiseDetection();
    }

    return () => {
      clearInterval(intervalRef.current);
    };
  }, [volume, debouncedHandleNoiseDetection]);


  return (
    <div>
      {/* <div className="main-inputs">
        <main>
          <h2><span>{volume}</span> dB</h2>
          <div id='visuals'></div>
        </main>
      </div> */}
    </div>
  );
};

export default NoiseAlert;
