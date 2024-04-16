import { Component} from "@angular/core";
import { Especeoiseau } from "../../../../common/tables/Especeoiseau";
import { CommunicationService } from "../communication.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-hotel",
  templateUrl: "./bird-species.component.html",
  styleUrls: ["./bird-species.component.css"],
})
export class BirdSpeciesComponent {
  public species: Especeoiseau[] = [];
  public duplicateError: boolean = false;
  public constructor(private communicationService: CommunicationService, 
    private router: Router
  ) {}

  public ngOnInit(): void {
    this.getSpecies();
  }

  public getSpecies(): void {
    this.communicationService.getSpecies().subscribe((species: Especeoiseau[]) => {
      this.species = species;
    });
  }

  public deleteBird(specie: Especeoiseau) {
    this.communicationService.deleteSpecie(specie).subscribe((res: number) => {
      if (res === 0) {
        this.duplicateError = true;
      } else {
        this.refresh();
        this.duplicateError = false;
      }
    });
  }
  public editBird(scientificName: string) {
    this.router.navigate([`/edit/${scientificName}`]);

  }

  private refresh() {
    this.getSpecies();
  }
}
