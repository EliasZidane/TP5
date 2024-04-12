import { Component, OnInit } from "@angular/core";
import { Especeoiseau } from "../../../../common/tables/Especeoiseau";
import { ActivatedRoute, Router } from '@angular/router';
// import { HotelPK } from "../../../../common/tables/HotelPK";
// import { Room } from "../../../../common/tables/Room";
// import { Guest } from "../../../../common/tables/Guest";
import { CommunicationService } from "../communication.service";

@Component({
  selector: "app-room",
  templateUrl: "./edit.component.html",
  styleUrls: ["./edit.component.css"],
})
export class EditComponent implements OnInit {
  // public rooms: Room[] = [];
  // public guests: Guest[] = [];
  statusId : number;
  predatorId : number;
  statusOptions:{id:number,name: string}[] = [];
  predatorOptions:{id:number,name: string|null}[] = [];
  public specie: Especeoiseau = {
    nomscientifique: "",
    nomcommun: "",
    statutspeces: "",
    nomscientifiquecomsommer: "",
  
  };
  public duplicateError: boolean = false;
  public invalidSpeciePK: boolean = false;

  // public selectedHotel: HotelPK = {
  //   hotelnb: "-1",
  //   name: "placeholderHotel",
  // };

  
  // public selectedRoom: Room = {
  //   hotelnb: "-1",
  //   roomnb: "-1",
  //   type: "",
  //   price: 0
  // }
  constructor(private route: ActivatedRoute,  private router: Router,private communicationService: CommunicationService) {
  }

  public ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const scientificName = params.get('nomscientifique');
      if (scientificName) {
        this.communicationService.getSpecieData(scientificName).subscribe((specieData:{specie: Especeoiseau, statuses: string[], predators: string[]}) => {
          console.log("recu après requete",specieData)
          this.specie = specieData.specie;
          this.statusOptions = specieData.statuses.map((option, index) => ({
            id: index,
            name: option,
        }));
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
    console.log("Va update avec : ",specie)
    this.communicationService.updateSpecie(specie).subscribe((result: number) => {
      if (result === 0) {
        this.duplicateError = true;
      } else {
        this.duplicateError = false;
      }
      this.router.navigate(["/birdSpecies"]);
    });

  }

  public updateSelectedRoom(roomID: any) {
    // this.selectedRoom = this.rooms[roomID];
    this.refresh();
  }

  public getRooms(): void {
    // this.communicationService
    //   .getRooms(this.selectedHotel.hotelnb)
    //   .subscribe((rooms: Room[]) => {
    //     this.rooms = rooms;
    //     this.selectedRoom = this.rooms[0];
    //   });
  }

  private refresh() {
    this.getGuests();
  }

  public getGuests(): void {
    // this.communicationService
    //   .getGuests(this.selectedHotel.hotelnb, this.selectedRoom.roomnb)
    //   .subscribe((guests: Guest[]) => {
    //     this.guests = guests;
      // });
  }
}
