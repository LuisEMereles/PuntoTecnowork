import React, { useState } from 'react';
import { Upload, FileText, Check, AlertCircle } from 'lucide-react';

export const NewOrder: React.FC = () => {
  const [step, setStep] = useState(1);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [config, setConfig] = useState({
    copies: 1,
    color: 'bw', // 'bw' | 'color'
    type: 'document', // 'document' | 'photo'
    binding: false,
    localId: '1'
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const calculateTotal = () => {
    let price = 0.50; // Base B/W
    if (config.color === 'color') price = 1.50;
    if (config.type === 'photo') price = 5.00;
    
    let total = price * config.copies;
    if (config.binding) total += 2.00;
    
    return total.toFixed(2);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(3); // Show success
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Nuevo Pedido</h2>
        <p className="text-gray-500 mt-1">Sube tus archivos y configura la impresión en simples pasos.</p>
      </div>

      {step === 1 && (
        <div className="glass-card p-8 rounded-2xl animate-fade-in-up">
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 flex flex-col items-center justify-center text-center hover:bg-gray-50 hover:border-primary-blue transition-colors cursor-pointer relative group">
            <input 
              type="file" 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.jpg,.png"
            />
            {selectedFile ? (
              <>
                <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-4 text-primary-blue">
                   <FileText className="w-10 h-10" />
                </div>
                <p className="font-bold text-gray-900 text-lg">{selectedFile.name}</p>
                <p className="text-sm text-gray-500 mb-6">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                <button 
                  onClick={() => setStep(2)}
                  className="bg-primary-blue text-white py-2.5 px-8 rounded-lg font-semibold hover:bg-blue-600 transition-colors z-10 shadow-lg shadow-blue-500/20"
                >
                  Configurar Impresión
                </button>
              </>
            ) : (
              <>
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-400 group-hover:text-primary-blue group-hover:bg-blue-50 transition-colors">
                  <Upload className="w-10 h-10" />
                </div>
                <p className="font-bold text-gray-900 text-lg">Sube tu archivo aquí</p>
                <p className="text-sm text-gray-500 mt-1">Soporta PDF, Word, JPG, PNG</p>
              </>
            )}
          </div>
        </div>
      )}

      {step === 2 && (
        <form onSubmit={handleSubmit} className="glass-card p-8 rounded-2xl animate-fade-in-up">
          <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-100">
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-primary-blue">
              <FileText size={24} />
            </div>
            <div>
              <p className="font-bold text-gray-900">{selectedFile?.name}</p>
              <button type="button" onClick={() => setStep(1)} className="text-xs text-red-500 hover:underline">Cambiar archivo</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Sucursal de Retiro</label>
              <select 
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-blue outline-none text-gray-800"
                value={config.localId}
                onChange={(e) => setConfig({...config, localId: e.target.value})}
              >
                <option value="1">Sucursal Central (Av. Principal 123)</option>
                <option value="2">Sucursal Norte (Mall Plaza)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Cantidad de Copias</label>
              <div className="flex items-center">
                <button 
                  type="button"
                  className="w-12 h-12 bg-white rounded-l-xl border border-gray-200 hover:bg-gray-50 font-bold text-gray-600"
                  onClick={() => setConfig({...config, copies: Math.max(1, config.copies - 1)})}
                >
                  -
                </button>
                <input 
                  type="number" 
                  value={config.copies}
                  readOnly
                  className="w-20 h-12 text-center border-y border-gray-200 outline-none text-gray-800 font-bold bg-gray-50"
                />
                <button 
                  type="button"
                  className="w-12 h-12 bg-white rounded-r-xl border border-gray-200 hover:bg-gray-50 font-bold text-gray-600"
                  onClick={() => setConfig({...config, copies: config.copies + 1})}
                >
                  +
                </button>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-3">Configuración de Color</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setConfig({...config, color: 'bw'})}
                  className={`relative p-4 rounded-xl border-2 transition-all text-left ${config.color === 'bw' ? 'border-primary-blue bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}
                >
                  {config.color === 'bw' && <div className="absolute top-3 right-3 text-primary-blue"><Check size={18} /></div>}
                  <div className={`font-bold ${config.color === 'bw' ? 'text-primary-blue' : 'text-gray-700'}`}>Blanco y Negro</div>
                  <div className="text-xs text-gray-500 mt-1">$0.50 / hoja</div>
                </button>
                <button
                  type="button"
                  onClick={() => setConfig({...config, color: 'color'})}
                  className={`relative p-4 rounded-xl border-2 transition-all text-left ${config.color === 'color' ? 'border-primary-blue bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}
                >
                   {config.color === 'color' && <div className="absolute top-3 right-3 text-primary-blue"><Check size={18} /></div>}
                  <div className={`font-bold ${config.color === 'color' ? 'text-primary-blue' : 'text-gray-700'}`}>Full Color</div>
                  <div className="text-xs text-gray-500 mt-1">$1.50 / hoja</div>
                </button>
              </div>
            </div>

            <div>
               <label className="block text-sm font-semibold text-gray-700 mb-3">Acabados</label>
               <label className="flex items-center space-x-3 p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                 <input 
                    type="checkbox" 
                    checked={config.binding}
                    onChange={(e) => setConfig({...config, binding: e.target.checked})}
                    className="w-5 h-5 text-primary-blue rounded focus:ring-primary-blue border-gray-300"
                 />
                 <span className="text-gray-700 font-medium">Anillado (+ $2.00)</span>
               </label>
            </div>
          </div>

          <div className="bg-gray-900 text-white p-6 rounded-xl flex items-center justify-between mb-6 shadow-lg">
            <div>
              <p className="text-gray-400 text-sm">Total a Pagar</p>
              <p className="text-3xl font-bold">${calculateTotal()}</p>
            </div>
            <div className="text-right">
              <div className="inline-block bg-white/10 px-3 py-1 rounded-full text-xs mb-1">
                 Ganarás
              </div>
              <p className="text-xl font-bold text-secondary-yellow">+{Math.floor(parseFloat(calculateTotal()) * 10)} pts</p>
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-primary-blue text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/30"
          >
            Confirmar Pedido
          </button>
        </form>
      )}

      {step === 3 && (
        <div className="glass-card p-12 rounded-2xl animate-fade-in-up text-center">
          <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-12 h-12 text-success-green" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">¡Pedido Recibido!</h3>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">Tu pedido #ORD-Demo ha sido enviado. Recibirás una notificación cuando esté listo para retirar.</p>
          
          <div className="flex justify-center gap-4">
            <button onClick={() => window.location.href = '#/client/orders'} className="px-8 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors">
              Ver mis pedidos
            </button>
            <button onClick={() => {setStep(1); setSelectedFile(null);}} className="px-8 py-3 bg-primary-blue text-white rounded-xl font-medium hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/20">
              Imprimir otro
            </button>
          </div>
        </div>
      )}
    </div>
  );
};