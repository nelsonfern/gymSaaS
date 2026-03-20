import cors from 'cors';

const ACCEPTED_ORIGINS = [
    'http://localhost:5173', // Vite/React Default
    'http://localhost:3000', // React default o Postman
    'http://127.0.0.1:5173',
    process.env.FRONTEND_URL // El domino final donde alojes tu frontend
].filter(Boolean);

export const corsMiddleware = ({ acceptedOrigins = ACCEPTED_ORIGINS } = {}) => cors({
    origin: (origin, callback) => {
        // En caso de entorno de desarrollo: permitir sin origen (Postman o Server to Server)
        if (!origin || process.env.NODE_ENV !== 'production') {
            return callback(null, true);
        }

        if (acceptedOrigins.includes(origin)) {
            return callback(null, true);
        }

        return callback(new Error('Origin Not allowed by CORS'));
    },
    credentials: true, // Si usas cookies
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
});
