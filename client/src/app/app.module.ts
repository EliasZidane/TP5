import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { AppRoutingModule } from "./app-routing.module";
import { HomeComponent } from "./app.component";
import { CommunicationService } from "./communication.service";
import { EditComponent } from "./edit/edit.component";
import { BirdSpeciesComponent } from "./bird-species/bird-species.component";
import { AddComponent } from "./add/add.component";

@NgModule({
  declarations: [
    HomeComponent,
    AddComponent,
    BirdSpeciesComponent,
    EditComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [CommunicationService],
  bootstrap: [HomeComponent],
})
export class AppModule { }
