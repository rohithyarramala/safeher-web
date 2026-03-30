"use client";
import { useRef, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function SafeHerRecorder({ userId }: { userId: string }) {
  const [recording, setRecording] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Get GPS coordinates
  const getLocation = (): Promise<{ lat: number; lng: number } | null> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) return resolve(null);
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => resolve(null),
        { enableHighAccuracy: true, timeout: 10000 }
      );
    });
  };

  const startRecording = async () => {
    setError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        await uploadRecording(blob);
      };
      mediaRecorder.start();
      setRecording(true);
      // Stop after 5 minutes
      timerRef.current = setTimeout(() => {
        mediaRecorder.stop();
        setRecording(false);
      }, 5 * 60 * 1000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError('Could not access camera/mic: ' + message);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
      if (timerRef.current) clearTimeout(timerRef.current);
    }
  };

  const uploadRecording = async (blob: Blob) => {
    setUploading(true);
    setError('');
    try {
      const fileName = `sos_${userId}_${Date.now()}.webm`;
      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage.from('sos-vault').upload(fileName, blob, {
        cacheControl: '3600',
        upsert: false,
        contentType: 'video/webm',
      });
      if (uploadError) throw uploadError;
      // Get public URL
      const { data: urlData } = supabase.storage.from('sos-vault').getPublicUrl(fileName);
      // Get GPS
      const coords = await getLocation();
      // Insert record in sos_records
      await supabase.from('sos_records').insert({
        user_id: userId,
        video_url: urlData?.publicUrl,
        lat: coords?.lat,
        lng: coords?.lng,
        created_at: new Date().toISOString(),
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError('Upload failed: ' + message);
    }
    setUploading(false);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <button
        className="w-40 h-40 rounded-full bg-red-600 hover:bg-red-700 text-white text-3xl font-bold flex items-center justify-center shadow-lg border-4 border-red-900"
        onClick={recording ? stopRecording : startRecording}
        disabled={uploading}
      >
        {recording ? 'Stop' : 'SOS'}
      </button>
      {uploading && <div className="text-pink-400">Uploading...</div>}
      {error && <div className="text-red-400">{error}</div>}
    </div>
  );
}
