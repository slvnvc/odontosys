import React, { useState, useEffect } from 'react';
import { CreditCard, CheckCircle, Clock, ShieldCheck, X } from 'lucide-react';

export default function Payments({ user }: { user: any }) {
  const [payments, setPayments] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const fetchPayments = async () => {
    try {
      const res = await fetch(`/api/payments?patient_id=${user.id}`);
      const data = await res.json();
      setPayments(data);
    } catch (error) {
      console.error("Error fetching payments", error);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [user.id]);

  const handlePayClick = (payment: any) => {
    setSelectedPayment(payment);
    setShowModal(true);
    setPaymentSuccess(false);
  };

  const processPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate payment gateway delay
    setTimeout(async () => {
      try {
        await fetch('/api/payments/pay', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ payment_id: selectedPayment.id })
        });
        setIsProcessing(false);
        setPaymentSuccess(true);
        fetchPayments();
        
        // Close modal after showing success
        setTimeout(() => {
          setShowModal(false);
        }, 2000);
      } catch (error) {
        console.error("Payment failed", error);
        setIsProcessing(false);
      }
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Mis Pagos</h1>
        <p className="text-slate-500">Gestiona tus facturas y realiza pagos en línea de forma segura.</p>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <ul className="divide-y divide-slate-200">
          {payments.length === 0 ? (
            <li className="p-6 text-center text-slate-500">No tienes pagos registrados.</li>
          ) : (
            payments.map((payment) => (
              <li key={payment.id} className="p-6 hover:bg-slate-50 transition-colors">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-full ${payment.status === 'paid' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
                      {payment.status === 'paid' ? <CheckCircle className="w-6 h-6" /> : <Clock className="w-6 h-6" />}
                    </div>
                    <div>
                      <p className="text-lg font-medium text-slate-900">{payment.description}</p>
                      <p className="text-sm text-slate-500">Fecha: {new Date(payment.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6">
                    <div className="text-right">
                      <p className="text-2xl font-bold text-slate-900">S/ {payment.amount.toFixed(2)}</p>
                      <p className={`text-sm font-medium ${payment.status === 'paid' ? 'text-green-600' : 'text-amber-600'}`}>
                        {payment.status === 'paid' ? 'Pagado' : 'Pendiente'}
                      </p>
                    </div>
                    {payment.status === 'pending' && (
                      <button 
                        onClick={() => handlePayClick(payment)}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <CreditCard className="mr-2 h-4 w-4" />
                        Pagar Ahora
                      </button>
                    )}
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>

      {/* Payment Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-slate-500 bg-opacity-75" onClick={() => !isProcessing && setShowModal(false)} />
            
            <div className="relative inline-block px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-md sm:w-full sm:p-6">
              {!paymentSuccess ? (
                <>
                  <div className="absolute top-0 right-0 pt-4 pr-4">
                    <button onClick={() => !isProcessing && setShowModal(false)} className="text-slate-400 hover:text-slate-500">
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                  
                  <div className="text-center mb-6">
                    <h3 className="text-lg font-medium leading-6 text-slate-900">Completar Pago</h3>
                    <p className="text-sm text-slate-500 mt-1">Estás pagando: {selectedPayment?.description}</p>
                    <p className="text-2xl font-bold text-slate-900 mt-2">S/ {selectedPayment?.amount.toFixed(2)}</p>
                  </div>

                  <form onSubmit={processPayment} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700">Número de Tarjeta</label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <CreditCard className="h-5 w-5 text-slate-400" />
                        </div>
                        <input type="text" required placeholder="0000 0000 0000 0000" className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-slate-300 rounded-md py-2 border" />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700">Vencimiento</label>
                        <input type="text" required placeholder="MM/YY" className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-slate-300 rounded-md py-2 px-3 border" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700">CVC</label>
                        <input type="text" required placeholder="123" className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-slate-300 rounded-md py-2 px-3 border" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700">Nombre en la tarjeta</label>
                      <input type="text" required placeholder="Juan Pérez" className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-slate-300 rounded-md py-2 px-3 border" />
                    </div>

                    <div className="flex items-center justify-center text-xs text-slate-500 mt-4 space-x-1">
                      <ShieldCheck className="w-4 h-4 text-green-500" />
                      <span>Pago seguro encriptado</span>
                    </div>

                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 mt-6"
                    >
                      {isProcessing ? 'Procesando...' : `Pagar S/ ${selectedPayment?.amount.toFixed(2)}`}
                    </button>
                  </form>
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                    <CheckCircle className="h-10 w-10 text-green-600" />
                  </div>
                  <h3 className="text-xl font-medium text-slate-900">¡Pago Exitoso!</h3>
                  <p className="text-slate-500 mt-2">Tu pago ha sido procesado correctamente.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
