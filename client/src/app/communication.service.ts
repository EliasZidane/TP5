import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
// tslint:disable-next-line:ordered-imports
import { of, Observable, Subject } from "rxjs";
import { catchError } from "rxjs/operators";
import { Especeoiseau } from "../../../common/tables/Especeoiseau";

@Injectable()
export class CommunicationService {
  private readonly BASE_URL: string = "http://localhost:3000/database";
  public constructor(private http: HttpClient) {}

  private _listners: any = new Subject<any>();

  public listen(): Observable<any> {
    return this._listners.asObservable();
  }

  public filter(filterBy: string): void {
    this._listners.next(filterBy);
  }

  public getSpecies(): Observable<Especeoiseau[]> {
    return this.http
      .get<Especeoiseau[]>(this.BASE_URL + "/birdSpecies")
      .pipe(catchError(this.handleError<Especeoiseau[]>("getSpecies")));
  }

  // public insertHotel(hotel: Especeoiseau): Observable<number> {
  //   return this.http
  //     .post<number>(this.BASE_URL + "/hotels/insert", hotel)
  //     .pipe(catchError(this.handleError<number>("insertHotel")));
  // }

  public updateSpecie(specie: Especeoiseau): Observable<number> {
    return this.http
      .put<number>(this.BASE_URL + `/edit/${specie.nomscientifique}`, specie)
      .pipe(catchError(this.handleError<number>("updateHotel")));
  }
  public addSpecie(specie: Especeoiseau): Observable<number> {
    console.log("Va add avec : ",specie.nomscientifique);
    return this.http
      .post<number>(this.BASE_URL + `/add`, specie)
      .pipe(catchError(this.handleError<number>("addSpecie")));
  }
  // public deleteHotel(hotelNb: string): Observable<number> {
  //   return this.http
  //     .post<number>(this.BASE_URL + "/hotels/delete/" + hotelNb, {})
  //     .pipe(catchError(this.handleError<number>("deleteHotel")));
  // }

  public deleteSpecie(specie: Especeoiseau): Observable<number> {
    console.log("Va delete ",specie.nomscientifique);
    return this.http
      .post<number>(this.BASE_URL + `/birdSpecies`, specie)
      .pipe(catchError(this.handleError<number>("deleteSpecie")));
  }
  public getSpecieData(scientificName: string): Observable<{specie: Especeoiseau, statuses: string[], predators: string[]}> {
    return this.http
      .get<{specie: Especeoiseau, statuses: string[], predators: string[]}>(this.BASE_URL + `/edit/${scientificName}`)
      .pipe(catchError(this.handleError<{specie: Especeoiseau, statuses: string[], predators: string[]}>("getSpecie")));
  }

  public getOptions(): Observable<{statuses:string[], predators: string[]}> {
    return this.http
      .get<{statuses:string[], predators: string[]}>(this.BASE_URL + `/add`)
      .pipe(catchError(this.handleError<{statuses:string[], predators: string[]}>("getStatusOptions")));
  }
  // public getRooms(hotelNb: string): Observable<Room[]> {
  //   return this.http
  //     .get<Room[]>(this.BASE_URL + `/rooms?hotelNb=${hotelNb}`)
  //     .pipe(catchError(this.handleError<Room[]>("getRooms")));
  // }

  // public insertRoom(room: Room): Observable<number> {
  //   return this.http
  //     .post<number>(this.BASE_URL + "/rooms/insert", room)
  //     .pipe(catchError(this.handleError<number>("inserHotel")));
  // }

  // public updateRoom(room: Room): Observable<number> {
  //   return this.http
  //     .put<number>(this.BASE_URL + "/rooms/update", room)
  //     .pipe(catchError(this.handleError<number>("updateRoom")));
  // }

  public deleteRoom(hotelNb: string, roomNb: string): Observable<number> {
    return this.http
      .post<number>(this.BASE_URL + `/rooms/delete/${hotelNb}/${roomNb}`, {})
      .pipe(catchError(this.handleError<number>("deleteRoom")));
  }

  // public getGuests(hotelNb: string, roomNb: string): Observable<Guest[]> {
  //   return this.http
  //     .get<Guest[]>(this.BASE_URL + `/guests/${hotelNb}/${roomNb}`)
  //     .pipe(catchError(this.handleError<Guest[]>("getGuests")));
  // }

  private handleError<T>(
    request: string,
    result?: T
  ): (error: Error) => Observable<T> {
    return (error: Error): Observable<T> => {
      return of(result as T);
    };
  }
}
