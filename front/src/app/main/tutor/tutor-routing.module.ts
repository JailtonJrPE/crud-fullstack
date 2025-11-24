import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TutorComponent } from './tutor.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: TutorComponent }
    ])],
    exports: [RouterModule]
})
export class TutorRoutingModule { }