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

  public updateSpecie(specie: Especeoiseau): Observable<number> {
    return this.http
      .put<number>(this.BASE_URL + `/edit/${specie.nomscientifique}`, specie)
      .pipe(catchError(this.handleError<number>("updateHotel")));
  }
  public addSpecie(specie: Especeoiseau): Observable<number> {
    return this.http
      .post<number>(this.BASE_URL + `/add`, specie)
      .pipe(catchError(this.handleError<number>("addSpecie")));
  }

  public deleteSpecie(specie: Especeoiseau): Observable<any> {
    const options = {
      body: specie,
      options: { headers: { "Content-Type": "application/json" } },
    }
    return this.http
      .delete<any>(this.BASE_URL + `/birdSpecies`, options)
      .pipe(catchError(this.handleError<any>("deleteSpecie")));
  }
  public getSpecieData(scientificName: string): Observable<{specie: Especeoiseau, statuses: string[], predators: string[]}> {
    return this.http
      .get<{specie: Especeoiseau, statuses: string[], predators: string[]}>(this.BASE_URL + `/edit/${scientificName}`)
      .pipe(catchError(this.handleError<{specie: Especeoiseau, statuses: string[], predators: string[]}>("getSpecie")));
  }

  public getOptions(): Observable<string[]> {
    return this.http
      .get<string[]>(this.BASE_URL + `/add`)
      .pipe(catchError(this.handleError<string[]>("getStatusOptions")));
  }

  public deleteRoom(hotelNb: string, roomNb: string): Observable<number> {
    return this.http
      .post<number>(this.BASE_URL + `/rooms/delete/${hotelNb}/${roomNb}`, {})
      .pipe(catchError(this.handleError<number>("deleteRoom")));
  }

  private handleError<T>(
    request: string,
    result?: T
  ): (error: Error) => Observable<T> {
    return (error: Error): Observable<T> => {
      return of(result as T);
    };
  }
}
