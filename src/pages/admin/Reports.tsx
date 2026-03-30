import { FileText } from 'lucide-react';

export default function Reports() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Reportes</h1>
        <p className="text-slate-500">Generación de informes y estadísticas.</p>
      </div>
      <div className="bg-white shadow rounded-lg p-6 text-center">
        <FileText className="mx-auto h-12 w-12 text-slate-400 mb-4" />
        <h3 className="text-lg font-medium text-slate-900">Módulo en Construcción</h3>
        <p className="text-slate-500 mt-2">Los reportes detallados estarán disponibles pronto.</p>
      </div>
    </div>
  );
}
