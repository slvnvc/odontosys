import React, { useState, useEffect } from 'react';
import { Calendar, CreditCard, FileText, Plus, Bell, X } from 'lucide-react';

export default function PatientDashboard({ user }: { user: any }) {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newDate, setNewDate] = useState('');
  const [newNotes, setNewNotes] = useState('');

  const fetchAppointments = async () => {
    try {
      const res = await fetch('/api/appointments');
      const data = await res.json();
      setAppointments(data.filter((a: any) => a.patient_id === user.id));
    } catch (error) {
      console.error("Error fetching appointments", error);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [user.id]);

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patient_id: user.id,
          dentist_id: 2, // Hardcoded for prototype
          date: newDate,
          status: 'scheduled',
          notes: newNotes
        })
      });
      setShowModal(false);
      fetchAppointments();
    } catch (error) {
      console.error("Error booking appointment", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Hola, {user.name}</h1>
          <p className="text-slate-500">Bienvenido a tu portal de paciente</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          Agendar Cita
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-slate-500 bg-opacity-75" onClick={() => setShowModal(false)} />
            <div className="relative inline-block px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div className="absolute top-0 right-0 pt-4 pr-4">
                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-500">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                  <h3 className="text-lg font-medium leading-6 text-slate-900">Agendar Nueva Cita</h3>
                  <div className="mt-4">
                    <form onSubmit={handleBook} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700">Fecha y Hora</label>
                        <input 
                          type="datetime-local" 
                          required
                          value={newDate}
                          onChange={(e) => setNewDate(e.target.value)}
                          className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700">Motivo / Notas</label>
                        <textarea 
                          required
                          value={newNotes}
                          onChange={(e) => setNewNotes(e.target.value)}
                          className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" 
                          rows={3}
                        />
                      </div>
                      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                        <button type="submit" className="inline-flex justify-center w-full px-4 py-2 text-base font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm">
                          Confirmar Cita
                        </button>
                        <button type="button" onClick={() => setShowModal(false)} className="inline-flex justify-center w-full px-4 py-2 mt-3 text-base font-medium text-slate-700 bg-white border border-slate-300 rounded-md shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm">
                          Cancelar
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Next Appointment */}
        <div className="bg-white shadow rounded-lg p-6 border-t-4 border-blue-500">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-slate-900">Próximas Citas</h3>
            <Calendar className="h-6 w-6 text-blue-500" />
          </div>
          {appointments.length > 0 ? (
            <div className="space-y-4">
              {appointments.map(apt => (
                <div key={apt.id} className="border-b pb-2 last:border-0">
                  <p className="text-lg font-bold text-slate-900">
                    {new Date(apt.date).toLocaleDateString()}
                  </p>
                  <p className="text-slate-500 mt-1">
                    {new Date(apt.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </p>
                  <p className="text-sm font-medium text-slate-700 mt-2">
                    Con: {apt.dentist_name || 'Dr. Perez'}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Motivo: {apt.notes}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500">No tienes citas programadas.</p>
          )}
        </div>

        {/* Payments */}
        <div className="bg-white shadow rounded-lg p-6 border-t-4 border-emerald-500">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-slate-900">Pagos Pendientes</h3>
            <CreditCard className="h-6 w-6 text-emerald-500" />
          </div>
          <p className="text-3xl font-bold text-slate-900">S/ 150.00</p>
          <p className="text-sm text-amber-600 mt-1">Tienes 1 pago pendiente</p>
          <a href="/payments" className="mt-4 w-full inline-flex justify-center items-center px-4 py-2 border border-slate-300 shadow-sm text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50">
            Ver Historial de Pagos
          </a>
        </div>

        {/* History */}
        <div className="bg-white shadow rounded-lg p-6 border-t-4 border-purple-500">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-slate-900">Historial Clínico</h3>
            <FileText className="h-6 w-6 text-purple-500" />
          </div>
          <p className="text-sm text-slate-600 mb-4">
            Accede a tus radiografías, diagnósticos y planes de tratamiento.
          </p>
          <button className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-purple-700 bg-purple-100 hover:bg-purple-200">
            Ver Mi Historial
          </button>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 border-b border-slate-200 sm:px-6 flex items-center">
          <Bell className="h-5 w-5 text-amber-500 mr-2" />
          <h3 className="text-lg leading-6 font-medium text-slate-900">Notificaciones</h3>
        </div>
        <ul className="divide-y divide-slate-200">
          <li className="p-4 hover:bg-slate-50">
            <p className="text-sm text-slate-800">Recuerda tu cita de limpieza dental mañana a las 10:00 AM.</p>
            <p className="text-xs text-slate-500 mt-1">Hace 2 horas</p>
          </li>
          <li className="p-4 hover:bg-slate-50">
            <p className="text-sm text-slate-800">Tu factura electrónica ha sido generada y enviada a tu correo.</p>
            <p className="text-xs text-slate-500 mt-1">Ayer</p>
          </li>
        </ul>
      </div>
    </div>
  );
}
