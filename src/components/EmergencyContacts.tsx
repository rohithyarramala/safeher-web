"use client";
import { useEffect, useState } from "react";
import ContactRow from "./ContactRow";

interface Contact {
  name: string;
  phone: string;
  relation?: string;
}

const demoContacts: Contact[] = [
  { name: "Maya Fernandes", phone: "+91 98900 11001", relation: "Sister" },
  { name: "Aditi Rao", phone: "+91 98111 45312", relation: "Friend" },
  { name: "Neha Sharma", phone: "+91 99220 88341", relation: "Colleague" },
];

export default function EmergencyContacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchContacts() {
      setLoading(true);
      const response = await fetch("/api/user/profile", { cache: "no-store" });
      const payload = await response.json();

      if (response.ok && payload?.profile?.emergency_contacts?.length) {
        setContacts(payload.profile.emergency_contacts);
      } else {
        setContacts(demoContacts);
      }
      setLoading(false);
    }

    fetchContacts();
  }, []);

  if (loading) {
    return (
      <div className="text-sm font-semibold text-[#8a689e]">
        Loading contacts...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {contacts.length === 0 ? (
        <div className="text-sm font-semibold text-[#8a689e]">
          No emergency contacts found.
        </div>
      ) : (
        contacts.map((contact, idx) => (
          <ContactRow
            key={idx}
            name={contact.name}
            phone={contact.phone}
            relation={contact.relation}
          />
        ))
      )}
    </div>
  );
}
