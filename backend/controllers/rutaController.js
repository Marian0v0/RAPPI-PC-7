/**
 * Ruta Controller
 * @module rutaController
 * @author Marian:D
 */

    const geolocalizacionService = require('../services/geolocalizacionService');
    const supabase = require('../utils/database');

    const rutaController = {
        
    generarRutaEntrega: async (req, res) => {
        try {
            const { id_repartidor, id_pedido, ubicacion_actual_repartidor } = req.body;
            if (!id_repartidor || !id_pedido || !ubicacion_actual_repartidor) {
                return res.status(400).json({ success: false, error: 'id_repartidor, id_pedido y ubicacion_actual_repartidor son requeridos' });
            }
            const { data: pedido, error: errorPedido } = await supabase
                .from('pedido').select('*').eq('id_pedido', id_pedido).single();
            if (errorPedido) throw errorPedido;
            if (!pedido) {
                return res.status(404).json({ success: false, error: 'Pedido no encontrado' });
            }
            const { data: repartidor, error: errorRepartidor } = await supabase
                .from('repartidor').select('*').eq('id_repartidor', id_repartidor).single();
            if (errorRepartidor) throw errorRepartidor;
            if (!repartidor) {
                return res.status(404).json({ success: false, error: 'Repartidor no encontrado' });
            }
            const direccionRecogida = "Restaurante El Buen Sabor, Bogotá, Colombia"; 
            const direccionEntrega = pedido.direccion_entrega || "Calle 123 #45-67, Bogotá, Colombia";
            const ruta = await geolocalizacionService.generarRuta(ubicacion_actual_repartidor,direccionRecogida,direccionEntrega);

            res.json({ success: true, message: 'Ruta de entrega generada exitosamente',data: { pedido: {id_pedido: pedido.id_pedido, cliente: pedido.cliente,direccion_entrega: pedido.direccion_entrega, total_pedido: pedido.total_pedido
                    },repartidor: {id_repartidor: repartidor.id_repartidor,tipo_vehiculo: repartidor.tipo_vehiculo
                    },ruta: ruta
                }
            });
        } catch (error) {
            console.error("Error en generarRutaEntrega:", error);
            res.status(500).json({ success: false, error: error.message });
        }
    },

    getPedidosDisponibles: async (req, res) => {
        try {
            const { id_repartidor } = req.params;
            const { data: repartidor, error: errorRepartidor } = await supabase
                .from('repartidor').select('*').eq('id_repartidor', id_repartidor).single();
            if (errorRepartidor || !repartidor) {
                return res.status(404).json({ success: false, error: 'Repartidor no encontrado' });
            }
            const { data: pedidos, error } = await supabase
                .from('pedido').select(`
                    *,cliente(*)
                `).eq('estado_pedido', 'Pendiente').order('fecha_pedido', { ascending: true });

            if (error) throw error;
            const pedidosSinAsignacion = [];
            for (const pedido of pedidos) {
                const { data: asignacion } = await supabase
                    .from('asignacion_pedido').select('*').eq('id_pedido', pedido.id_pedido).single();
                if (!asignacion) {
                    pedidosSinAsignacion.push(pedido);
                }
            }
            const pedidosConDistancia = pedidosSinAsignacion.map(pedido => ({...pedido,distancia_estimada: Math.floor(Math.random() * 5) + 1,tiempo_estimado: Math.floor(Math.random() * 20) + 10, ganancia_estimada: Math.floor(pedido.total_pedido * 0.15)}));
            res.json({ success: true, pedidos_disponibles: pedidosConDistancia,timestamp: new Date().toISOString()
            });
        } catch (error) {
            console.error("Error en getPedidosDisponibles:", error);
            res.status(500).json({ success: false, error: error.message });
        }
    },

    tomarPedido: async (req, res) => {
        try {
            const { id_repartidor, id_pedido } = req.body;
            if (!id_repartidor || !id_pedido) {
                return res.status(400).json({ success: false, error: 'id_repartidor e id_pedido son requeridos' 
                });
            }
            const { data: pedido, error: errorPedido } = await supabase
                .from('pedido').select('*').eq('id_pedido', id_pedido).eq('estado_pedido', 'Pendiente').single();
            if (errorPedido || !pedido) {
                return res.status(400).json({ 
                    success: false, 
                    error: 'El pedido no está disponible' 
                });
            }
            const { data: asignacionExistente } = await supabase
                .from('asignacion_pedido').select('*').eq('id_pedido', id_pedido).single();
            if (asignacionExistente) {
                return res.status(400).json({ success: false, error: 'El pedido ya fue tomado por otro repartidor' 
                });
            }

            const { data: ultimaAsignacion, error: errorUltima } = await supabase
                .from('asignacion_pedido').select('id_asignacion').order('id_asignacion', { ascending: false }).limit(1);
            let id_asignacion = 1;
            if (!errorUltima && ultimaAsignacion && ultimaAsignacion.length > 0) {
                id_asignacion = ultimaAsignacion[0].id_asignacion + 1;
            }
            const { data: nuevaAsignacion, error: errorAsignacion } = await supabase
                .from('asignacion_pedido').insert([{id_asignacion: id_asignacion,id_repartidor: id_repartidor,id_pedido: id_pedido,estado_asignacion: 'Aceptado',
                    fecha_asignacion: new Date().toISOString().split('T')[0],
                    hora_asignacion: new Date().toTimeString().split(' ')[0]
                }]).select().single();
            if (errorAsignacion) throw errorAsignacion;

            const { data: pedidoActualizado, error: errorUpdate } = await supabase
                .from('pedido').update({ estado_pedido: 'En Proceso'}).eq('id_pedido', id_pedido).select().single();
            if (errorUpdate) throw errorUpdate;

            res.json({ 
                success: true, message: 'Pedido tomado exitosamente',data: {asignacion: nuevaAsignacion, pedido: pedidoActualizado}
            });
        } catch (error) {
            console.error("Error en tomarPedido:", error);
            res.status(500).json({ success: false, error: error.message });
        }
    },

    getMisPedidos: async (req, res) => {
        try {
            const { id_repartidor } = req.params;
            const { data: asignaciones, error: errorAsignaciones } = await supabase
                .from('asignacion_pedido').select('*').eq('id_repartidor', id_repartidor).eq('estado_asignacion', 'Aceptado').order('fecha_asignacion', { ascending: false });
            if (errorAsignaciones) {
                console.error("Error obteniendo asignaciones:", errorAsignaciones);
                throw errorAsignaciones;
            }
            if (!asignaciones || asignaciones.length === 0) {
                return res.json({ success: true, mis_pedidos: [],timestamp: new Date().toISOString()});
            }
            const misPedidos = [];
            for (const asignacion of asignaciones) {
                const { data: pedido, error: errorPedido } = await supabase
                    .from('pedido').select(`
                        *,cliente(*)
                    `).eq('id_pedido', asignacion.id_pedido).single();
                if (errorPedido) {
                    console.error(`Error obteniendo pedido ${asignacion.id_pedido}:`, errorPedido);
                    continue; 
                }
                if (pedido) {pedido.asignacion = asignacion;misPedidos.push(pedido);}
            }
            res.json({ success: true, mis_pedidos: misPedidos,timestamp: new Date().toISOString()
            });
        } catch (error) {
            console.error("Error en getMisPedidos:", error);
            res.status(500).json({ success: false, error: error.message });
        }
    },

        obtenerCoordenadas: async (req, res) => {
            try {
                const { direccion } = req.params;
                if (!direccion) {
                    return res.status(400).json({ success: false, error: 'Dirección es requerida' 
                    });
                }
                const coordenadas = await geolocalizacionService.obtenerCoordenadas(direccion);
                res.json({ success: true, data: coordenadas });
            } catch (error) {
                res.status(500).json({ success: false, error: error.message });
            }
        },

        obtenerDireccion: async (req, res) => {
            try {
                const { latitud, longitud } = req.params;
                if (!latitud || !longitud) {
                    return res.status(400).json({ success: false, error: 'Latitud y longitud son requeridas' });
                }
                const direccion = await geolocalizacionService.obtenerDireccion(parseFloat(latitud), parseFloat(longitud));
                res.json({ success: true, data: direccion 
                });
            } catch (error) {
                res.status(500).json({ success: false, error: error.message });
            }
        },

        calcularDistancia: async (req, res) => {
            try {
                const { lat1, lon1, lat2, lon2 } = req.params;
                if (!lat1 || !lon1 || !lat2 || !lon2) {
                    return res.status(400).json({ success: false, error: 'Todas las coordenadas son requeridas' 
                    });
                }
                const distancia = geolocalizacionService.calcularDistancia(parseFloat(lat1), parseFloat(lon1),parseFloat(lat2), parseFloat(lon2));
                
                res.json({ success: true, data: { distancia: distancia, unidad: 'kilómetros'} 
                });
            } catch (error) {
                res.status(500).json({ success: false, error: error.message });
            }
        }
    };

    module.exports = rutaController;
