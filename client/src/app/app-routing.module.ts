import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { HomeComponent } from "./app.component";
import { BirdSpeciesComponent } from "./bird-species/bird-species.component";
import { AddComponent } from "./add/add.component";
import { EditComponent } from "./edit/edit.component";

const routes: Routes = [
  { path: "app", component: HomeComponent },
  { path: "add", component: AddComponent },
  { path: "birdSpecies", component: BirdSpeciesComponent },
  { path: "edit", component: EditComponent },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }