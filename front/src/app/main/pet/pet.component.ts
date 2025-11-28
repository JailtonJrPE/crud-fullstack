import { Component, OnInit } from '@angular/core';
import { Pet } from './models/pet';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { PetService } from './services/pet.service';
import { TutorService } from '../tutor/services/tutor.service';

@Component({
    templateUrl: './pet.component.html',
    providers: [MessageService, TutorService]
})
export class PetComponent implements OnInit {

    petDialog: boolean = false;
    deletePetDialog: boolean = false;
    deletePetsDialog: boolean = false;

    pets: Pet[] = [];
    tutors: any[] = []; // Lista de tutores carregada do backend

    pet: Pet = {};
    selectedPets: Pet[] = [];
    submitted: boolean = false;
    cols: any[] = [];
    rowsPerPageOptions = [5, 10, 20];

    constructor(
        private petService: PetService,
        private tutorService: TutorService,
        private messageService: MessageService
    ) { }

    ngOnInit() {
        this.loadPets();
        this.loadTutors(); // Carrega os tutores assim que a tela abre

        this.cols = [
            { field: 'id', header: 'ID' },
            { field: 'name', header: 'Nome' },
            { field: 'species', header: 'Espécie' },
            { field: 'breed', header: 'Raça' },
            { field: 'age', header: 'Idade' },
            { field: 'tutor_id', header: 'Tutor' }
        ];
    }

    loadPets() {
        this.petService.getPets().then(data => {
            this.pets = data;
        });
    }

    // Busca os tutores do serviço
    loadTutors() {
        this.tutorService.getTutors().then(data => {
            this.tutors = data;
        });
    }

    // FUNÇÃO NOVA: Recebe o ID e retorna o Nome do Tutor
    getTutorName(id: number): string {
        if (!this.tutors || !id) return 'Não informado';
        const tutor = this.tutors.find(t => t.id === id);
        return tutor ? tutor.name : 'ID: ' + id;
    }

    openNew() {
        this.pet = {};
        this.submitted = false;
        this.petDialog = true;
    }

    deleteSelectedPets() {
        this.deletePetsDialog = true;
    }

    editPet(pet: Pet) {
        this.pet = { ...pet };
        this.petDialog = true;
    }

    deletePet(pet: Pet) {
        this.deletePetDialog = true;
        this.pet = { ...pet };
    }

    confirmDelete() {
        this.deletePetDialog = false;
        if (this.pet.id) {
            this.petService.deletePet(this.pet.id).subscribe(() => {
                this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Pet Deletado', life: 3000 });
                this.pet = {};
                this.loadPets();
            }, error => {
                this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao deletar', life: 3000 });
            });
        }
    }

    hideDialog() {
        this.petDialog = false;
        this.submitted = false;
    }

    savePet() {
        this.submitted = true;

        if (this.pet.name?.trim()) {
            if (this.pet.id) {
                this.petService.updatePet(this.pet).subscribe(() => {
                    this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Pet Atualizado', life: 3000 });
                    this.loadPets();
                    this.petDialog = false;
                    this.pet = {};
                }, error => {
                    console.error(error);
                    this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao atualizar', life: 3000 });
                });
            } else {
                this.petService.createPet(this.pet).subscribe(() => {
                    this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Pet Criado', life: 3000 });
                    this.loadPets();
                    this.petDialog = false;
                    this.pet = {};
                }, error => {
                    console.error(error);
                    this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao criar', life: 3000 });
                });
            }
        }
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }
}