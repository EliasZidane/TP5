import { Component, OnInit } from "@angular/core";
import { Especeoiseau } from "../../../../common/tables/Especeoiseau";
// import { ActivatedRoute } from '@angular/router';
// import { HotelPK } from "../../../../common/tables/HotelPK";
// import { Room } from "../../../../common/tables/Room";
// import { Guest } from "../../../../common/tables/Guest";
import { CommunicationService } from "../communication.service";

@Component({
  selector: "app-room",
  templateUrl: "./add.component.html",
  styleUrls: ["./add.component.css"],
})

export class AddComponent implements OnInit {
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
  constructor(private communicationService: CommunicationService) {
  }

  public ngOnInit(): void {
    // this.route.paramMap.subscribe(params => {
    //   const scientificName = params.get('nomscientifique');
    //   if (scientificName) {
    //     this.communicationService.getSpecieData(scientificName).subscribe((specieData:{specie: Especeoiseau, statusOptions: string[], predatorOptions: string[]}) => {
    //       this.specie = specieData.specie;
    //     });
    //   }
    // });
  }
  public changeSpecieScientificName(event: any, specie: Especeoiseau){
    const editField = event.target.textContent;
    specie.nomscientifique = editField;
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
    const editField = event.target.textContent;
    specie.nomscientifiquecomsommer = editField;
}
  

  public addSpecie(specie: Especeoiseau)  {
    if (specie.nomscientifiquecomsommer === "") {
      specie.nomscientifiquecomsommer = null;
    }
    if (specie.nomcommun === "") {
      specie.nomcommun = null;
    }
    if (specie.nomcommun === "") {
      specie.nomcommun = null;
    }
    console.log(specie);
    this.communicationService.addSpecie(specie).subscribe((result: number) => {
      if (result === 0) {
        this.duplicateError = true;
      } else {
        this.duplicateError = false;
      }
    });

  }
}



//   public updateSelectedHotel(hotelID: any) {
//     // this.selectedHotel = this.hotelPKs[hotelID];
//     // this.getRooms();
//     // this.refresh();
//   }

//   public getRooms(): void {
//     // this.communicationService
//     //   .getRooms(this.selectedHotel.hotelnb)
//     //   .subscribe((rooms: Room[]) => {
//     //     this.rooms = rooms;
//     //   });
//   }

//   private refresh() {
//     this.getRooms();
//     this.newRoomNb.nativeElement.innerText = "";
//     this.newRoomType.nativeElement.innerText = "";
//     this.newRoomPrice.nativeElement.innerText = "";
//   }

//   public changeRoomType(event: any, i: number) {
//     // const editField = event.target.textContent;
//     // this.rooms[i].type = editField;
//   }

//   public changeRoomPrice(event: any, i: number) {
//     // const editField = event.target.textContent;
//     // this.rooms[i].price = editField;
//   }

//   public deleteRoom(hotelNb: string, roomNb: string) {
//     this.communicationService
//       .deleteRoom(hotelNb, roomNb)
//       .subscribe((res: any) => {
//         this.refresh();
//       });
//   }

//   public insertRoom(): void {
//     // const room: Room = {
//     //   hotelnb: this.selectedHotel.hotelnb,
//     //   roomnb: this.newRoomNb.nativeElement.innerText,
//     //   type: this.newRoomType.nativeElement.innerText,
//     //   price: this.newRoomPrice.nativeElement.innerText,
//     // };

//     // this.communicationService.insertRoom(room).subscribe((res: number) => {
//     //   this.refresh();
//     // });
//   }

//   public updateRoom(i: number) {
//     // this.communicationService
//     //   .updateRoom(this.rooms[i])
//     //   .subscribe((res: any) => {
//     //     this.refresh();
//     //   });
//   }
// 
