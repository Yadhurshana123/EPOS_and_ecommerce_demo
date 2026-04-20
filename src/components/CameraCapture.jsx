import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Camera, X, RefreshCw, Zap, ZapOff,
  Image as ImageIcon, Sparkles, ChevronLeft
} from 'lucide-react';

const CameraCapture = ({ onCapture, onClose }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [isFrontCamera, setIsFrontCamera] = useState(false);
  const [flashOn, setFlashOn] = useState(false);
  const [aiHint, setAiHint] = useState("Align product in frame");
  const [isCapturing, setIsCapturing] = useState(false);

  const startCamera = useCallback(async () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }

    try {
      const constraints = {
        video: {
          facingMode: isFrontCamera ? "user" : "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      };

      const newStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(newStream);

      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
        // Explicitly call play for mobile browsers
        try {
          await videoRef.current.play();
        } catch (playErr) {
          console.log("Auto-play prevented, waiting for user interaction", playErr);
        }
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      if (err.name === 'OverconstrainedError') {
        const fallbackStream = await navigator.mediaDevices.getUserMedia({ video: true });
        setStream(fallbackStream);
        if (videoRef.current) videoRef.current.srcObject = fallbackStream;
      } else {
        setAiHint("Camera error - check permissions");
      }
    }
  }, [isFrontCamera]);

  useEffect(() => {
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isFrontCamera]);

  // Simulate dynamic AI hints
  useEffect(() => {
    const hints = [
      "Good lighting needed",
      "Move closer",
      "Hold steady",
      "Perfect! Keep it there",
      "Scanning product..."
    ];

    const interval = setInterval(() => {
      if (!isCapturing) {
        setAiHint(hints[Math.floor(Math.random() * hints.length)]);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isCapturing]);

  const capturePhoto = () => {
    const video = videoRef.current;
    if (!video || video.readyState < 2) {
      setAiHint("Camera not ready...");
      return;
    }

    if (navigator.vibrate) navigator.vibrate(50);

    setIsCapturing(true);

    // Slight delay for the shutter animation to feel right
    setTimeout(() => {
      try {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Use actual video dimensions
        const width = video.videoWidth;
        const height = video.videoHeight;

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, width, height);

        // Mirror if front camera
        if (isFrontCamera) {
          ctx.translate(width, 0);
          ctx.scale(-1, 1);
        }

        ctx.drawImage(video, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);

        if (onCapture) {
          onCapture(dataUrl);
        }
      } catch (err) {
        console.error("Capture failed:", err);
        setAiHint("Capture failed. Try again.");
      } finally {
        setIsCapturing(false);
      }
    }, 200);
  };

  const handleGalleryClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => onCapture(event.target.result);
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black overflow-hidden select-none">
      {/* Live Camera Preview */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={`absolute inset-0 w-full h-full object-cover transition-transform duration-500 ${isFrontCamera ? 'scale-x-[-1]' : ''}`}
      />

      {/* Canvas for capturing (hidden) */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Shutter Effect Overlay */}
      <AnimatePresence>
        {isCapturing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-white z-[110]"
          />
        )}
      </AnimatePresence>

      {/* Layout Layer (Pointer events handled per component) */}
      <div className="absolute inset-0 flex flex-col pointer-events-none">

        {/* Top Section: AI Hint Bar */}
        <div className="p-6 flex flex-col items-center pointer-events-none">
          <div className="flex items-center justify-between w-full mb-4">
            <div className="w-10" />

            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="glass px-4 py-2 rounded-full flex items-center gap-2 border border-white/20 shadow-lg pointer-events-auto"
            >
              <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
              <span className="text-white text-[11px] font-bold tracking-wide uppercase">
                {aiHint}
              </span>
            </motion.div>

            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white pointer-events-auto active:scale-90 transition-transform"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Center Overlay: Guide Box */}
        <div className="flex-1 flex items-center justify-center relative pointer-events-none">
          <div className="relative w-64 h-64 md:w-80 md:h-80">
            <div className="absolute top-0 left-0 w-10 min-h-[40px] border-t-4 border-l-4 border-indigo-500 rounded-tl-2xl shadow-[0_0_15px_rgba(99,102,241,0.5)]" />
            <div className="absolute top-0 right-0 w-10 min-h-[40px] border-t-4 border-r-4 border-indigo-500 rounded-tr-2xl shadow-[0_0_15px_rgba(99,102,241,0.5)]" />
            <div className="absolute bottom-0 left-0 w-10 min-h-[40px] border-b-4 border-l-4 border-indigo-500 rounded-bl-2xl shadow-[0_0_15px_rgba(99,102,241,0.5)]" />
            <div className="absolute bottom-0 right-0 w-10 min-h-[40px] border-b-4 border-r-4 border-indigo-500 rounded-br-2xl shadow-[0_0_15px_rgba(99,102,241,0.5)]" />

            <div className="absolute inset-4 border-2 border-dashed border-white/20 rounded-xl flex items-center justify-center">
              <span className="text-white/60 text-[10px] font-bold uppercase tracking-widest text-center px-6">
                Frame Product
              </span>
            </div>

            <motion.div
              animate={{ top: ['10%', '90%', '10%'] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="absolute left-4 right-4 h-0.5 bg-indigo-400/50 shadow-[0_0_10px_rgba(99,102,241,0.8)] z-20"
            />
          </div>
        </div>

        {/* Bottom Controls */}
        <div className="p-8 md:p-12 flex items-center justify-between bg-gradient-to-t from-black/60 to-transparent pointer-events-none">
          {/* Gallery Button */}
          <button
            onClick={handleGalleryClick}
            className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white pointer-events-auto active:scale-90 transition-transform"
          >
            <ImageIcon className="w-5 h-5" />
          </button>

          {/* Capture Button */}
          <div className="relative pointer-events-auto">
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={(e) => {
                e.stopPropagation();
                capturePhoto();
              }}
              className="w-20 h-20 rounded-full bg-white p-1.5 shadow-[0_0_30px_rgba(255,255,255,0.4)] flex items-center justify-center active:bg-slate-100 transition-colors"
            >
              <div className="w-full h-full rounded-full border-2 border-black/5 flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-white border border-slate-200" />
              </div>
            </motion.button>
            <div className="absolute -inset-2 border-2 border-white/20 rounded-full animate-ping opacity-10 pointer-events-none" />
          </div>

          {/* Flip Camera Button */}
          <button
            onClick={() => setIsFrontCamera(!isFrontCamera)}
            className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white pointer-events-auto active:scale-90 transition-transform"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>

        {/* Flash toggle on side */}
        <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-6 pointer-events-none">
          <button
            onClick={() => setFlashOn(!flashOn)}
            className={`w-12 h-12 rounded-full transition-all flex items-center justify-center border pointer-events-auto active:scale-90 ${flashOn ? 'bg-indigo-500 border-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.5)]' : 'bg-black/40 border-white/10 backdrop-blur-md'} text-white`}
          >
            {flashOn ? <Zap className="w-5 h-5 fill-current" /> : <ZapOff className="w-5 h-5" />}
          </button>
        </div>

      </div>
    </div>
  );
};

export default CameraCapture;
