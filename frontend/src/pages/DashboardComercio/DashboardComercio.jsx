import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './DashboardComercio.css';

const DashboardComercio = () => {
  const navigate = useNavigate();
  const [comercio, setComercio] = useState(null);
  const [productos, setProductos] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAddProduct, setShowAddProduct] = useState(false);

  const [newProduct, setNewProduct] = useState({
    detalles_producto: '',
    precio_producto: '',
    fotografia_producto: ''
  });

  useEffect(() => {
    // Obtener datos del comercio desde localStorage
    const comercioData = localStorage.getItem('comercio');
    if (comercioData) {
      setComercio(JSON.parse(comercioData));
      loadData(JSON.parse(comercioData));
    } else {
      navigate('/comercio/login');
      return;
    }
  }, [navigate]);

  const loadData = async (comercioData) => {
    try {
      setLoading(true);
      
      // Cargar productos del comercio
      const productosResponse = await fetch(`https://rappi-pc-7.onrender.com/backend/productos/comercio/${comercioData.id_comercio}`);
      if (productosResponse.ok) {
        const data = await productosResponse.json();
        if (data.success) {
          setProductos(data.data);
        }
      }

      // Cargar pedidos del comercio (mock por ahora)
      const pedidosMock = [
        {
          id_pedido: 1,
          id_cliente: 1,
          fecha_pedido: new Date().toISOString(),
          estado_pedido: 'Pendiente',
          total_pedido: 45000,
          productos: [
            { nombre: 'Producto A', cantidad: 2, precio: 25000 },
            { nombre: 'Producto B', cantidad: 1, precio: 20000 }
          ]
        },
        {
          id_pedido: 2,
          id_cliente: 2,
          fecha_pedido: new Date(Date.now() - 3600000).toISOString(),
          estado_pedido: 'En Proceso',
          total_pedido: 32000,
          productos: [
            { nombre: 'Producto C', cantidad: 1, precio: 32000 }
          ]
        }
      ];
      setPedidos(pedidosMock);
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://rappi-pc-7.onrender.com/backend/productos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          detalles_producto: newProduct.detalles_producto,
          precio_producto: parseFloat(newProduct.precio_producto),
          fotografia_producto: newProduct.fotografia_producto,
          id_comercio: comercio.id_comercio
        }),
      });

      const data = await response.json();
      if (data.success) {
        setProductos([...productos, data.data]);
        setNewProduct({ detalles_producto: '', precio_producto: '', fotografia_producto: '' });
        setShowAddProduct(false);
        alert('Producto agregado exitosamente');
      } else {
        alert('Error al agregar producto');
      }
    } catch (error) {
      console.error('Error agregando producto:', error);
      alert('Error al agregar producto');
    }
  };

  const handleDeleteProduct = async (productoId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      try {
        const response = await fetch(`https://rappi-pc-7.onrender.com/backend/productos/${productoId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setProductos(productos.filter(p => p.id_producto !== productoId));
          alert('Producto eliminado exitosamente');
        } else {
          alert('Error al eliminar producto');
        }
      } catch (error) {
        console.error('Error eliminando producto:', error);
        alert('Error al eliminar producto');
      }
    }
  };

  const updatePedidoEstado = async (pedidoId, nuevoEstado) => {
    try {
      setPedidos(pedidos.map(p => 
        p.id_pedido === pedidoId ? { ...p, estado_pedido: nuevoEstado } : p
      ));
      alert(`Pedido ${nuevoEstado.toLowerCase()}`);
    } catch (error) {
      console.error('Error actualizando pedido:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('comercio');
    navigate('/comercio/login');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="dashboard-sidebar">
        <div className="sidebar-header">
          <h2>Dashboard</h2>
          <p>{comercio?.nombre_marca}</p>
        </div>
        
        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            📊 Dashboard
          </button>
          <button 
            className={`nav-item ${activeTab === 'productos' ? 'active' : ''}`}
            onClick={() => setActiveTab('productos')}
          >
            🛍️ Productos
          </button>
          <button 
            className={`nav-item ${activeTab === 'pedidos' ? 'active' : ''}`}
            onClick={() => setActiveTab('pedidos')}
          >
            📦 Pedidos
          </button>
          <button 
            className={`nav-item ${activeTab === 'perfil' ? 'active' : ''}`}
            onClick={() => setActiveTab('perfil')}
          >
            ⚙️ Perfil
          </button>
        </nav>

        <div className="sidebar-footer">
          <button className="btn-logout" onClick={handleLogout}>
            🚪 Cerrar Sesión
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-main">
        <div className="dashboard-header">
          <h1>Dashboard del Comercio</h1>
          <div className="header-actions">
            <span className="welcome-text">Bienvenido, {comercio?.nombre_marca}</span>
          </div>
        </div>

        <div className="dashboard-content">
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="dashboard-tab">
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">🛍️</div>
                  <div className="stat-info">
                    <h3>{productos.length}</h3>
                    <p>Productos</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">📦</div>
                  <div className="stat-info">
                    <h3>{pedidos.length}</h3>
                    <p>Pedidos</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">💰</div>
                  <div className="stat-info">
                    <h3>${pedidos.reduce((sum, p) => sum + p.total_pedido, 0).toLocaleString()}</h3>
                    <p>Ventas Totales</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">⭐</div>
                  <div className="stat-info">
                    <h3>4.3</h3>
                    <p>Calificación</p>
                  </div>
                </div>
              </div>

              <div className="recent-orders">
                <h2>Pedidos Recientes</h2>
                <div className="orders-list">
                  {pedidos.slice(0, 5).map(pedido => (
                    <div key={pedido.id_pedido} className="order-item">
                      <div className="order-info">
                        <h4>Pedido #{pedido.id_pedido}</h4>
                        <p>Cliente ID: {pedido.id_cliente}</p>
                        <p>Total: ${pedido.total_pedido.toLocaleString()}</p>
                      </div>
                      <div className="order-status">
                        <span className={`status-badge ${pedido.estado_pedido.toLowerCase().replace(' ', '-')}`}>
                          {pedido.estado_pedido}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Productos Tab */}
          {activeTab === 'productos' && (
            <div className="productos-tab">
              <div className="tab-header">
                <h2>Gestión de Productos</h2>
                <button 
                  className="btn-add-product"
                  onClick={() => setShowAddProduct(true)}
                >
                  ➕ Agregar Producto
                </button>
              </div>

              {showAddProduct && (
                <div className="add-product-modal">
                  <div className="modal-content">
                    <h3>Agregar Nuevo Producto</h3>
                    <form onSubmit={handleAddProduct}>
                      <div className="form-group">
                        <label>Nombre del Producto</label>
                        <input
                          type="text"
                          value={newProduct.detalles_producto}
                          onChange={(e) => setNewProduct({...newProduct, detalles_producto: e.target.value})}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Precio</label>
                        <input
                          type="number"
                          value={newProduct.precio_producto}
                          onChange={(e) => setNewProduct({...newProduct, precio_producto: e.target.value})}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>URL de la Imagen</label>
                        <input
                          type="url"
                          value={newProduct.fotografia_producto}
                          onChange={(e) => setNewProduct({...newProduct, fotografia_producto: e.target.value})}
                        />
                      </div>
                      <div className="form-actions">
                        <button type="button" onClick={() => setShowAddProduct(false)}>
                          Cancelar
                        </button>
                        <button type="submit">Agregar</button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              <div className="productos-grid">
                {productos.map(producto => (
                  <div key={producto.id_producto} className="producto-card">
                    <div className="producto-image">
                      <img
                        src={producto.fotografia_producto || 'https://via.placeholder.com/200x150/ffffff/666666?text=Producto'}
                        alt={producto.detalles_producto}
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/200x150/ffffff/666666?text=Producto';
                        }}
                      />
                    </div>
                    <div className="producto-info">
                      <h3>{producto.detalles_producto}</h3>
                      <p className="precio">${producto.precio_producto.toLocaleString()}</p>
                    </div>
                    <div className="producto-actions">
                      <button 
                        className="btn-edit"
                        onClick={() => {/* Implementar edición */}}
                      >
                        ✏️
                      </button>
                      <button 
                        className="btn-delete"
                        onClick={() => handleDeleteProduct(producto.id_producto)}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pedidos Tab */}
          {activeTab === 'pedidos' && (
            <div className="pedidos-tab">
              <h2>Gestión de Pedidos</h2>
              <div className="pedidos-list">
                {pedidos.map(pedido => (
                  <div key={pedido.id_pedido} className="pedido-card">
                    <div className="pedido-header">
                      <h3>Pedido #{pedido.id_pedido}</h3>
                      <span className={`status-badge ${pedido.estado_pedido.toLowerCase().replace(' ', '-')}`}>
                        {pedido.estado_pedido}
                      </span>
                    </div>
                    <div className="pedido-details">
                      <p><strong>Cliente:</strong> ID {pedido.id_cliente}</p>
                      <p><strong>Fecha:</strong> {new Date(pedido.fecha_pedido).toLocaleString()}</p>
                      <p><strong>Total:</strong> ${pedido.total_pedido.toLocaleString()}</p>
                      <div className="productos-list">
                        <strong>Productos:</strong>
                        {pedido.productos.map((prod, index) => (
                          <p key={index}>• {prod.nombre} x{prod.cantidad} - ${prod.precio.toLocaleString()}</p>
                        ))}
                      </div>
                    </div>
                    <div className="pedido-actions">
                      {pedido.estado_pedido === 'Pendiente' && (
                        <button 
                          className="btn-accept"
                          onClick={() => updatePedidoEstado(pedido.id_pedido, 'Aceptado')}
                        >
                          ✅ Aceptar
                        </button>
                      )}
                      {pedido.estado_pedido === 'Aceptado' && (
                        <button 
                          className="btn-process"
                          onClick={() => updatePedidoEstado(pedido.id_pedido, 'En Proceso')}
                        >
                          🔄 En Proceso
                        </button>
                      )}
                      {pedido.estado_pedido === 'En Proceso' && (
                        <button 
                          className="btn-complete"
                          onClick={() => updatePedidoEstado(pedido.id_pedido, 'Entregado')}
                        >
                          ✅ Completar
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Perfil Tab */}
          {activeTab === 'perfil' && (
            <div className="perfil-tab">
              <h2>Información del Comercio</h2>
              <div className="perfil-info">
                <div className="info-group">
                  <label>Nombre de la Marca</label>
                  <p>{comercio?.nombre_marca}</p>
                </div>
                <div className="info-group">
                  <label>Tipo de Comercio</label>
                  <p>{comercio?.tipo_comercio}</p>
                </div>
                <div className="info-group">
                  <label>Encargado</label>
                  <p>{comercio?.nombre_encargado} {comercio?.apellido_encargado}</p>
                </div>
                <div className="info-group">
                  <label>Teléfono</label>
                  <p>{comercio?.telefono_encargado}</p>
                </div>
                <div className="info-group">
                  <label>Email</label>
                  <p>{comercio?.correo_encargado}</p>
                </div>
                <div className="info-group">
                  <label>Tipo de Persona</label>
                  <p>{comercio?.tipo_persona}</p>
                </div>
              </div>
              <button className="btn-edit-profile">
                ✏️ Editar Información
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardComercio;
