import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild([
        { path: 'pet', loadChildren: () => import('./pet/pet.module').then(m => m.PetModule) },
        { path: 'tutor', loadChildren: () => import('./tutor/tutor.module').then(m => m.TutorModule) },
        { path: 'service', loadChildren: () => import('./service/service.module').then(m => m.ServiceModule) },
        { path: 'product', loadChildren: () => import('./product/product.module').then(m => m.ProductModule) },
        { path: 'agendamento', loadChildren: () => import('./agendamento/agendamento.module').then(m => m.AgendamentoModule) },
        { path: '**', redirectTo: '/notfound' }
    ])],
    exports: [RouterModule]
})
export class MainRoutingModule { }