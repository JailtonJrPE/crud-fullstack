import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Agendamento } from './models/agendamento';
import { AgendamentoService } from './services/agendamento.service';
import { TutorService } from '../tutor/services/tutor.service';
import { PetService } from '../pet/services/pet.service';
import { ServiceService } from '../service/services/service.service';

@Component({
    templateUrl: './agendamento.component.html',
    providers: [MessageService, TutorService, PetService, ServiceService]
})
export class AgendamentoComponent implements OnInit {

    agendamentoDialog: boolean = false;
    deleteDialog: boolean = false;

    agendamentos: Agendamento[] = [];
    agendamento: Agendamento = {};

    tutors: any[] = [];
    pets: any[] = [];
    services: any[] = [];

    statuses: any[] = [
        { label: 'Agendado', value: 'Agendado' },
        { label: 'Confirmado', value: 'Confirmado' },
        { label: 'Concluído', value: 'Concluído' },
        { label: 'Cancelado', value: 'Cancelado' }
    ];

    submitted: boolean = false;
    cols: any[] = [];
    rowsPerPageOptions = [5, 10, 20];

    constructor(
        private agendamentoService: AgendamentoService,
        private tutorService: TutorService,
        private petService: PetService,
        private serviceService: ServiceService,
        private messageService: MessageService
    ) { }

    ngOnInit() {
        this.loadData();

        this.cols = [
            { field: 'id', header: 'ID' },
            { field: 'date', header: 'Data/Hora' },
            { field: 'tutor_name', header: 'Tutor' },
            { field: 'pet_name', header: 'Pet' },
            { field: 'service_name', header: 'Serviço' },
            { field: 'status', header: 'Status' }
        ];
    }

    loadData() {
        // Carrega TUDO de uma vez
        this.agendamentoService.getAgendamentos().then(data => this.agendamentos = data);
        this.tutorService.getTutors().then(data => this.tutors = data);
        this.petService.getPets().then(data => this.pets = data); // Volta a carregar todos os pets
        this.serviceService.getServices().then(data => this.services = data);
    }

    openNew() {
        this.agendamento = {};
        this.submitted = false;
        this.agendamentoDialog = true;
    }

    editAgendamento(app: Agendamento) {
        this.agendamento = { ...app };
        if(this.agendamento.date) {
            // @ts-ignore
            this.agendamento.date = new Date(this.agendamento.date);
        }
        // Garantir que o tutor seja definido com base no pet associado ao agendamento
        const petId = this.agendamento.pet_id;
        if (petId) {
            if (!this.pets || this.pets.length === 0) {
                this.petService.getPets().then(data => { this.pets = data; this.onPetChange(petId); });
            } else {
                this.onPetChange(petId);
            }
        }

        this.agendamentoDialog = true;
    }

    deleteAgendamento(app: Agendamento) {
        this.deleteDialog = true;
        this.agendamento = { ...app };
    }

    confirmDelete() {
        this.deleteDialog = false;
        if (this.agendamento.id) {
            this.agendamentoService.deleteAgendamento(this.agendamento.id).subscribe(() => {
                this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Deletado', life: 3000 });
                this.loadData();
                this.agendamento = {};
            });
        }
    }

    hideDialog() {
        this.agendamentoDialog = false;
        this.submitted = false;
    }

    saveAgendamento() {
        this.submitted = true;

        if (this.agendamento.tutor_id && this.agendamento.service_id) {
            if (this.agendamento.id) {
                this.agendamentoService.updateAgendamento(this.agendamento).subscribe(() => {
                    this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Atualizado', life: 3000 });
                    this.loadData();
                    this.agendamentoDialog = false;
                });
            } else {
                this.agendamentoService.createAgendamento(this.agendamento).subscribe(() => {
                    this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Criado', life: 3000 });
                    this.loadData();
                    this.agendamentoDialog = false;
                });
            }
        }
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    // Quando o usuário selecionar um Pet, definir automaticamente o tutor associado
    onPetChange(event: any) {
        // `event` pode ser o objeto do evento do PrimeNG ou diretamente o id
        const petId = (event && event.value !== undefined) ? event.value : event;
        if (!petId) {
            // @ts-ignore
            this.agendamento.tutor_id = undefined;
            return;
        }

        const pet = this.pets ? this.pets.find(p => p.id == petId) : null;
        if (pet && (pet as any).tutor_id !== undefined) {
            // @ts-ignore
            this.agendamento.tutor_id = (pet as any).tutor_id;
        } else {
            // Tentativa de recarregar pets caso não encontrado
            this.petService.getPets().then(data => {
                this.pets = data;
                const p = this.pets.find(x => x.id == petId);
                // @ts-ignore
                this.agendamento.tutor_id = p ? (p as any).tutor_id : undefined;
            });
        }
    }

    getTutorName(): string {
        // @ts-ignore
        const tutorId = this.agendamento ? this.agendamento.tutor_id : undefined;
        if (!tutorId) return '';
        const tutor = this.tutors ? this.tutors.find(t => t.id == tutorId) : null;
        return tutor ? (tutor as any).name : '';
    }
}
