import React, { useState, useRef, useEffect } from "react";
import { Camera, AlertTriangle, Trash2, Download, Eye, X } from "lucide-react";

export default function CameraMultas() {
  const [registros, setRegistros] = useState(() => {
    const saved = localStorage.getItem("registrosMultas");
    return saved ? JSON.parse(saved) : [];
  });

  const [placa, setPlaca] = useState("");
  const [velocidad, setVelocidad] = useState("");
  const [limiteVelocidad, setLimiteVelocidad] = useState("60");
  const [tipo, setTipo] = useState("exceso-velocidad");
  const [selectedRegistro, setSelectedRegistro] = useState(null);
  const [flashActive, setFlashActive] = useState(false);

  // Guardar en localStorage
  useEffect(() => {
    localStorage.setItem("registrosMultas", JSON.stringify(registros));
  }, [registros]);

  // Calcular monto de multa basado en velocidad
  const calcularMulta = (velocidadMedida, limiteV, tipoInfraccion) => {
    const exceso = velocidadMedida - limiteV;

    switch (tipoInfraccion) {
      case "exceso-velocidad":
        if (exceso <= 10) return 500;
        if (exceso <= 20) return 1000;
        if (exceso <= 30) return 2500;
        return 5000;
      case "estacionamiento":
        return 1500;
      case "semaforo":
        return 3000;
      case "uso-celular":
        return 2000;
      case "sin-cinturon":
        return 1000;
      default:
        return 500;
    }
  };

  const capturarInfraccion = (e) => {
    e.preventDefault();

    if (!placa.trim()) {
      alert("Ingrese número de placa");
      return;
    }

    if (tipo === "exceso-velocidad" && (!velocidad || !limiteVelocidad)) {
      alert("Ingrese velocidades para exceso de velocidad");
      return;
    }

    // Efecto flash
    setFlashActive(true);
    setTimeout(() => setFlashActive(false), 300);

    const monto =
      tipo === "exceso-velocidad"
        ? calcularMulta(parseInt(velocidad), parseInt(limiteVelocidad), tipo)
        : calcularMulta(0, 0, tipo);

    const nuevoRegistro = {
      id: Date.now(),
      fecha: new Date().toLocaleString("es-MX"),
      placa: placa.toUpperCase(),
      tipo,
      velocidad: tipo === "exceso-velocidad" ? velocidad : null,
      limiteVelocidad: tipo === "exceso-velocidad" ? limiteVelocidad : null,
      monto,
      estado: "pendiente",
    };

    setRegistros([nuevoRegistro, ...registros]);

    // Reset form
    setPlaca("");
    setVelocidad("");
    setLimiteVelocidad("60");
    setTipo("exceso-velocidad");
  };

  const eliminarRegistro = (id) => {
    setRegistros(registros.filter((r) => r.id !== id));
  };

  const descargarJSON = () => {
    const dataStr = JSON.stringify(registros, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `multas_${new Date().getTime()}.json`;
    link.click();
  };

  const totalMultas = registros.reduce((sum, r) => sum + r.monto, 0);
  const getTypeLabel = (t) => {
    const labels = {
      "exceso-velocidad": "Exceso de Velocidad",
      estacionamiento: "Estacionamiento",
      semaforo: "Semáforo en Rojo",
      "uso-celular": "Uso de Celular",
      "sin-cinturon": "Sin Cinturón",
    };
    return labels[t];
  };

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "linear-gradient(135deg, #0a0e27 0%, #1a1f3a 50%, #0f1428 100%)",
        fontFamily: '"JetBrains Mono", monospace',
      }}
    >
      {/* Flash effect */}
      {flashActive && (
        <div className="fixed inset-0 bg-white opacity-70 z-50 pointer-events-none animate-pulse" />
      )}

      <div className="max-w-7xl mx-auto p-4 md:p-8">
        {/* Header */}
        <div className="mb-12 text-center border-b-2 border-red-600 pb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="relative">
              <Camera className="w-10 h-10 text-red-500" />
              <div
                className="absolute inset-0 animate-pulse"
                style={{
                  background:
                    "radial-gradient(circle, rgba(239,68,68,0.3) 0%, transparent 70%)",
                  borderRadius: "50%",
                }}
              />
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white">
              CÁMARA VIAL
            </h1>
          </div>
          <p className="text-red-400 text-sm font-bold tracking-widest uppercase">
            Sistema de Vigilancia de Tránsito
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Panel Captura */}
          <div className="md:col-span-1">
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg border-2 border-red-600 p-6 shadow-2xl">
              <h2 className="text-red-400 text-lg font-bold mb-6 flex items-center gap-2 uppercase tracking-wider">
                <AlertTriangle className="w-5 h-5" />
                Nueva Infracción
              </h2>

              <form onSubmit={capturarInfraccion} className="space-y-4">
                <div>
                  <label className="block text-white text-xs font-bold mb-2 uppercase tracking-wider">
                    Placa Vehicular
                  </label>
                  <input
                    type="text"
                    value={placa}
                    onChange={(e) => setPlaca(e.target.value)}
                    placeholder="ABC-1234"
                    className="w-full px-3 py-2 bg-slate-700 border border-red-500 rounded font-mono text-white placeholder-slate-400 focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-500/20"
                  />
                </div>

                <div>
                  <label className="block text-white text-xs font-bold mb-2 uppercase tracking-wider">
                    Tipo de Infracción
                  </label>
                  <select
                    value={tipo}
                    onChange={(e) => setTipo(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-700 border border-red-500 rounded text-white focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-500/20"
                  >
                    <option value="exceso-velocidad">
                      Exceso de Velocidad
                    </option>
                    <option value="estacionamiento">
                      Estacionamiento Prohibido
                    </option>
                    <option value="semaforo">Semáforo en Rojo</option>
                    <option value="uso-celular">Uso de Celular</option>
                    <option value="sin-cinturon">Sin Cinturón</option>
                  </select>
                </div>

                {tipo === "exceso-velocidad" && (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-white text-xs font-bold mb-2 uppercase tracking-wider">
                          Velocidad Medida
                        </label>
                        <input
                          type="number"
                          value={velocidad}
                          onChange={(e) => setVelocidad(e.target.value)}
                          placeholder="80"
                          className="w-full px-3 py-2 bg-slate-700 border border-red-500 rounded text-white placeholder-slate-400 focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-500/20"
                        />
                      </div>
                      <div>
                        <label className="block text-white text-xs font-bold mb-2 uppercase tracking-wider">
                          Límite Permitido
                        </label>
                        <input
                          type="number"
                          value={limiteVelocidad}
                          onChange={(e) => setLimiteVelocidad(e.target.value)}
                          placeholder="60"
                          className="w-full px-3 py-2 bg-slate-700 border border-red-500 rounded text-white placeholder-slate-400 focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-500/20"
                        />
                      </div>
                    </div>
                  </>
                )}

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-3 rounded-lg uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 mt-6 shadow-lg hover:shadow-red-600/50"
                >
                  <Camera className="w-5 h-5" />
                  Capturar
                </button>
              </form>

              {/* Estadísticas */}
              <div className="mt-8 pt-6 border-t border-slate-700 space-y-3">
                <div className="bg-slate-700/50 p-3 rounded border border-slate-600">
                  <p className="text-slate-400 text-xs uppercase tracking-wider">
                    Total Infracciones
                  </p>
                  <p className="text-white text-3xl font-bold">
                    {registros.length}
                  </p>
                </div>
                <div className="bg-slate-700/50 p-3 rounded border border-slate-600">
                  <p className="text-slate-400 text-xs uppercase tracking-wider">
                    Total Recaudado
                  </p>
                  <p className="text-red-400 text-2xl font-bold">
                    ${totalMultas.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Historial */}
          <div className="md:col-span-2">
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg border-2 border-slate-700 p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-white text-lg font-bold uppercase tracking-wider">
                  Historial de Infracciones
                </h2>
                {registros.length > 0 && (
                  <button
                    onClick={descargarJSON}
                    className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-bold uppercase transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Exportar JSON
                  </button>
                )}
              </div>

              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {registros.length === 0 ? (
                  <div className="text-center py-12 text-slate-400">
                    <Camera className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="uppercase tracking-wider text-sm">
                      No hay infracciones registradas
                    </p>
                  </div>
                ) : (
                  registros.map((reg) => (
                    <div
                      key={reg.id}
                      className="bg-slate-700/50 border-l-4 border-red-600 p-4 rounded hover:bg-slate-700 transition-colors cursor-pointer"
                      onClick={() => setSelectedRegistro(reg)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-mono text-white font-bold text-lg">
                              {reg.placa}
                            </span>
                            <span className="text-xs bg-red-600 text-white px-2 py-1 rounded uppercase font-bold">
                              {getTypeLabel(reg.tipo).split(" ")[0]}
                            </span>
                          </div>
                          <p className="text-slate-400 text-xs font-mono mb-1">
                            {reg.fecha}
                          </p>
                          <p className="text-slate-300 text-sm">
                            {getTypeLabel(reg.tipo)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-red-400 font-bold text-lg">
                            ${reg.monto}
                          </p>
                          <div className="flex gap-2 mt-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedRegistro(reg);
                              }}
                              className="p-1 hover:bg-blue-600 rounded transition-colors"
                            >
                              <Eye className="w-4 h-4 text-blue-400" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                eliminarRegistro(reg.id);
                              }}
                              className="p-1 hover:bg-red-600 rounded transition-colors"
                            >
                              <Trash2 className="w-4 h-4 text-red-400" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Detalles */}
      {selectedRegistro && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border-2 border-red-600 rounded-lg p-8 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">
                Detalles Infracción
              </h3>
              <button
                onClick={() => setSelectedRegistro(null)}
                className="p-1 hover:bg-slate-800 rounded"
              >
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between pb-3 border-b border-slate-700">
                <span className="text-slate-400 text-sm uppercase">Placa</span>
                <span className="text-white font-bold font-mono">
                  {selectedRegistro.placa}
                </span>
              </div>
              <div className="flex justify-between pb-3 border-b border-slate-700">
                <span className="text-slate-400 text-sm uppercase">Tipo</span>
                <span className="text-white font-bold">
                  {getTypeLabel(selectedRegistro.tipo)}
                </span>
              </div>
              {selectedRegistro.velocidad && (
                <>
                  <div className="flex justify-between pb-3 border-b border-slate-700">
                    <span className="text-slate-400 text-sm uppercase">
                      Velocidad
                    </span>
                    <span className="text-red-400 font-bold">
                      {selectedRegistro.velocidad} km/h
                    </span>
                  </div>
                  <div className="flex justify-between pb-3 border-b border-slate-700">
                    <span className="text-slate-400 text-sm uppercase">
                      Límite
                    </span>
                    <span className="text-white">
                      {selectedRegistro.limiteVelocidad} km/h
                    </span>
                  </div>
                  <div className="flex justify-between pb-3 border-b border-slate-700">
                    <span className="text-slate-400 text-sm uppercase">
                      Exceso
                    </span>
                    <span className="text-orange-400 font-bold">
                      {selectedRegistro.velocidad -
                        selectedRegistro.limiteVelocidad}{" "}
                      km/h
                    </span>
                  </div>
                </>
              )}
              <div className="flex justify-between pb-3 border-b border-slate-700">
                <span className="text-slate-400 text-sm uppercase">
                  Fecha/Hora
                </span>
                <span className="text-white text-sm">
                  {selectedRegistro.fecha}
                </span>
              </div>
              <div className="flex justify-between pt-3 bg-slate-800 p-3 rounded-lg">
                <span className="text-slate-300 uppercase font-bold">
                  Monto Multa
                </span>
                <span className="text-red-400 text-2xl font-bold">
                  ${selectedRegistro.monto}
                </span>
              </div>
            </div>

            <button
              onClick={() => setSelectedRegistro(null)}
              className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 rounded uppercase transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
