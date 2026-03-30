import { useState, useEffect } from 'react';
import { Users, Calendar, DollarSign, Package, TrendingUp, AlertCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    appointments: 0,
    inventoryAlerts: 0,
    revenue: 15400
  });
  const [inventory, setInventory] = useState<any[]>([]);

  const chartData = [
    { name: 'Lun', citas: 12 },
    { name: 'Mar', citas: 19 },
    { name: 'Mié', citas: 15 },
    { name: 'Jue', citas: 22 },
    { name: 'Vie', citas: 18 },
    { name: 'Sáb', citas: 8 },
  ];

  useEffect(() => {
    // Fetch real data here
    const fetchData = async () => {
      try {
        const [usersRes, aptsRes, invRes] = await Promise.all([
          fetch('/api/users'),
          fetch('/api/appointments'),
          fetch('/api/inventory')
        ]);
        
        const users = await usersRes.json();
        const apts = await aptsRes.json();
        const inv = await invRes.json();

        setInventory(inv);
        setStats(prev => ({
          ...prev,
          users: users.length,
          appointments: apts.length,
          inventoryAlerts: inv.filter((i: any) => i.quantity <= i.min_stock).length
        }));
      } catch (error) {
        console.error("Error fetching admin data", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Panel de Administración</h1>
        <p className="text-slate-500">Resumen general del consultorio</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-slate-500 truncate">Total Usuarios</dt>
                  <dd className="text-lg font-semibold text-slate-900">{stats.users}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-slate-500 truncate">Citas del Mes</dt>
                  <dd className="text-lg font-semibold text-slate-900">{stats.appointments}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="h-6 w-6 text-emerald-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-slate-500 truncate">Ingresos (S/)</dt>
                  <dd className="text-lg font-semibold text-slate-900">S/ {stats.revenue}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertCircle className={`h-6 w-6 ${stats.inventoryAlerts > 0 ? 'text-red-600' : 'text-slate-400'}`} />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-slate-500 truncate">Alertas Inventario</dt>
                  <dd className={`text-lg font-semibold ${stats.inventoryAlerts > 0 ? 'text-red-600' : 'text-slate-900'}`}>
                    {stats.inventoryAlerts}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts and AI Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-slate-900 mb-4">Productividad Semanal (Citas)</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="citas" fill="#2563eb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center space-x-2 mb-4">
            <TrendingUp className="h-5 w-5 text-purple-600" />
            <h2 className="text-lg font-medium text-slate-900">IA Insights</h2>
          </div>
          <div className="space-y-4">
            <div className="bg-purple-50 p-4 rounded-md border border-purple-100">
              <h3 className="text-sm font-medium text-purple-800">Sugerencia de Agenda</h3>
              <p className="mt-1 text-sm text-purple-600">
                Alta demanda detectada los jueves por la tarde. Sugerimos abrir 2 cupos adicionales.
              </p>
            </div>
            <div className="bg-amber-50 p-4 rounded-md border border-amber-100">
              <h3 className="text-sm font-medium text-amber-800">Predicción de Inventario</h3>
              <p className="mt-1 text-sm text-amber-600">
                El stock de "Resina Compuesta" se agotará en 5 días basado en el ritmo actual de uso.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 border-b border-slate-200 sm:px-6 flex justify-between items-center">
          <h3 className="text-lg leading-6 font-medium text-slate-900 flex items-center">
            <Package className="mr-2 h-5 w-5 text-slate-500" />
            Estado del Inventario
          </h3>
          <button className="text-sm text-blue-600 hover:text-blue-500 font-medium">Ver todo</button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Artículo
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Cantidad
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {inventory.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-center text-sm text-slate-500">
                    No hay datos de inventario.
                  </td>
                </tr>
              ) : (
                inventory.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                      {item.item_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {item.quantity} {item.unit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.quantity <= item.min_stock ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                          Stock Bajo
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Óptimo
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
