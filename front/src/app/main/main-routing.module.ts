import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild([
        { path: 'pet', loadChildren: () => import('./pet/pet.module').then(m => m.PetModule) },
        { path: 'tutor', loadChildren: () => import('./tutor/tutor.module').then(m => m.TutorModule) }, // <--- LINHA NOVA
        { path: '**', redirectTo: '/notfound' }
    ])],
    exports: [RouterModule]
})
export class MainRoutingModule { }