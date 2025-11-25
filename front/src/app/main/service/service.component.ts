import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Service } from './models/service';
import { ServiceService } from './services/service.service';

@Component({
    templateUrl: './service.component.html',
    providers: [MessageService]
})
export class ServiceComponent implements OnInit {

    serviceDialog: boolean = false;
    deleteServiceDialog: boolean = false;
    services: Service[] = [];
    service: Service = {};
    selectedServices: Service[] = [];
    submitted: boolean = false;
    cols: any[] = [];
    rowsPerPageOptions = [5, 10, 20];

    constructor(private serviceService: ServiceService, private messageService: MessageService) { }

    ngOnInit() {
        this.loadServices();
        this.cols = [
            { field: 'id', header: 'ID' },
            { field: 'name', header: 'Nome' },
            { field: 'description', header: 'Descrição' },
            { field: 'price', header: 'Preço' }
        ];
    }

    loadServices() {
        this.serviceService.getServices().then(data => {
            this.services = data;
        });
    }

    openNew() {
        this.service = {};
        this.submitted = false;
        this.serviceDialog = true;
    }

    editService(service: Service) {
        this.service = { ...service };
        this.serviceDialog = true;
    }

    deleteService(service: Service) {
        this.deleteServiceDialog = true;
        this.service = { ...service };
    }

    confirmDelete() {
        this.deleteServiceDialog = false;
        if (this.service.id) {
            this.serviceService.deleteService(this.service.id).subscribe(() => {
                this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Serviço Deletado', life: 3000 });
                this.service = {};
                this.loadServices();
            }, error => {
                this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao deletar', life: 3000 });
            });
        }
    }

    hideDialog() {
        this.serviceDialog = false;
        this.submitted = false;
    }

    saveService() {
        this.submitted = true;

        if (this.service.name?.trim()) {
            if (this.service.id) {
                this.serviceService.updateService(this.service).subscribe(() => {
                    this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Serviço Atualizado', life: 3000 });
                    this.loadServices();
                    this.serviceDialog = false;
                    this.service = {};
                });
            } else {
                this.serviceService.createService(this.service).subscribe(() => {
                    this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Serviço Criado', life: 3000 });
                    this.loadServices();
                    this.serviceDialog = false;
                    this.service = {};
                });
            }
        }
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }
}