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
}