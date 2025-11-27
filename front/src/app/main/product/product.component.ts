import { Component, OnInit } from '@angular/core';
import { Product } from './models/product';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { ProductService } from './services/product.service';

@Component({
    templateUrl: './product.component.html',
    providers: [MessageService, ProductService]
})
export class ProductComponent implements OnInit {

    productDialog: boolean = false;
    deleteProductDialog: boolean = false;
    
    products: Product[] = [];
    product: Product = {};
    submitted: boolean = false;
    cols: any[] = [];
    rowsPerPageOptions = [5, 10, 20];

    constructor(
        private productService: ProductService, 
        private messageService: MessageService
    ) { }

    ngOnInit() {
        this.loadProducts();
        
        this.cols = [
            { field: 'name', header: 'Nome' },
            { field: 'price', header: 'Preço' },
            { field: 'stock', header: 'Estoque' },
            { field: 'description', header: 'Descrição' }
        ];
    }

    loadProducts() {
        this.productService.getProducts().then(data => {
            this.products = data;
        });
    }

    openNew() {
        this.product = {};
        this.submitted = false;
        this.productDialog = true;
    }

    editProduct(product: Product) {
        this.product = { ...product };
        this.productDialog = true;
    }

    deleteProduct(product: Product) {
        this.deleteProductDialog = true;
        this.product = { ...product };
    }

    confirmDelete() {
        this.deleteProductDialog = false;
        if (this.product.id) {
            this.productService.deleteProduct(this.product.id).subscribe(() => {
                this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Produto Deletado', life: 3000 });
                this.product = {};
                this.loadProducts();
            }, error => {
                this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao deletar', life: 3000 });
            });
        }
    }

    hideDialog() {
        this.productDialog = false;
        this.submitted = false;
    }

    saveProduct() {
        this.submitted = true;

        if (this.product.name?.trim()) {
            if (this.product.id) {
                this.productService.updateProduct(this.product).subscribe(() => {
                    this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Produto Atualizado', life: 3000 });
                    this.loadProducts();
                    this.productDialog = false;
                    this.product = {};
                });
            } else {
                this.productService.createProduct(this.product).subscribe(() => {
                    this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Produto Criado', life: 3000 });
                    this.loadProducts();
                    this.productDialog = false;
                    this.product = {};
                });
            }
        }
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }
}