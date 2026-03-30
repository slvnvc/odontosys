import { useState, useEffect } from 'react';
import { User } from 'lucide-react';

export default function Patients() {
  const [patients, setPatients] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/users')
      .then(res => res.json())
      .then(data => setPatients(data.filter((u: any) => u.role === 'patient')))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Mis Pacientes</h1>
        <p className="text-slate-500">Lista de pacientes asignados.</p>
      </div>
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <ul className="divide-y divide-slate-200">
          {patients.map(p => (
            <li key={p.id} className="p-4 hover:bg-slate-50 flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                  {p.name.charAt(0)}
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-slate-900">{p.name}</p>
                  <p className="text-sm text-slate-500">{p.email}</p>
                </div>
              </div>
              <button className="text-blue-600 hover:text-blue-900 text-sm font-medium">Ver Historia</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
