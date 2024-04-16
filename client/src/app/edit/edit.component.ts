import { Component, OnInit } from "@angular/core";
import { Especeoiseau } from "../../../../common/tables/Especeoiseau";
import { ActivatedRoute, Router } from '@angular/router';
import { CommunicationService } from "../communication.service";

@Component({
  selector: "app-room",
  templateUrl: "./edit.component.html",
  styleUrls: ["./edit.component.css"],
})
export class EditComponent implements OnInit {
  statusId : number;
  predatorId : number;
  statusOptions:{id:number,name: string}[] = [
    {id: 0, name: 'Non menacée'},
    {id: 1, name: 'Préoccupation mineure'},
    {id: 2, name: 'Vulnérable'}
  ]
  predatorOptions:{id:number,name: string|null}[] = [];
  public specie: Especeoiseau = {
    nomscientifique: "",
    nomcommun: "",
    statutspeces: "",
    nomscientifiquecomsommer: "",
  
  };
  public duplicateError: boolean = false;
  public invalidSpeciePK: boolean = false;

  constructor(private route: ActivatedRoute,  private router: Router,private communicationService: CommunicationService) {
  }

  public ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const scientificName = params.get('nomscientifique');
      if (scientificName) {
        this.communicationService.getSpecieData(scientificName).subscribe((specieData:{specie: Especeoiseau, statuses: string[], predators: string[]}) => {
        
          this.specie = specieData.specie;
          this.predatorOptions = specieData.predators.map((option, index) => ({
            id: index,
            name: option,
        }));
        this.predatorOptions.push({id: this.predatorOptions.length, name: null});
        this.statusId = this.statusOptions.findIndex((option) => option.name === this.specie.statutspeces);
        this.predatorId = this.predatorOptions.findIndex((option) => option.name === this.specie.nomscientifiquecomsommer);
        });
      }
    });
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
  

  public updateSpecie(specie: Especeoiseau)  {
    if (!specie.nomscientifique.match(/^[A-Za-zÀ-ÖØ-öø-ÿ]+$/) || !specie.nomcommun.match(/^[A-Za-zÀ-ÖØ-öø-ÿ]+$/)|| specie.nomscientifique.length < 2 || specie.nomscientifique.length > 30){
      this.invalidSpeciePK = true;
      return;
    }
    this.communicationService.updateSpecie(specie).subscribe((result: number) => {
      if (result === 0) {
        this.duplicateError = true;
      } else {
        this.duplicateError = false;
      }
      this.router.navigate(["/birdSpecies"]);
    });

  }
}
