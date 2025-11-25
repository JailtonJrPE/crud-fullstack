// Arquivo: front/src/app/main/service/service.component.ts

import { Component, OnInit } from '@angular/core';
import { Service } from './models/service';
import { ServiceService } from './services/service.service';
import { MessageService, ConfirmationService } from 'primeng/api';

@Component({
    templateUrl: './service.component.html',
    providers: [MessageService, ConfirmationService],
    styleUrls: [] // Adicione o arquivo CSS se necessário
})
export class ServiceComponent implements OnInit {

    services: Service[] = [];
    service: Service = {};
    serviceDialog: boolean = false;
    deleteServiceDialog: boolean = false;
    submitted: boolean = false;

    constructor(
        private serviceService: ServiceService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) { }

    ngOnInit() {
        this.loadServices();
    }

    loadServices() {
        this.serviceService.getServices().subscribe(
            (response) => {
                this.services = response.services;
            },
            (error) => {
                console.error('Erro ao carregar serviços:', error);
                this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao carregar serviços', life: 3000 });
            }
        );
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
        this.confirmationService.confirm({
            message: 'Tem certeza que deseja excluir o serviço ' + service.name + '?',
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.serviceService.deleteService(service.id!).subscribe(
                    () => {
                        this.services = this.services.filter(val => val.id !== service.id);
                        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Serviço Excluído', life: 3000 });
                    },
                    (error) => {
                        console.error('Erro ao excluir serviço:', error);
                        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Não foi possível excluir o serviço', life: 3000 });
                    }
                );
            }
        });
    }

    hideDialog() {
        this.serviceDialog = false;
        this.submitted = false;
    }

    saveService() {
        this.submitted = true;

        if (this.service.name?.trim() && this.service.description?.trim() && this.service.price! > 0) {
            if (this.service.id) {
                // UPDATE
                this.serviceService.updateService(this.service.id, this.service).subscribe(
                    () => {
                        this.loadServices();
                        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Serviço Atualizado', life: 3000 });
                        this.serviceDialog = false;
                        this.service = {};
                    },
                    (error) => {
                        console.error('Erro ao atualizar serviço:', error);
                        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Não foi possível atualizar o serviço', life: 3000 });
                    }
                );
            } else {
                // CREATE
                this.serviceService.createService(this.service).subscribe(
                    (response) => {
                        this.services.push(response.service);
                        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Serviço Criado', life: 3000 });
                        this.serviceDialog = false;
                        this.service = {};
                    },
                    (error) => {
                        console.error('Erro ao criar serviço:', error);
                        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Não foi possível criar o serviço', life: 3000 });
                    }
                );
            }
        }
    }
}