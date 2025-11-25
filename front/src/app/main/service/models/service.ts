// Arquivo: front/src/app/main/service/models/service.ts

export interface Service {
    id?: number;
    name?: string;
    description?: string;
    price?: number; // Preço como REAL no banco, number no TS
}