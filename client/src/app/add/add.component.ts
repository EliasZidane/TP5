import { Component, OnInit } from "@angular/core";
import { Especeoiseau } from "../../../../common/tables/Especeoiseau";
// import { ActivatedRoute } from '@angular/router';
// import { HotelPK } from "../../../../common/tables/HotelPK";
// import { Room } from "../../../../common/tables/Room";
// import { Guest } from "../../../../common/tables/Guest";
import { CommunicationService } from "../communication.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-room",
  templateUrl: "./add.component.html",
  styleUrls: ["./add.component.css"],
})

export class AddComponent implements OnInit {
  statusId : number = 0;
  predatorId : number = 0;
  statusOptions:{id:number,name: string}[] = [
    {id: 0, name: 'Non menacée'},
    {id: 1, name: 'Préoccupation mineure'},
    {id: 2, name: 'Vulnérable'}
  ]
  predatorOptions:{id:number,name: string|null}[] = [];
  public specie: Especeoiseau = {
    nomscientifique: "",
    nomcommun: "",
    statutspeces: this.statusOptions[this.statusId].name,
    nomscientifiquecomsommer: "",
  
  };
  public duplicateError: boolean = false;
  public invalidSpeciePK: boolean = false;

  constructor(private communicationService: CommunicationService, private router: Router) {
  }

  public ngOnInit(): void {
    this.communicationService.getOptions().subscribe((predators: string[]) => {
      this.predatorOptions.push({ id: 0, name: null });
        const realOptions = predators.map((option, index) => ({
            id: index + 1,
            name: option,
        }));
        this.predatorOptions = this.predatorOptions.concat(realOptions);
                });
  }
  public changeSpecieScientificName(event: any, specie: Especeoiseau){
    event.stopPropagation();
    const editField = event.target.textContent;
    console.log("editfield",editField);
    specie.nomscientifique = editField;
    console.log("updated to",specie.nomscientifique);
  }
  public changeSpecieCommonName(event: any, specie: Especeoiseau){
    const editField = event.target.textContent;
    specie.nomcommun = editField;
  }
  statusChange(statusId: number) {
    this.specie.statutspeces = this.statusOptions[statusId].name;
  }
  predatorChange(predatorId: number) {
    this.specie.nomscientifiquecomsommer = this.predatorOptions[predatorId].name;
  }

  public addSpecie(specie: Especeoiseau)  {
    if (!specie.nomscientifique.match(/^[A-Za-zÀ-ÖØ-öø-ÿ]+$/) || specie.nomscientifique.length < 2 || specie.nomscientifique.length > 30){
      this.invalidSpeciePK = true;
      return;
    }
    this.communicationService.addSpecie(specie).subscribe((result: number) => {
      if (result === 0) {
        this.duplicateError = true;
      } else {
        this.router.navigate(["/birdSpecies"]);
        this.duplicateError = false;
      }
    });

  }
}
