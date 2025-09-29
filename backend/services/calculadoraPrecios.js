/**
 * 
 * @module calculadoraPrecios
 * @author Marian:D
 */

const supabase = require('../utils/database');

const calculadoraPrecios = {

    calcularCostoPedido: async (id_pedido) => {
        try {
            const { data: pedidoDetalles, error: errorDetalles } = await supabase
                .from('pedido_detalle').select('cantidad, precio_unitario, id_producto').eq('id_pedido', id_pedido);
            if (errorDetalles) throw errorDetalles;
            let subtotal = 0;
            let cantidadTotalProductos = 0;
            
            pedidoDetalles.forEach(detalle => {
                const subtotalProducto = detalle.cantidad * detalle.precio_unitario;
                subtotal += subtotalProducto;
                cantidadTotalProductos += detalle.cantidad;
            });
            const tarifaEnvio = calculadoraPrecios.calcularTarifaEnvio(subtotal, cantidadTotalProductos);
            const { data: pedido, error: errorPedido } = await supabase
                .from('pedido').select('cargos_adicionales, direccion_entrega').eq('id_pedido', id_pedido).single();

            if (errorPedido) throw errorPedido;
            const cargosAdicionales = pedido.cargos_adicionales || 0;
            const impuestos = subtotal * 0.19;
            const total = subtotal + tarifaEnvio + cargosAdicionales + impuestos;
            return {subtotal,tarifaEnvio,cargosAdicionales,impuestos,total,desglose: {productos: subtotal,envio: tarifaEnvio,adicionales: cargosAdicionales,impuestos: impuestos,total: total},detalles: {cantidadProductos: cantidadTotalProductos,direccionEntrega: pedido.direccion_entrega}
            };
        } catch (error) {
            console.error("  Error en calcularCostoPedido:", error);
            throw error;
        }
    },

    calcularTarifaEnvio: (subtotal, cantidadProductos) => {
        let tarifaBase = 3000; 
        if (subtotal > 50000) {
            tarifaBase = 2000; 
        } else if (subtotal < 15000) {
            tarifaBase = 4000; 
        }
        const factorCantidad = Math.min(cantidadProductos * 500, 2000);
        const factorDistancia = 1000;
        const hora = new Date().getHours();
        let factorTiempo = 0;
        if (hora >= 12 && hora <= 14) { 
            factorTiempo = 1000;
        } else if (hora >= 19 && hora <= 21) { 
            factorTiempo = 1500;
        }
        const tarifaTotal = tarifaBase + factorCantidad + factorDistancia + factorTiempo;
        return Math.round(tarifaTotal);
    },

    actualizarTotalPedido: async (id_pedido) => {
        try {
            const costo = await calculadoraPrecios.calcularCostoPedido(id_pedido);
            const { data, error } = await supabase
                .from('pedido').update({ total_pedido: costo.total }).eq('id_pedido', id_pedido).select().single();
            if (error) throw error;
            return { ...costo, pedidoActualizado: data };
        } catch (error) {
            console.error("  Error en actualizarTotalPedido:", error);
            throw error;
        }
    },

    calcularDescuentos: async (id_cliente, subtotal) => {
        try {
            const { data: pedidosCliente, error } = await supabase
                .from('pedido').select('total_pedido, fecha_pedido').eq('id_cliente', id_cliente).eq('estado_pedido', 'Entregado').order('fecha_pedido', { ascending: false }).limit(10);
            if (error) throw error;
            let descuento = 0;
            let tipoDescuento = '';
            if (pedidosCliente && pedidosCliente.length >= 5) {
                descuento = subtotal * 0.1; 
                tipoDescuento = 'Cliente frecuente';
            }
            else if (subtotal > 100000) {
                descuento = subtotal * 0.05;
                tipoDescuento = 'Pedido grande';
            }
            else if (!pedidosCliente || pedidosCliente.length === 0) {
                descuento = subtotal * 0.15;
                tipoDescuento = 'Primera compra';
            }
            return {descuento: Math.round(descuento),tipoDescuento,subtotalConDescuento: subtotal - descuento};
        } catch (error) {
            console.error("  Error en calcularDescuentos:", error);
            return { descuento: 0, tipoDescuento: '', subtotalConDescuento: subtotal };
        }
    },

    calcularCostoCompleto: async (id_pedido, id_cliente) => {
        try {
            const costoBase = await calculadoraPrecios.calcularCostoPedido(id_pedido);
            const descuentos = await calculadoraPrecios.calcularDescuentos(id_cliente, costoBase.subtotal);
            const totalConDescuento = costoBase.total - descuentos.descuento;
            return {...costoBase,descuentos,totalFinal: Math.max(0, totalConDescuento),ahorro: descuentos.descuento};
        } catch (error) {
            console.error("  Error en calcularCostoCompleto:", error);
            throw error;
        }
    }
};

module.exports = calculadoraPrecios;