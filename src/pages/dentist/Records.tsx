import { FileText } from 'lucide-react';

export default function Records() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Historias Clínicas</h1>
        <p className="text-slate-500">Búsqueda y gestión de registros médicos.</p>
      </div>
      <div className="bg-white shadow rounded-lg p-6 text-center">
        <FileText className="mx-auto h-12 w-12 text-slate-400 mb-4" />
        <h3 className="text-lg font-medium text-slate-900">Historias Clínicas</h3>
        <p className="text-slate-500 mt-2">Selecciona un paciente para ver su historia clínica detallada.</p>
      </div>
    </div>
  );
}
