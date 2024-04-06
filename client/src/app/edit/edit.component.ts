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
        this.communicationService.getSpecie(scientificName).subscribe((specie: Especeoiseau) => {
          this.specie = specie;
        });
      }
    });
  }
  
  public changeSpecieCommonName(event: any, specie: Especeoiseau){
    const editField = event.target.textContent;
    specie.nomcommun = editField;
  }
  public changeSpecieStatus(event: any, specie: Especeoiseau){
    const editField = event.target.textContent;
    specie.statutspeces = editField;
  }
  public changeSpeciePredator(event: any, specie: Especeoiseau){
    console.log(event.target.textContent)
    const editField = event.target.textContent;
    specie.nomscientifiquecomsommer = editField;
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
