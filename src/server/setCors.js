const admin = require('firebase-admin');
const { Storage } = require('@google-cloud/storage');

// Inisialisasi Firebase Admin SDK
admin.initializeApp();

// Mengonfigurasi Cloud Storage
const storage = new Storage();
const bucket = storage.bucket('YOUR_BUCKET_NAME'); // Ganti dengan nama bucket Firebase Storage kamu

// Setel konfigurasi CORS
async function setCors() {
    const corsConfiguration = [{
        origin: ['http://localhost:5173'], // Atur origin yang ingin diizinkan
        method: ['GET', 'POST', 'OPTIONS'],
        maxAgeSeconds: 3600,
    }, ];

    try {
        await bucket.setCorsConfiguration(corsConfiguration);
        console.log('CORS configuration set successfully');
    } catch (error) {
        console.error('Error setting CORS configuration:', error);
    }
}

setCors();