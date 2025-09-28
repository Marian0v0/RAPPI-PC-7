/**
 * 
 * @module geolocalizacionService
 * @author Marian:D
 */

const axios = require('axios');

const geolocalizacionService = {

    obtenerCoordenadas: async (direccion) => {
        try {
            if (!direccion || direccion.trim() === '') {
                throw new Error('Dirección no válida o vacía');
            }
            const url = 'https://nominatim.openstreetmap.org/search';
            const params = {q: direccion.trim(),format: 'json',limit: 1,countrycodes: 'co',addressdetails: 1};
            const response = await axios.get(url, { params,headers: {'User-Agent': 'Rappi-Experimental/1.0'}
            });
            
            if (response.data && response.data.length > 0) {
                const resultado = response.data[0];
                return {latitud: parseFloat(resultado.lat),longitud: parseFloat(resultado.lon),direccion: resultado.display_name,precision: resultado.importance};
            } else {
                throw new Error('No se encontraron coordenadas para la dirección proporcionada');
            }
        } catch (error) {
            console.error("  Error en obtenerCoordenadas:", error);
            throw error;
        }
    },

    calcularDistancia: (lat1, lon1, lat2, lon2) => {
        const R = 6371; 
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
            Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const distancia = R * c;
        return distancia;
    },

    generarRuta: async (ubicacionActual, direccionRecogida, direccionEntrega) => {
        try {
            if (!ubicacionActual || !direccionRecogida || !direccionEntrega) {
                throw new Error('Todas las direcciones son requeridas para generar la ruta');
            }
            const [coordsActual, coordsRecogida, coordsEntrega] = await Promise.all([
                geolocalizacionService.obtenerCoordenadas(ubicacionActual),
                geolocalizacionService.obtenerCoordenadas(direccionRecogida),
                geolocalizacionService.obtenerCoordenadas(direccionEntrega)
            ]);
            const distanciaARecogida = geolocalizacionService.calcularDistancia(
                coordsActual.latitud, coordsActual.longitud,
                coordsRecogida.latitud, coordsRecogida.longitud
            );
            const distanciaRecogidaAEntrega = geolocalizacionService.calcularDistancia(
                coordsRecogida.latitud, coordsRecogida.longitud,
                coordsEntrega.latitud, coordsEntrega.longitud
            );

            const tiempoARecogida = Math.ceil((distanciaARecogida / 30) * 60); 
            const tiempoRecogidaAEntrega = Math.ceil((distanciaRecogidaAEntrega / 30) * 60); 
            const tiempoTotal = tiempoARecogida + tiempoRecogidaAEntrega;
            const puntosRuta = geolocalizacionService.generarPuntosIntermedios(
                coordsActual, coordsRecogida, coordsEntrega
            );
            return {ruta: {ubicacionActual: coordsActual,direccionRecogida: coordsRecogida,direccionEntrega: coordsEntrega,puntosIntermedios: puntosRuta},
                    distancias: {aRecogida: distanciaARecogida,recogidaAEntrega: distanciaRecogidaAEntrega,total: distanciaARecogida + distanciaRecogidaAEntrega},
                    tiempos: {aRecogida: tiempoARecogida,recogidaAEntrega: tiempoRecogidaAEntrega,total: tiempoTotal},
                    instrucciones: [`Dirigirse a ${coordsRecogida.direccion} (${tiempoARecogida} min)`,`Recoger pedido en ${coordsRecogida.direccion}`,`Entregar en ${coordsEntrega.direccion} (${tiempoRecogidaAEntrega} min)`]
            };
        } catch (error) {
            console.error("  Error en generarRuta:", error);
            throw error;
        }
    },

    generarPuntosIntermedios: (inicio, medio, fin) => {
        const puntos = [];
        puntos.push({
            latitud: inicio.latitud + (medio.latitud - inicio.latitud) * 0.25,
            longitud: inicio.longitud + (medio.longitud - inicio.longitud) * 0.25,
            tipo: 'intermedio'
        });
        puntos.push({
            latitud: inicio.latitud + (medio.latitud - inicio.latitud) * 0.75,
            longitud: inicio.longitud + (medio.longitud - inicio.longitud) * 0.75,
            tipo: 'intermedio'
        });
        puntos.push({
            latitud: medio.latitud + (fin.latitud - medio.latitud) * 0.5,
            longitud: medio.longitud + (fin.longitud - medio.longitud) * 0.5,
            tipo: 'intermedio'
        });
        return puntos;
    },

    obtenerDireccion: async (latitud, longitud) => {
        try {
            const url = 'https://nominatim.openstreetmap.org/reverse';
            const params = {lat: latitud,lon: longitud,format: 'json',addressdetails: 1};
            const response = await axios.get(url, {  params, headers: {'User-Agent': 'Rappi-Experimental/1.0'}
            });
            
            if (response.data) {
                return {direccion: response.data.display_name,componentes: response.data.address};
            } else {
                throw new Error('No se pudo obtener la dirección para las coordenadas proporcionadas');
            }
        } catch (error) {
            console.error("  Error en obtenerDireccion:", error);
            throw error;
        }
    }
};

module.exports = geolocalizacionService;