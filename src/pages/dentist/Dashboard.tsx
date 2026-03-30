import { useState, useEffect } from 'react';
import { Calendar, Clock, User, FileText, CheckCircle } from 'lucide-react';

export default function DentistDashboard({ user }: { user: any }) {
  const [appointments, setAppointments] = useState<any[]>([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await fetch('/api/appointments');
        const data = await res.json();
        // Filter for this dentist
        setAppointments(data.filter((a: any) => a.dentist_id === user.id));
      } catch (error) {
        console.error("Error fetching appointments", error);
      }
    };
    fetchAppointments();
  }, [user.id]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Bienvenido, {user.name}</h1>
        <p className="text-slate-500">Aquí está tu agenda para hoy</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Agenda Section */}
        <div className="lg:col-span-2 bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 border-b border-slate-200 sm:px-6 flex justify-between items-center">
            <h3 className="text-lg leading-6 font-medium text-slate-900 flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-blue-500" />
              Citas Programadas
            </h3>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {appointments.length} Hoy
            </span>
          </div>
          <ul className="divide-y divide-slate-200">
            {appointments.length === 0 ? (
              <li className="p-6 text-center text-slate-500">No hay citas programadas para hoy.</li>
            ) : (
              appointments.map((apt) => (
                <li key={apt.id} className="p-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold">
                          {apt.patient_name?.charAt(0) || 'P'}
                        </div>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-slate-900">{apt.patient_name}</p>
                        <div className="flex items-center text-sm text-slate-500 mt-1">
                          <Clock className="flex-shrink-0 mr-1.5 h-4 w-4 text-slate-400" />
                          <p>{new Date(apt.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-blue-600 hover:bg-blue-700">
                        <FileText className="mr-1.5 h-4 w-4" />
                        Historia
                      </button>
                      {apt.status !== 'completed' && (
                        <button className="inline-flex items-center px-3 py-1.5 border border-slate-300 text-xs font-medium rounded shadow-sm text-slate-700 bg-white hover:bg-slate-50">
                          <CheckCircle className="mr-1.5 h-4 w-4 text-green-500" />
                          Completar
                        </button>
                      )}
                    </div>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>

        {/* AI Assistant Section */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-slate-900 mb-4 flex items-center">
            <User className="mr-2 h-5 w-5 text-purple-500" />
            Asistente IA
          </h3>
          <div className="space-y-4">
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <p className="text-sm text-slate-600">
                <strong>Análisis de Historial:</strong> El paciente Juan Pérez tiene un historial de sensibilidad dental. Se recomienda usar anestesia tópica antes del procedimiento de hoy.
              </p>
            </div>
            <button className="w-full flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-purple-700 bg-purple-100 hover:bg-purple-200">
              Generar Resumen Clínico
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
