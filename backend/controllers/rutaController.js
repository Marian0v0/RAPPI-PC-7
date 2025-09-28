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
