import Sidebar from '@/components/Sidebar';

const contacts = [
  { name: 'Maya Fernandes', relation: 'Sister', phone: '+91 98900 11001', priority: 'Primary' },
  { name: 'Aditi Rao', relation: 'Friend', phone: '+91 98111 45312', priority: 'Secondary' },
  { name: 'Neha Sharma', relation: 'Colleague', phone: '+91 99220 88341', priority: 'Secondary' },
  { name: 'Isha Menon', relation: 'Neighbor', phone: '+91 98109 22817', priority: 'Primary' },
];

export default function ContactsPage() {
  return (
    <div className="safeher-page md:flex">
      <Sidebar />
      <main className="flex-1 p-4 md:p-8">
        <section className="glass-shell rounded-3xl p-5 md:p-7 mb-6">
          <p className="safeher-pill safeher-pill-pink mb-3">Trusted Circle</p>
          <h1 className="text-3xl font-black text-[#4f336f]">Emergency Contacts</h1>
          <p className="text-[#7e5f97] mt-1">Your direct safety network for calls, alerts, and location sharing.</p>
        </section>

        <section className="safeher-card p-5 md:p-6 overflow-x-auto">
          <table className="safeher-table min-w-[520px]">
            <thead>
              <tr>
                <th>Name</th>
                <th>Relation</th>
                <th>Phone</th>
                <th>Priority</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((contact) => (
                <tr key={contact.phone}>
                  <td className="font-semibold text-[#5f3f81]">{contact.name}</td>
                  <td>{contact.relation}</td>
                  <td>{contact.phone}</td>
                  <td><span className={`safeher-pill ${contact.priority === 'Primary' ? 'safeher-pill-pink' : 'safeher-pill-indigo'}`}>{contact.priority}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}
