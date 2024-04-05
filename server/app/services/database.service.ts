import { injectable } from "inversify";
import * as pg from "pg";
import "reflect-metadata";
import { Room } from "../../../common/tables/Room";
import { Hotel } from "../../../common/tables/Hotel";
import { Gender, Guest } from "../../../common/tables/Guest";

@injectable()
export class DatabaseService {
  // TODO: A MODIFIER POUR VOTRE BD
  public connectionConfig: pg.ConnectionConfig = {
    user: "postgres",
    database: "postgres",
    password: "mysecretpassword",
    port: 5432,
    host: "127.0.0.1",
    keepAlive: true,
  };

  public pool: pg.Pool = new pg.Pool(this.connectionConfig);

  // ======= DEBUG =======
  public async getAllFromTable(tableName: string): Promise<pg.QueryResult> {
    const client = await this.pool.connect();
    const res = await client.query(`SELECT * FROM ornithologue_bd.${tableName};`);
    client.release();
    return res;
  }

  // ======= HOTEL =======
  public async createHotel(hotel: Hotel): Promise<pg.QueryResult> {
    const client = await this.pool.connect();

    if (!hotel.scientificName || !hotel.name || !hotel.status)
      throw new Error("Invalid create hotel values");

    const values: string[] = [hotel.scientificName, hotel.name, hotel.status];
    const queryText: string = `INSERT INTO ornithologue_bd.Hotel VALUES($1, $2, $3);`;

    const res = await client.query(queryText, values);
    client.release();
    return res;
  }

  // get hotels that correspond to certain caracteristics
  public async filterSpecies(
    scientificName: string, commonName: string, status: string, predator: string
  ): Promise<pg.QueryResult> {
    const client = await this.pool.connect();

    const searchTerms: string[] = [];
    if (scientificName.length > 0) searchTerms.push(`scientificName = '${scientificName}'`);
    if (commonName.length > 0) searchTerms.push(`name = '${commonName}'`);
    if (status.length > 0) searchTerms.push(`status = '${status}'`);
    if (predator.length > 0) searchTerms.push(`predator = '${predator}'`);

    let queryText = "SELECT * FROM ornithologue_bd.Hotel";
    if (searchTerms.length > 0)
      queryText += " WHERE " + searchTerms.join(" AND ");
    queryText += ";";

    const res = await client.query(queryText);
    client.release();
    return res;
  }

  // get the hotel names and numbers so so that the user can only select an existing hotel
  public async getcommonNamesByNos(): Promise<pg.QueryResult> {
    const client = await this.pool.connect();
    const res = await client.query("SELECT scientificName, name FROM ornithologue_bd.Hotel;");
    client.release();
    return res;
  }

  // modify name or status of a hotel
  public async updateHotel(hotel: Hotel): Promise<pg.QueryResult> {
    const client = await this.pool.connect();

    let toUpdateValues = [];

    if (hotel.name.length > 0) toUpdateValues.push(`name = '${hotel.name}'`);
    if (hotel.status.length > 0) toUpdateValues.push(`status = '${hotel.status}'`);

    if (
      !hotel.scientificName ||
      hotel.scientificName.length === 0 ||
      toUpdateValues.length === 0
    )
      throw new Error("Invalid hotel update query");

    const query = `UPDATE ornithologue_bd.Hotel SET ${toUpdateValues.join(
      ", "
    )} WHERE scientificName = '${hotel.scientificName}';`;
    const res = await client.query(query);
    client.release();
    return res;
  }

  public async deleteHotel(scientificName: string): Promise<pg.QueryResult> {
    if (scientificName.length === 0) throw new Error("Invalid delete query");

    const client = await this.pool.connect();
    const query = `DELETE FROM ornithologue_bd.Hotel WHERE scientificName = '${scientificName}';`;

    const res = await client.query(query);
    client.release();
    return res;
  }

  // ======= ROOMS =======
  public async createRoom(room: Room): Promise<pg.QueryResult> {
    const client = await this.pool.connect();

    if (!room.roomnb || !room.scientificName || !room.type || !room.price)
      throw new Error("Invalid create room values");

    const values: string[] = [
      room.roomnb,
      room.scientificName,
      room.type,
      room.price.toString(),
    ];
    const queryText: string = `INSERT INTO ornithologue_bd.ROOM VALUES($1, $2, $3, $4);`;

    const res = await client.query(queryText, values);
    client.release();
    return res;
  }

