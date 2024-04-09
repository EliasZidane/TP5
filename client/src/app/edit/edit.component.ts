import { Component, OnInit } from "@angular/core";
import { Especeoiseau } from "../../../../common/tables/Especeoiseau";
import { ActivatedRoute } from '@angular/router';
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
  status : string;
  predator : string;
  statusOptions: string[] = [];
predatorOptions: string[] = [];
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
  constructor(private route: ActivatedRoute, private communicationService: CommunicationService) {
  }

  public ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const scientificName = params.get('nomscientifique');
      if (scientificName) {
        this.communicationService.getSpecieData(scientificName).subscribe((specieData:{specie: Especeoiseau, statusOptions: string[], predatorOptions: string[]}) => {
          console.log(specieData)
          this.specie = specieData.specie;
          this.statusOptions = specieData.statusOptions;
          this.predatorOptions = specieData.predatorOptions;
        });
      }
    });
  }
  
  public changeSpecieCommonName(event: any, specie: Especeoiseau){
    const editField = event.target.textContent;
    specie.nomcommun = editField;
  }
  statusChange(status: string) {
    this.specie.statutspeces = status;
  }
  predatorChange(predator: string) {
    this.specie.nomscientifiquecomsommer = predator;
  }
  

  public updateSpecie(specie: Especeoiseau)  {
    console.log(specie.nomscientifiquecomsommer)
    if (specie.nomscientifiquecomsommer === "") {
      specie.nomscientifiquecomsommer = null;
    }
    console.log(specie);
    this.communicationService.updateSpecie(specie).subscribe((result: number) => {
      if (result === 0) {
        this.duplicateError = true;
      } else {
        this.duplicateError = false;
        // this.selectedHotel = hotel;
        // this.getRooms();
      }
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
