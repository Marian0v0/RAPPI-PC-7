import React, { useState, useEffect } from 'react';
import './FinanzasRepartidor.css';

const FinanzasRepartidor = () => {
  const [finanzas, setFinanzas] = useState({
    ganancias_totales: 0,
    deuda_total: 0,
    pagos_pendientes: 0,
    incentivos: 0,
    devoluciones: 0
  });
  const [transacciones, setTransacciones] = useState([]);
  const [metodoPago, setMetodoPago] = useState(null);
  const [mostrarPago, setMostrarPago] = useState(false);
  const [montoPago, setMontoPago] = useState(0);
  const [loading, setLoading] = useState(false);
  const [periodo, setPeriodo] = useState('mes'); // dia, semana, mes, año

  useEffect(() => {
    cargarFinanzas();
    cargarTransacciones();
    cargarMetodoPago();
  }, [periodo]);

  const cargarFinanzas = async () => {
    try {
      const repartidorId = localStorage.getItem('repartidor_id') || 1;
      const response = await fetch(`https://rappi-pc-7.onrender.com/backend/repartidores/${repartidorId}/finanzas?periodo=${periodo}`);
      if (response.ok) {
        const data = await response.json();
        setFinanzas(data);
      }
    } catch (error) {
      console.error('Error cargando finanzas:', error);
    }
  };

  const cargarTransacciones = async () => {
    try {
      const repartidorId = localStorage.getItem('repartidor_id') || 1;
      const response = await fetch(`https://rappi-pc-7.onrender.com/backend/repartidores/${repartidorId}/transacciones?periodo=${periodo}`);
      if (response.ok) {
        const data = await response.json();
        setTransacciones(data);
      }
    } catch (error) {
      console.error('Error cargando transacciones:', error);
    }
  };

  const cargarMetodoPago = async () => {
    try {
      const repartidorId = localStorage.getItem('repartidor_id') || 1;
      const response = await fetch(`https://rappi-pc-7.onrender.com/backend/repartidores/${repartidorId}/metodo-pago`);
      if (response.ok) {
        const data = await response.json();
        setMetodoPago(data);
      }
    } catch (error) {
      console.error('Error cargando método de pago:', error);
    }
  };

  const procesarPago = async () => {
    if (montoPago <= 0 || montoPago > finanzas.deuda_total) {
      alert('Monto inválido');
      return;
    }

    setLoading(true);
    try {
      const repartidorId = localStorage.getItem('repartidor_id') || 1;
      const response = await fetch(`https://rappi-pc-7.onrender.com/backend/repartidores/${repartidorId}/pagar-deuda`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          monto: montoPago,
          metodo_pago: metodoPago?.tipo || 'efectivo'
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          alert('¡Pago procesado exitosamente!');
          setMostrarPago(false);
          setMontoPago(0);
          cargarFinanzas();
          cargarTransacciones();
        } else {
          alert('Error al procesar el pago');
        }
      } else {
        alert('Error al procesar el pago');
      }
    } catch (error) {
      console.error('Error procesando pago:', error);
      alert('Error al procesar el pago');
    } finally {
      setLoading(false);
    }
  };

  const solicitarPago = async () => {
    setLoading(true);
    try {
      const repartidorId = localStorage.getItem('repartidor_id') || 1;
      const response = await fetch(`https://rappi-pc-7.onrender.com/backend/repartidores/${repartidorId}/solicitar-pago`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          monto: finanzas.pagos_pendientes
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          alert('¡Solicitud de pago enviada! Se procesará en las próximas 24 horas.');
          cargarFinanzas();
        } else {
          alert('Error al solicitar el pago');
        }
      } else {
        alert('Error al solicitar el pago');
      }
    } catch (error) {
      console.error('Error solicitando pago:', error);
      alert('Error al solicitar el pago');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="finanzas-container">
      <div className="finanzas-header">
        <h2>💰 Mis Finanzas</h2>
        <div className="periodo-selector">
          <select value={periodo} onChange={(e) => setPeriodo(e.target.value)}>
            <option value="dia">Hoy</option>
            <option value="semana">Esta semana</option>
            <option value="mes">Este mes</option>
            <option value="año">Este año</option>
          </select>
        </div>
      </div>

      {/* Resumen financiero */}
      <div className="resumen-financiero">
        <div className="resumen-card ganancias">
          <div className="card-icon">💵</div>
          <div className="card-content">
            <h3>Ganancias</h3>
            <p className="amount positive">{formatCurrency(finanzas.ganancias_totales)}</p>
          </div>
        </div>

        <div className="resumen-card deuda">
          <div className="card-icon">💳</div>
          <div className="card-content">
            <h3>Deuda Total</h3>
            <p className="amount negative">{formatCurrency(finanzas.deuda_total)}</p>
          </div>
        </div>

        <div className="resumen-card pendientes">
          <div className="card-icon">⏳</div>
          <div className="card-content">
            <h3>Pagos Pendientes</h3>
            <p className="amount neutral">{formatCurrency(finanzas.pagos_pendientes)}</p>
          </div>
        </div>

        <div className="resumen-card incentivos">
          <div className="card-icon">🎁</div>
          <div className="card-content">
            <h3>Incentivos</h3>
            <p className="amount positive">{formatCurrency(finanzas.incentivos)}</p>
          </div>
        </div>
      </div>

      {/* Acciones rápidas */}
      <div className="acciones-rapidas">
        <h3>Acciones Rápidas</h3>
        <div className="acciones-grid">
          <button 
            className="accion-btn pagar-deuda"
            onClick={() => setMostrarPago(true)}
            disabled={finanzas.deuda_total <= 0}
          >
            💳 Pagar Deuda
          </button>
          <button 
            className="accion-btn solicitar-pago"
            onClick={solicitarPago}
            disabled={finanzas.pagos_pendientes <= 0 || loading}
          >
            {loading ? '⏳' : '💰'} Solicitar Pago
          </button>
          <button 
            className="accion-btn ver-devoluciones"
            onClick={() => alert('Funcionalidad en desarrollo')}
          >
            🔄 Ver Devoluciones
          </button>
          <button 
            className="accion-btn ver-incentivos"
            onClick={() => alert('Funcionalidad en desarrollo')}
          >
            🎁 Ver Incentivos
          </button>
        </div>
      </div>

      {/* Método de pago */}
      {metodoPago && (
        <div className="metodo-pago">
          <h3>Método de Pago</h3>
          <div className="metodo-info">
            <div className="metodo-tipo">
              <span className="icon">
                {metodoPago.tipo === 'tarjeta' ? '💳' : '🏦'}
              </span>
              <div className="metodo-details">
                <p className="tipo">{metodoPago.tipo === 'tarjeta' ? 'Tarjeta' : 'Cuenta Bancaria'}</p>
                <p className="numero">{metodoPago.numero_enmascarado}</p>
                <p className="nombre">{metodoPago.nombre_titular}</p>
              </div>
            </div>
            <button className="btn-editar">Editar</button>
          </div>
        </div>
      )}

      {/* Historial de transacciones */}
      <div className="historial-transacciones">
        <h3>Historial de Transacciones</h3>
        <div className="transacciones-list">
          {transacciones.length === 0 ? (
            <div className="no-transacciones">
              <p>No hay transacciones en este período</p>
            </div>
          ) : (
            transacciones.map((transaccion) => (
              <div key={transaccion.id} className="transaccion-item">
                <div className="transaccion-icon">
                  {transaccion.tipo === 'ganancia' && '💵'}
                  {transaccion.tipo === 'pago' && '💳'}
                  {transaccion.tipo === 'incentivo' && '🎁'}
                  {transaccion.tipo === 'devolucion' && '🔄'}
                </div>
                <div className="transaccion-details">
                  <p className="descripcion">{transaccion.descripcion}</p>
                  <p className="fecha">{formatDate(transaccion.fecha)}</p>
                </div>
                <div className={`transaccion-monto ${transaccion.tipo}`}>
                  {transaccion.tipo === 'pago' ? '-' : '+'}{formatCurrency(transaccion.monto)}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal de pago */}
      {mostrarPago && (
        <div className="modal-overlay" onClick={() => setMostrarPago(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Pagar Deuda</h3>
              <button className="btn-cerrar" onClick={() => setMostrarPago(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="deuda-info">
                <p>Deuda total: <strong>{formatCurrency(finanzas.deuda_total)}</strong></p>
              </div>
              <div className="monto-input">
                <label>Monto a pagar:</label>
                <input
                  type="number"
                  value={montoPago}
                  onChange={(e) => setMontoPago(Number(e.target.value))}
                  max={finanzas.deuda_total}
                  min="0"
                  placeholder="Ingresa el monto"
                />
              </div>
              <div className="metodo-pago-modal">
                <p>Método de pago: <strong>{metodoPago?.tipo === 'tarjeta' ? 'Tarjeta' : 'Efectivo'}</strong></p>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-cancelar" onClick={() => setMostrarPago(false)}>
                Cancelar
              </button>
              <button 
                className="btn-confirmar"
                onClick={procesarPago}
                disabled={loading || montoPago <= 0}
              >
                {loading ? 'Procesando...' : 'Confirmar Pago'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinanzasRepartidor;
