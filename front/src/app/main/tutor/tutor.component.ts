import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Tutor } from './models/tutor';
import { TutorService } from './services/tutor.service';

@Component({
    templateUrl: './tutor.component.html',
    providers: [MessageService]
})
export class TutorComponent implements OnInit {

    tutorDialog: boolean = false;
    deleteTutorDialog: boolean = false;
    tutors: Tutor[] = [];
    tutor: Tutor = {};
    selectedTutors: Tutor[] = [];
    submitted: boolean = false;
    cols: any[] = [];
    rowsPerPageOptions = [5, 10, 20];

    constructor(private tutorService: TutorService, private messageService: MessageService) { }

    ngOnInit() {
        this.loadTutors();
        
        // Atualizado com a coluna Pets
        this.cols = [
            { field: 'id', header: 'ID' },
            { field: 'name', header: 'Nome' },
            { field: 'contact', header: 'Contato' },
            { field: 'address', header: 'Endereço' },
            { field: 'pets_names', header: 'Pets Associados' }
        ];
    }

    loadTutors() {
        this.tutorService.getTutors().then(data => {
            this.tutors = data;
        });
    }

    openNew() {
        this.tutor = {};
        this.submitted = false;
        this.tutorDialog = true;
    }

    editTutor(tutor: Tutor) {
        this.tutor = { ...tutor };
        this.tutorDialog = true;
    }

    deleteTutor(tutor: Tutor) {
        this.deleteTutorDialog = true;
        this.tutor = { ...tutor };
    }

    confirmDelete() {
        this.deleteTutorDialog = false;
        if (this.tutor.id) {
            this.tutorService.deleteTutor(this.tutor.id).subscribe(() => {
                this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Tutor Deletado', life: 3000 });
                this.tutor = {};
                this.loadTutors();
            }, error => {
                this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao deletar', life: 3000 });
            });
        }
    }

    hideDialog() {
        this.tutorDialog = false;
        this.submitted = false;
    }

    saveTutor() {
        this.submitted = true;

        if (this.tutor.name?.trim()) {
            if (this.tutor.id) {
                this.tutorService.updateTutor(this.tutor).subscribe(() => {
                    this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Tutor Atualizado', life: 3000 });
                    this.loadTutors();
                    this.tutorDialog = false;
                    this.tutor = {};
                });
            } else {
                if(this.tutor.contact === undefined || this.tutor.contact === null || this.tutor.contact.trim() === '') {
                    return;
                }
                this.tutorService.createTutor(this.tutor).subscribe(() => {
                    this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Tutor Criado', life: 3000 });
                    this.loadTutors();
                    this.tutorDialog = false;
                    this.tutor = {};
                });
            }
        }
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }
}