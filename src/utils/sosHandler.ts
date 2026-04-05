import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const triggerSOSActions = async (coords: [number, number] | null) => {
  try {
    // 1. Notify Backend API (Fixes 404)
    if (coords) {
      fetch('/api/sos/alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lat: coords[0], lng: coords[1] })
      }).catch(e => console.error("API Alert Failed", e));
    }

    // 2. Multimedia Capture (SOS Vault)
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    const chunks: Blob[] = [];

    mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
    
    mediaRecorder.onstop = async () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      const fileName = `vault/${Date.now()}_emergency_clip.webm`;
      
      // Upload to Supabase - Ensure RLS is OFF for 'sos-vault' bucket testing
      const { error } = await supabase.storage
        .from('sos-vault')
        .upload(fileName, blob);

      if (error) console.error("Supabase Storage Error:", error.message);
      
      stream.getTracks().forEach(track => track.stop());
    };

    mediaRecorder.start();
    setTimeout(() => mediaRecorder.stop(), 8000); // 8-second evidence clip

    return true;
  } catch (err) {
    console.error("SOS System Hardware Error:", err);
    return false;
  }
};