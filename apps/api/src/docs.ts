// Spesifikasi OpenAPI 3.0 ditulis tangan (ringkas); dilayani di /api-docs dan /openapi.json
const bearer = [{ bearerAuth: [] }];
const json = (ref: string) => ({ content: { 'application/json': { schema: { $ref: `#/components/schemas/${ref}` } } } });
const body = (ref: string) => ({ required: true, ...json(ref) });
const file = { required: true, content: { 'multipart/form-data': { schema: { type: 'object', properties: { file: { type: 'string', format: 'binary' } } } } } };
const id = [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }];

export const openapi = {
  openapi: '3.0.3',
  info: { title: 'Smart Waste Management API', version: '1.0.0' },
  components: {
    securitySchemes: { bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' } },
    schemas: {
      Register: { type: 'object', required: ['name', 'email', 'password'], properties: { name: { type: 'string' }, email: { type: 'string' }, password: { type: 'string', minLength: 6 }, phone: { type: 'string' } } },
      Login: { type: 'object', required: ['email', 'password'], properties: { email: { type: 'string' }, password: { type: 'string' } } },
      Report: { type: 'object', required: ['title', 'description', 'category', 'image_url', 'latitude', 'longitude'], properties: { title: { type: 'string' }, description: { type: 'string' }, category: { type: 'string', enum: ['organic', 'plastic', 'paper'] }, ai_confidence: { type: 'number' }, image_url: { type: 'string' }, latitude: { type: 'number' }, longitude: { type: 'number' }, address: { type: 'string' } } },
      Status: { type: 'object', required: ['status'], properties: { status: { type: 'string', enum: ['pending', 'in_progress', 'completed', 'rejected'] }, note: { type: 'string' } } },
      Role: { type: 'object', required: ['role'], properties: { role: { type: 'string', enum: ['admin', 'user'] } } },
    },
  },
  paths: {
    '/api/auth/register': { post: { tags: ['Auth'], summary: 'Daftar (role selalu user)', requestBody: body('Register'), responses: { 201: { description: 'user + token' }, 409: { description: 'Email terdaftar' } } } },
    '/api/auth/login': { post: { tags: ['Auth'], summary: 'Login', requestBody: body('Login'), responses: { 200: { description: 'user + token' }, 401: { description: 'Kredensial salah' } } } },
    '/api/auth/me': { get: { tags: ['Auth'], security: bearer, summary: 'Profil saya', responses: { 200: { description: 'user' } } } },
    '/api/reports': {
      get: { tags: ['Reports'], security: bearer, summary: 'Daftar laporan (user: milik sendiri, admin: semua)',
        parameters: ['page', 'limit', 'status', 'category', 'q', 'sort'].map(n => ({ name: n, in: 'query', schema: { type: n === 'page' || n === 'limit' ? 'integer' : 'string' } })), responses: { 200: { description: 'data + meta' } } },
      post: { tags: ['Reports'], security: bearer, summary: 'Buat laporan (status awal pending)', requestBody: body('Report'), responses: { 201: { description: 'dibuat' } } },
    },
    '/api/reports/{id}': {
      get: { tags: ['Reports'], security: bearer, parameters: id, summary: 'Detail + riwayat status', responses: { 200: { description: 'ok' }, 404: { description: 'tidak ada' } } },
      patch: { tags: ['Reports'], security: bearer, parameters: id, summary: 'Edit (pemilik saat pending, atau admin)', requestBody: body('Report'), responses: { 200: { description: 'ok' } } },
      put: { tags: ['Reports'], security: bearer, parameters: id, summary: 'Sama dengan PATCH', requestBody: body('Report'), responses: { 200: { description: 'ok' } } },
      delete: { tags: ['Reports'], security: bearer, parameters: id, summary: 'Hapus (pemilik atau admin)', responses: { 204: { description: 'terhapus' } } },
    },
    '/api/reports/{id}/status': { patch: { tags: ['Reports'], security: bearer, parameters: id, summary: 'Ubah status + audit log (admin)', requestBody: body('Status'), responses: { 200: { description: 'ok' }, 403: { description: 'bukan admin' } } } },
    '/api/stats': { get: { tags: ['Stats'], security: bearer, summary: 'Statistik dashboard', responses: { 200: { description: 'ringkasan' } } } },
    '/api/users': { get: { tags: ['Users'], security: bearer, summary: 'Daftar user (admin)', responses: { 200: { description: 'ok' } } } },
    '/api/users/{id}/role': { patch: { tags: ['Users'], security: bearer, parameters: id, summary: 'Ubah role (admin)', requestBody: body('Role'), responses: { 200: { description: 'ok' } } } },
    '/api/users/{id}': { delete: { tags: ['Users'], security: bearer, parameters: id, summary: 'Hapus user (admin)', responses: { 204: { description: 'terhapus' }, 409: { description: 'punya riwayat status' } } } },
    '/api/upload': { post: { tags: ['Media'], security: bearer, summary: 'Upload gambar ke Supabase Storage', requestBody: file, responses: { 201: { description: 'url publik' } } } },
    '/api/ai/classify': { post: { tags: ['Media'], security: bearer, summary: 'Klasifikasi gambar via ML (proxy FastAPI)', requestBody: file, responses: { 200: { description: 'prediksi' }, 502: { description: 'ML down' } } } },
  },
};
