// components/SOSButton.tsx
"use client";
import { useState, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export function SOSButton() {
  const [recording, setRecording] = useState(false);
  const mediaRecorder = useRef<MediaRecorder | null>(null);

  const stopSOS = () => {
    if (mediaRecorder.current && mediaRecorder.current.state !== "inactive") {
      mediaRecorder.current.stop();
      setRecording(false);
    }
  };

  const startSOS = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    mediaRecorder.current = new MediaRecorder(stream);
    const chunks: Blob[] = [];

    mediaRecorder.current.ondataavailable = (e) => chunks.push(e.data);
    mediaRecorder.current.onstop = async () => {
      const blob = new Blob(chunks, { type: "video/mp4" });
      // Upload to Supabase Storage
      const fileName = `sos_${Date.now()}.mp4`;
      await supabase.storage
        .from("sos-vault")
        .upload(fileName, blob, { contentType: "video/mp4" });
    };

    mediaRecorder.current.start();
    setRecording(true);
    setTimeout(() => stopSOS(), 300000); // 5 min auto-stop
  };

  return (
    <button
      onClick={recording ? stopSOS : startSOS}
      className={`rounded-full w-32 h-32 font-bold ${recording ? "bg-red-600 animate-pulse" : "bg-red-500 hover:bg-red-700"} text-white`}
    >
      {recording ? "RECORDING..." : "SOS"}
    </button>
  );
}
