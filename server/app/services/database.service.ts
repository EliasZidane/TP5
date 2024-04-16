import { injectable } from "inversify";
import * as pg from "pg";
import "reflect-metadata";
import { Especeoiseau } from "../../../common/tables/Especeoiseau";

@injectable()
export class DatabaseService {
  public connectionConfig: pg.ConnectionConfig = {
    user: "elias",
    database: "ornithologue_db",
    password: "zidane",
    port: 5432,
    host: "127.0.0.1",
    keepAlive: true,
  };

  public pool: pg.Pool = new pg.Pool(this.connectionConfig);


  public async filterSpecies(
    scientificName: string, commonName: string, status: string, predator: string
  ): Promise<pg.QueryResult> {
    const client = await this.pool.connect();

    const searchTerms: string[] = [];
    if (scientificName.length > 0) searchTerms.push(`scientificName = '${scientificName}'`);
    if (commonName.length > 0) searchTerms.push(`name = '${commonName}'`);
    if (status.length > 0) searchTerms.push(`status = '${status}'`);
    if (predator.length > 0) searchTerms.push(`predator = '${predator}'`);

    let queryText = "SELECT * FROM ornithologue_db.especeoiseau";
    if (searchTerms.length > 0)
      queryText += " WHERE " + searchTerms.join(" AND ");
    queryText += ";";

    const res = await client.query(queryText);
    client.release();
    return res;
  }
  public async getSpecieByName(scientificName: string): Promise<{specie: pg.QueryResult,predators: pg.QueryResult}> {
    const client = await this.pool.connect();

    const speciesQuery = `
        SELECT nomscientifique, nomcommun, statutspeces, nomscientifiquecomsommer 
        FROM ornithologue_db.especeoiseau 
        WHERE nomscientifique = $1;
    `;
    const speciesRes = await client.query(speciesQuery, [scientificName]);
    const predatorQuery = `
        SELECT DISTINCT nomscientifique 
        FROM ornithologue_db.especeoiseau;
    `;
    const predatorRes = await client.query(predatorQuery);
    client.release();
    const speciesData = {
      specie: speciesRes,
      predators: predatorRes,
  };
    return speciesData;
}



  


  public async updateSpecie(specie: Especeoiseau): Promise<pg.QueryResult> {
    const client = await this.pool.connect();
    try {
    let toUpdateValues: string[] = [];
    if (specie.nomcommun && specie.nomcommun.length > 0) toUpdateValues.push(`nomcommun = '${specie.nomcommun}'`);
    if (specie.statutspeces && specie.statutspeces.length > 0) toUpdateValues.push(`statutspeces = '${specie.statutspeces}'`);
    toUpdateValues.push( specie.nomscientifiquecomsommer? `nomscientifiquecomsommer = '${specie.nomscientifiquecomsommer}'` : `nomscientifiquecomsommer = null`);
      const query = `UPDATE ornithologue_db.especeoiseau SET ${toUpdateValues.join(
        ", "
      )} WHERE nomscientifique = '${specie.nomscientifique}';
      `;
      const result = await client.query(query);
      if (result.rowCount === 0) {
        throw new Error(`Specie ${specie.nomscientifique} not found`);
      }
      return result;
    } catch (error) {
      throw new Error(`Error updating Specie: ${error}`);
    }
  }

  public async getOptions(): Promise<pg.QueryResult> {
    const client = await this.pool.connect();
    const predatorQuery = `
        SELECT DISTINCT nomscientifique 
        FROM ornithologue_db.especeoiseau;
    `;
    const predatorRes = await client.query(predatorQuery);
    client.release();
    return predatorRes;
  }
  

  public async addSpecie(specie: Especeoiseau): Promise<pg.QueryResult> {
    const client = await this.pool.connect();
    try {
        let columns: string[] = [];
        let values: string[] = [];

        if (specie.nomscientifique) {
            columns.push("nomscientifique");
            values.push(`'${specie.nomscientifique}'`);
        }
        if (specie.nomcommun) {
            columns.push("nomcommun");
            values.push(`'${specie.nomcommun}'`);
        }
        if (specie.statutspeces) {
            columns.push("statutspeces");
            values.push(`'${specie.statutspeces}'`);
        }
        if (specie.nomscientifiquecomsommer) {
            columns.push("nomscientifiquecomsommer");
            values.push(`'${specie.nomscientifiquecomsommer}'`);
        } else {
            columns.push("nomscientifiquecomsommer");
            values.push(`NULL`);
        }
        const query = `INSERT INTO ornithologue_db.especeoiseau (${columns.join(", ")}) VALUES (${values.join(", ")});`;
        const res = await client.query(query);
    client.release();
    return res;
    } catch (error) {
        client.release();
        throw new Error(`Error adding Specie: ${error}`);
    }
}

public async deleteSpecie(scientificName: string): Promise<pg.QueryResult> {
  if (scientificName.length === 0) throw new Error("Invalid delete query");
  const client = await this.pool.connect();
  await client.query(`DELETE FROM ornithologue_db.resider WHERE nomscientifique = '${scientificName}';`);
  await client.query(`DELETE FROM ornithologue_db.observation WHERE nomscientifique = '${scientificName}';`);
  await client.query(`UPDATE ornithologue_db.especeoiseau SET nomscientifiquecomsommer = NULL WHERE nomscientifiquecomsommer = '${scientificName}';`);

  const res = await client.query(`DELETE FROM ornithologue_db.especeoiseau WHERE nomscientifique = '${scientificName}';`);
  
  client.release();
  return res;
}
}
