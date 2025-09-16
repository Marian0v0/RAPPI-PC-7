
const { supabase } = require('../utils/supabaseClient');

class ProductoModel {
    // Traer todos los productos
    static async traerProductos() {
        const { data, error } = await supabase
            .from('producto')
            .select(`
                *,
                detalles_producto:detalles_producto_id (precio_producto, biografia_producto),
                testaurante:testaurante_id (nombre, direccion),
                comercio:comercio_id (nombre_marca, tipo_comercio)
            `);
        
        if (error) {
            throw error;
        }
        return data;
    }

    // Traer producto por ID
    static async traerProductoPorId(id) {
        const { data, error } = await supabase
            .from('producto')
            .select(`
                *,
                detalles_producto:detalles_producto_id (precio_producto, biografia_producto),
                testaurante:testaurante_id (nombre, direccion),
                comercio:comercio_id (nombre_marca, tipo_comercio)
            `)
            .eq('id', id)
            .single();
        
        if (error) {
            throw error;
        }
        return data;
    }

    // Crear producto
    static async crearProducto(nombre, descripcion, precio, testaurante_id, comercio_id, detalles_producto_id) {
        const { data, error } = await supabase
            .from('producto')
            .insert([
                { 
                    nombre, 
                    descripcion, 
                    precio, 
                    testaurante_id, 
                    comercio_id, 
                    detalles_producto_id 
                }
            ])
            .select();
        
        if (error) {
            throw error;
        }
        return data[0];
    }

    // Actualizar producto por ID
    static async actualizarProductoPorId(id, nombre, descripcion, precio, testaurante_id, comercio_id, detalles_producto_id) {
        const { data, error } = await supabase
            .from('producto')
            .update({ 
                nombre, 
                descripcion, 
                precio, 
                testaurante_id, 
                comercio_id, 
                detalles_producto_id 
            })
            .eq('id', id)
            .select();
        
        if (error) {
            throw error;
        }
        return data[0];
    }

    // Eliminar producto por ID
    static async eliminarProductoPorId(id) {
        const { error } = await supabase
            .from('producto')
            .delete()
            .eq('id', id);
        
        if (error) {
            throw error;
        }
        return true;
    }

    // Traer productos por restaurante
    static async traerProductosPorRestaurante(restauranteId) {
        const { data, error } = await supabase
            .from('producto')
            .select(`
                *,
                detalles_producto:detalles_producto_id (precio_producto, biografia_producto)
            `)
            .eq('testaurante_id', restauranteId);
        
        if (error) {
            throw error;
        }
        return data;
    }
}

module.exports = ProductoModel;