  public async filterRooms(
    scientificName: string,
    roomNb: string = "",
    roomType: string = "",
    price: number = -1
  ): Promise<pg.QueryResult> {
    const client = await this.pool.connect();

    if (!scientificName || scientificName.length === 0)
      throw new Error("Invalid filterRooms request");

    let searchTerms = [];
    searchTerms.push(`scientificName = '${scientificName}'`);

    if (roomNb.length > 0) searchTerms.push(`scientificName = '${scientificName}'`);
    if (roomType.length > 0) searchTerms.push(`type = '${roomType}'`);
    if (price >= 0) searchTerms.push(`price = ${price}`);

    let queryText = `SELECT * FROM ornithologue_bd.Room WHERE ${searchTerms.join(
      " AND "
    )};`;
    const res = await client.query(queryText);
    client.release();
    return res;
  }

  public async updateRoom(room: Room): Promise<pg.QueryResult> {
    const client = await this.pool.connect();

    let toUpdateValues = [];
    if (room.price >= 0) toUpdateValues.push(`price = ${room.price}`);
    if (room.type.length > 0) toUpdateValues.push(`type = '${room.type}'`);

    if (
      !room.scientificName ||
      room.scientificName.length === 0 ||
      !room.roomnb ||
      room.roomnb.length === 0 ||
      toUpdateValues.length === 0
    )
      throw new Error("Invalid room update query");

    const query = `UPDATE ornithologue_bd.Room SET ${toUpdateValues.join(
      ", "
    )} WHERE scientificName = '${room.scientificName}' AND roomNb = '${room.roomnb}';`;
    const res = await client.query(query);
    client.release();
    return res;
  }

  public async deleteRoom(
    scientificName: string,
    roomNb: string
  ): Promise<pg.QueryResult> {
    if (scientificName.length === 0) throw new Error("Invalid room delete query");
    const client = await this.pool.connect();

    const query = `DELETE FROM ornithologue_bd.Room WHERE scientificName = '${scientificName}' AND roomNb = '${roomNb}';`;
    const res = await client.query(query);
    client.release();
    return res;
  }

  // ======= GUEST =======
  public async createGuest(guest: Guest): Promise<pg.QueryResult> {
    const client = await this.pool.connect();
    if (
      !guest.guestnb ||
      !guest.nas ||
      !guest.name ||
      !guest.gender ||
      !guest.status
    )
      throw new Error("Invalid create room values");

    if (!(guest.gender in Gender))
      throw new Error("Unknown guest gender passed");

    const values: string[] = [
      guest.guestnb,
      guest.nas,
      guest.name,
      guest.gender,
      guest.status,
    ];
    const queryText: string = `INSERT INTO ornithologue_bd.Guest VALUES($1, $2, $3, $4, $5);`;
    const res = await client.query(queryText, values);
    client.release();
    return res;
  }

  public async getGuests(
    scientificName: string,
    roomNb: string
  ): Promise<pg.QueryResult> {
    if (!scientificName || scientificName.length === 0)
      throw new Error("Invalid guest hotel no");

    const client = await this.pool.connect();
    const queryExtension = roomNb ? ` AND b.roomNb = '${roomNb}'` : "";
    const query: string = `SELECT * FROM ornithologue_bd.Guest g JOIN ornithologue_bd.Booking b ON b.guestNb = g.guestNb WHERE b.scientificName = '${scientificName}'${queryExtension};`;

    const res = await client.query(query);
    client.release();
    return res;
  }

  // ======= BOOKING =======
  public async createBooking(
    scientificName: string,
    guestNo: string,
    dateFrom: Date,
    dateTo: Date,
    roomNb: string
  ): Promise<pg.QueryResult> {
    const client = await this.pool.connect();
    const values: string[] = [
      scientificName,
      guestNo,
      dateFrom.toString(),
      dateTo.toString(),
      roomNb,
    ];
    const queryText: string = `INSERT INTO ornithologue_bd.ROOM VALUES($1,$2,$3,$4,$5);`;

    const res = await client.query(queryText, values);
    client.release();
    return res;
  }
}