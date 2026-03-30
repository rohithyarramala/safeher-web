import { PhoneCall, MessageCircle } from 'lucide-react';

interface ContactRowProps {
  name: string;
  phone: string;
  relation?: string;
}

export default function ContactRow({ name, phone, relation }: ContactRowProps) {
  return (
    <div className="safeher-card flex items-center justify-between p-4 gap-3">
      <div>
        <div className="font-bold text-base text-[#5d3e81]">{name}</div>
        <div className="text-sm text-[#8b6b9f]">{phone}</div>
        {relation ? <div className="text-xs font-semibold text-[#b05d91] mt-1">{relation}</div> : null}
      </div>
      <div className="flex gap-2">
        <a href={`tel:${phone}`} className="rounded-lg bg-[#6e59b5] hover:bg-[#604ba8] text-white px-3 py-2 text-sm font-semibold flex items-center gap-1">
          <PhoneCall size={16} /> Call
        </a>
        <a href={`sms:${phone}`} className="rounded-lg bg-[#b64f8f] hover:bg-[#a34581] text-white px-3 py-2 text-sm font-semibold flex items-center gap-1">
          <MessageCircle size={16} /> Msg
        </a>
      </div>
    </div>
  );
}
