export interface Pet {
    id?: string;
    name?: string;
    species?: string;
    breed?: string;
    age?: number;
    tutor_id?: number; // ID do Tutor (FK)
}