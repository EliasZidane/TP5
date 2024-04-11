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
  // @ViewChild("newHotelNb") newHotelNb: ElementRef;
  // @ViewChild("newHotelName") newHotelName: ElementRef;
  // @ViewChild("newHotelCity") newHotelCity: ElementRef;

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

  public deleteBird(scientificName: string) {
    this.communicationService.deleteBird(scientificName).subscribe((res: any) => {
      
    });
  }
  public editBird(scientificName: string) {
    // console.log("editBird", scientificName);
    this.router.navigate([`/edit/${scientificName}`]);

  }

  // public insertHotel(): void {
  //   const hotel: any = {
  //     hotelnb: this.newHotelNb.nativeElement.innerText,
  //     name: this.newHotelName.nativeElement.innerText,
  //     city: this.newHotelCity.nativeElement.innerText,

  //   };

  //   this.communicationService.insertHotel(hotel).subscribe((res: number) => {
  //     if (res > 0) {
  //       this.communicationService.filter("update");
  //     }
  //     this.refresh();
  //     this.duplicateError = res === -1;
  //   });
  // }

  // private refresh() {
    // this.getSpecies();
    // this.newHotelNb.nativeElement.innerText = "";
    // this.newHotelName.nativeElement.innerText = "";
    // this.newHotelCity.nativeElement.innerText = "";
  // }

  // public deleteHotel(hotelNb: string) {
  //   this.communicationService.deleteHotel(hotelNb).subscribe((res: any) => {
  //     this.refresh();
  //   });
  // }

  // public changeHotelName(event: any, i:number){
  //   const editField = event.target.textContent;
  //   this.species[i]. = editField;
  // }

  // public changeHotelCity(event: any, i:number){
  //   const editField = event.target.textContent;
  //   this.species[i].city = editField;
  // }

  // public updateHotel(i: number) {
  //   this.communicationService.updateHotel(this.species[i]).subscribe((res: any) => {
  //     this.refresh();
  //   });
  // }
}
