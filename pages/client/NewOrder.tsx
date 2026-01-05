import React, { useState } from 'react';
import { Upload, FileText, Check, Minus, Plus, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export const NewOrder: React.FC = () => {
  const [step, setStep] = useState(1);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [config, setConfig] = useState({
    copies: 1,
    color: 'bw',
    type: 'document',
    binding: false,
    localId: '1'
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const calculateTotal = () => {
    let price = 0.50;
    if (config.color === 'color') price = 1.50;
    if (config.type === 'photo') price = 5.00;
    
    let total = price * config.copies;
    if (config.binding) total += 2.00;
    
    return total.toFixed(2);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(3);
  };

  return (
    <div className="max-w-3xl mx-auto animate-fade-up">
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Nuevo Pedido</h2>
        <p className="text-text-secondary mt-1">Sube tus archivos y configura la impresión.</p>
      </div>

      {/* Step 1: File Upload */}
      {step === 1 && (
        <div className="card p-8 animate-fade-up">
          <div className="border-2 border-dashed border-white/10 rounded-xl p-12 flex flex-col items-center justify-center text-center hover:border-accent/50 hover:bg-surface-subtle/50 transition-all cursor-pointer relative group">
            <input 
              type="file" 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.jpg,.png"
            />
            {selectedFile ? (
              <>
                <div className="w-20 h-20 bg-accent/10 rounded-2xl flex items-center justify-center mb-4">
                  <FileText className="w-10 h-10 text-accent" />
                </div>
                <p className="font-bold text-white text-lg">{selectedFile.name}</p>
                <p className="text-sm text-text-muted mb-6">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                <button 
                  onClick={() => setStep(2)}
                  className="btn-primary z-10"
                >
                  Configurar Impresión
                </button>
              </>
            ) : (
              <>
                <div className="w-20 h-20 bg-surface-subtle rounded-2xl flex items-center justify-center mb-4 text-text-muted group-hover:text-accent group-hover:bg-accent/10 transition-all">
                  <Upload className="w-10 h-10" />
                </div>
                <p className="font-bold text-white text-lg">Sube tu archivo aquí</p>
                <p className="text-sm text-text-muted mt-1">Soporta PDF, Word, JPG, PNG</p>
              </>
            )}
          </div>
        </div>
      )}

      {/* Step 2: Configuration */}
      {step === 2 && (
        <form onSubmit={handleSubmit} className="card p-8 animate-fade-up">
          {/* File info */}
          <div className="flex items-center gap-4 mb-8 pb-6 border-b border-white/5">
            <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-accent" />
            </div>
            <div>
              <p className="font-bold text-white">{selectedFile?.name}</p>
              <button 
                type="button" 
                onClick={() => setStep(1)} 
                className="text-xs text-danger hover:underline"
              >
                Cambiar archivo
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Local Selection */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-3">Sucursal de Retiro</label>
              <select 
                className="input-modern"
                value={config.localId}
                onChange={(e) => setConfig({...config, localId: e.target.value})}
              >
                <option value="1">Sucursal Central (Av. Principal 123)</option>
                <option value="2">Sucursal Norte (Mall Plaza)</option>
              </select>
            </div>

            {/* Copies */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-3">Cantidad de Copias</label>
              <div className="flex items-center">
                <button 
                  type="button"
                  className="w-12 h-12 bg-surface-subtle rounded-l-xl border border-white/5 hover:bg-surface-overlay transition-colors flex items-center justify-center"
                  onClick={() => setConfig({...config, copies: Math.max(1, config.copies - 1)})}
                >
                  <Minus className="w-4 h-4 text-text-muted" />
                </button>
                <input 
                  type="number" 
                  value={config.copies}
                  readOnly
                  className="w-20 h-12 text-center border-y border-white/5 outline-none text-white font-bold bg-surface-raised"
                />
                <button 
                  type="button"
                  className="w-12 h-12 bg-surface-subtle rounded-r-xl border border-white/5 hover:bg-surface-overlay transition-colors flex items-center justify-center"
                  onClick={() => setConfig({...config, copies: config.copies + 1})}
                >
                  <Plus className="w-4 h-4 text-text-muted" />
                </button>
              </div>
            </div>

            {/* Color Options */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-text-secondary mb-3">Configuración de Color</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setConfig({...config, color: 'bw'})}
                  className={`relative p-4 rounded-xl border-2 transition-all text-left ${
                    config.color === 'bw' 
                      ? 'border-accent bg-accent/10' 
                      : 'border-white/5 hover:border-white/10 bg-surface-subtle'
                  }`}
                >
                  {config.color === 'bw' && (
                    <div className="absolute top-3 right-3 w-5 h-5 bg-accent rounded-full flex items-center justify-center">
                      <Check size={12} className="text-white" />
                    </div>
                  )}
                  <div className={`font-bold ${config.color === 'bw' ? 'text-accent' : 'text-white'}`}>
                    Blanco y Negro
                  </div>
                  <div className="text-xs text-text-muted mt-1">$0.50 / hoja</div>
                </button>
                <button
                  type="button"
                  onClick={() => setConfig({...config, color: 'color'})}
                  className={`relative p-4 rounded-xl border-2 transition-all text-left ${
                    config.color === 'color' 
                      ? 'border-accent bg-accent/10' 
                      : 'border-white/5 hover:border-white/10 bg-surface-subtle'
                  }`}
                >
                  {config.color === 'color' && (
                    <div className="absolute top-3 right-3 w-5 h-5 bg-accent rounded-full flex items-center justify-center">
                      <Check size={12} className="text-white" />
                    </div>
                  )}
                  <div className={`font-bold ${config.color === 'color' ? 'text-accent' : 'text-white'}`}>
                    Full Color
                  </div>
                  <div className="text-xs text-text-muted mt-1">$1.50 / hoja</div>
                </button>
              </div>
            </div>

            {/* Binding */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-3">Acabados</label>
              <label className="flex items-center space-x-3 p-4 border border-white/5 rounded-xl cursor-pointer hover:bg-surface-subtle transition-colors">
                <input 
                  type="checkbox" 
                  checked={config.binding}
                  onChange={(e) => setConfig({...config, binding: e.target.checked})}
                  className="w-5 h-5 text-accent rounded focus:ring-accent bg-surface-subtle border-white/10"
                />
                <span className="text-white font-medium">Anillado (+ $2.00)</span>
              </label>
            </div>
          </div>

          {/* Total */}
          <div className="bg-gradient-to-br from-surface-overlay to-surface-subtle p-6 rounded-xl flex items-center justify-between mb-6 border border-white/5">
            <div>
              <p className="text-text-muted text-sm">Total a Pagar</p>
              <p className="text-3xl font-bold text-white">${calculateTotal()}</p>
            </div>
            <div className="text-right">
              <div className="inline-flex items-center gap-1 bg-accent/10 px-3 py-1 rounded-full text-xs text-accent mb-1">
                <Sparkles className="w-3 h-3" />
                Ganarás
              </div>
              <p className="text-xl font-bold text-accent">+{Math.floor(parseFloat(calculateTotal()) * 10)} pts</p>
            </div>
          </div>

          <button 
            type="submit"
            className="btn-primary w-full text-lg py-4"
          >
            Confirmar Pedido
          </button>
        </form>
      )}

      {/* Step 3: Success */}
      {step === 3 && (
        <div className="card p-12 animate-fade-up text-center">
          <div className="w-24 h-24 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-12 h-12 text-success" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-3">¡Pedido Recibido!</h3>
          <p className="text-text-secondary mb-8 max-w-md mx-auto">
            Tu pedido #ORD-Demo ha sido enviado. Recibirás una notificación cuando esté listo para retirar.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/client/orders" 
              className="px-8 py-3 border border-white/10 text-white rounded-xl font-medium hover:bg-surface-subtle transition-colors"
            >
              Ver mis pedidos
            </Link>
            <button 
              onClick={() => {setStep(1); setSelectedFile(null);}} 
              className="btn-primary"
            >
              Imprimir otro
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
