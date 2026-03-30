import { Outlet, useNavigate } from 'react-router-dom';
import { LogOut, User, Settings, Calendar, FileText, Package, Activity, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Layout({ user, onLogout }: { user: any; onLogout: () => void }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const getNavItems = () => {
    switch (user.role) {
      case 'admin':
        return [
          { name: 'Dashboard', icon: Activity, path: '/' },
          { name: 'Usuarios', icon: User, path: '/users' },
          { name: 'Inventario', icon: Package, path: '/inventory' },
          { name: 'Reportes', icon: FileText, path: '/reports' },
        ];
      case 'dentist':
        return [
          { name: 'Mi Agenda', icon: Calendar, path: '/' },
          { name: 'Pacientes', icon: User, path: '/patients' },
          { name: 'Historias Clínicas', icon: FileText, path: '/records' },
        ];
      case 'patient':
        return [
          { name: 'Mis Citas', icon: Calendar, path: '/' },
          { name: 'Mi Historial', icon: FileText, path: '/history' },
          { name: 'Pagos', icon: Activity, path: '/payments' },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between h-16 px-6 bg-blue-600 text-white">
          <span className="text-xl font-bold">OdontoSys</span>
          <button className="lg:hidden" onClick={() => setSidebarOpen(false)}>
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-4">
          <div className="flex items-center space-x-3 mb-6 p-3 bg-slate-100 rounded-lg">
            <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 font-bold">
              {user.name.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-medium text-slate-900">{user.name}</p>
              <p className="text-xs text-slate-500 capitalize">{user.role}</p>
            </div>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => {
                  navigate(item.path);
                  setSidebarOpen(false);
                }}
                className="flex items-center w-full px-3 py-2 text-sm font-medium text-slate-700 rounded-md hover:bg-blue-50 hover:text-blue-700"
              >
                <item.icon className="w-5 h-5 mr-3 text-slate-400" />
                {item.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="absolute bottom-0 w-full p-4 border-t border-slate-200">
          <button
            onClick={onLogout}
            className="flex items-center w-full px-3 py-2 text-sm font-medium text-red-600 rounded-md hover:bg-red-50"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Cerrar Sesión
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8">
          <button
            className="lg:hidden text-slate-500 hover:text-slate-700"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="flex items-center space-x-4 ml-auto">
            <button className="text-slate-400 hover:text-slate-500">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
