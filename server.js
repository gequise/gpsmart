require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(require('path').join(__dirname, 'index.html'));
});

async function geocodeGoogle(address) {
    const key = process.env.GOOGLE_MAPS_API_KEY;
    if (!key) throw new Error('GOOGLE_MAPS_API_KEY no configurada');
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${key}`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.status !== 'OK' || !data.results?.length) {
        throw new Error(`No se pudo geocodificar con Google: ${address}`);
    }
    const loc = data.results[0].geometry.location;
    return { address: data.results[0].formatted_address, lat: loc.lat, lng: loc.lng };
}

async function getDistanceMatrixGoogle(addresses) {
    const key = process.env.GOOGLE_MAPS_API_KEY;
    if (!key) throw new Error('GOOGLE_MAPS_API_KEY no configurada');
    const origins = addresses.map(a => encodeURIComponent(a)).join('%7C');
    const destinations = origins;
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origins}&destinations=${destinations}&units=metric&key=${key}`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.status !== 'OK') throw new Error(`Distance Matrix error: ${data.status}`);
    return data.rows.map(row => row.elements.map(el => (el.status === 'OK' ? el.distance.value : Infinity)));
}

async function geocodeOSM(address) {
    const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(address)}`;
    const res = await fetch(url, { headers: { 'User-Agent': 'maps-poc/1.0' } });
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) {
        throw new Error(`No se pudo geocodificar con OSM: ${address}`);
    }
    return {
        address: data[0].display_name,
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon)
    };
}

function haversineDistance(a, b) {
    const toRad = deg => deg * (Math.PI / 180);
    const R = 6371000;
    const dLat = toRad(b.lat - a.lat);
    const dLon = toRad(b.lng - a.lng);
    const lat1 = toRad(a.lat);
    const lat2 = toRad(b.lat);

    const h = Math.sin(dLat/2)**2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon/2)**2;
    return 2 * R * Math.asin(Math.sqrt(h));
}

async function getDistanceMatrixFromAddresses(addresses) {
    if (process.env.GOOGLE_MAPS_API_KEY) {
        try {
            return await getDistanceMatrixGoogle(addresses);
        } catch (err) {
            console.warn('Google Distance Matrix falló, intentando OSM local:', err.message);
        }
    }

    const geocoded = await Promise.all(addresses.map(async addr => {
        try {
            return await geocodeOSM(addr);
        } catch (err) {
            console.warn(err.message);
            return null;
        }
    }));

    if (geocoded.some(g => g === null)) {
        throw new Error('Algunas direcciones no pudieron geocodificarse.');
    }

    const n = geocoded.length;
    const matrix = Array.from({ length: n }, () => Array(n).fill(Infinity));
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            if (i === j) {
                matrix[i][j] = 0;
            } else {
                matrix[i][j] = haversineDistance(geocoded[i], geocoded[j]);
            }
        }
    }
    return { matrix, geocoded };
}

function solveTspNearestNeighbor(matrix, startIndex = 0) {
    const n = matrix.length;
    const visited = Array(n).fill(false);
    let current = startIndex;
    const order = [current];
    visited[current] = true;

    for (let step = 1; step < n; step++) {
        let next = -1;
        let best = Infinity;
        for (let j = 0; j < n; j++) {
            if (!visited[j] && matrix[current][j] < best) {
                best = matrix[current][j];
                next = j;
            }
        }
        if (next === -1) break;
        visited[next] = true;
        order.push(next);
        current = next;
    }
    return order;
}

function pickStartIndexByDirection(geocoded, direction = 'auto') {
    if (!Array.isArray(geocoded) || geocoded.length === 0) return 0;

    const dir = (direction || 'auto').toLowerCase();
    if (dir === 'auto') return 0;

    let bestIndex = 0;

    if (dir === 'sur') {
        // sur = latitud mínima
        let minLat = Infinity;
        geocoded.forEach((p, i) => {
            if (p.lat < minLat) {
                minLat = p.lat;
                bestIndex = i;
            }
        });
    } else if (dir === 'norte') {
        let maxLat = -Infinity;
        geocoded.forEach((p, i) => {
            if (p.lat > maxLat) {
                maxLat = p.lat;
                bestIndex = i;
            }
        });
    } else if (dir === 'este') {
        let maxLng = -Infinity;
        geocoded.forEach((p, i) => {
            if (p.lng > maxLng) {
                maxLng = p.lng;
                bestIndex = i;
            }
        });
    } else if (dir === 'oeste') {
        let minLng = Infinity;
        geocoded.forEach((p, i) => {
            if (p.lng < minLng) {
                minLng = p.lng;
                bestIndex = i;
            }
        });
    }

    return bestIndex;
}

function buildGoogleMapsUrl(orderedAddresses) {
    return 'https://www.google.com/maps/dir/' + orderedAddresses.map(a => encodeURIComponent(a)).join('/');
}

function buildOSMDirectionsUrl(orderedAddresses) {
    const route = orderedAddresses.map(a => encodeURIComponent(a)).join('%3B');
    return `https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=${route}`;
}

app.post('/chat', async (req, res) => {
    const { messages, directions = [], startDirection = 'auto' } = req.body;
    const userMessage = Array.isArray(messages) ? messages.filter(m => m.role === 'user').slice(-1)[0]?.content || '' : '';

    const rawAddresses = Array.isArray(directions) && directions.length >= 2 ? directions : userMessage.split(',').map(a => a.trim()).filter(Boolean);
    const shouldOptimizeLocally = rawAddresses.length >= 2;

    if (shouldOptimizeLocally) {
        try {
            const rawAddresses = Array.isArray(directions) && directions.length >= 2 ? directions : userMessage.split(',').map(a => a.trim()).filter(Boolean);
            if (rawAddresses.length < 2) throw new Error('Se requieren al menos 2 direcciones para optimizar.');

            const { matrix, geocoded } = await getDistanceMatrixFromAddresses(rawAddresses);
            const startIndex = pickStartIndexByDirection(geocoded, startDirection);
            const orderIndex = solveTspNearestNeighbor(matrix, startIndex);
            const orderedAddresses = orderIndex.map(i => rawAddresses[i]);

            const provider = process.env.GOOGLE_MAPS_API_KEY ? 'Google Distance Matrix' : 'OSM/Haversine (sin clave Google)';
            const reportNote = `Optimización con ${provider}, con inicio desde ${startDirection}.`;

            const routeLink = buildGoogleMapsUrl(orderedAddresses);
            const answer = `✅ La ruta optimizada es:\n${orderedAddresses.map((addr, i) => `${i + 1}. ${addr}`).join('\n')}\n\n${reportNote}\n\nEnlace para copiar o click (Google Maps):\n${routeLink}`;

            res.json({
                choices: [
                    { message: { role: 'assistant', content: answer } }
                ]
            });
            return;
        } catch (error) {
            console.error('Optimización local falló:', error.message);
            // continuar con LLM como fallback
        }
    }

    const systemPrompt = `Eres un experto en logística para rutas en CABA/Buenos Aires. Recibe direcciones separadas por comas. Ordena las direcciones para minimizar la distancia total recorrida, evitando repeticiones y ciclos innecesarios. Proporciona:\n1. La lista ordenada de direcciones.\n2. Tiempos estimados entre puntos.\n3. Un enlace directo de Google Maps en el formato exacto: https://www.google.com/maps/dir/direccion1/direccion2/.../direccionN\nAsegúrate de que el enlace sea clickeable y funcional. Si hay direcciones muy cercanas (menos de 100m), sugiere fusionarlas. Siempre incluye el enlace al final de tu respuesta.`;

    const apiMessages = [{ role: 'system', content: systemPrompt }];
    apiMessages.push(...messages);

    try {
        const response = await fetch(`${process.env.GROQ_BASE_URL}/chat/completions`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: apiMessages
            })
        });

        const data = await response.json();
        if (data.error) {
            res.status(400).json({ error: data.error.message });
        } else {
            res.json(data);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});