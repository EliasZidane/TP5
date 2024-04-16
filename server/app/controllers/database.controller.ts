import { NextFunction, Request, Response, Router } from "express";
import { inject, injectable } from "inversify";
import * as pg from "pg";

import { Especeoiseau } from "../../../common/tables/Especeoiseau";

import { DatabaseService } from "../services/database.service";
import Types from "../types";

@injectable()
export class DatabaseController {
  public constructor(
    @inject(Types.DatabaseService) private databaseService: DatabaseService
  ) {}

  public get router(): Router {
    const router: Router = Router();

    router.get("/birdSpecies", (req: Request, res: Response, _: NextFunction) => {
      var scientificName = req.params.scientificName ? req.params.scientificName : "";
      var commonName = req.params.commonName ? req.params.commonName : "";
      var status = req.params.status ? req.params.status : "";
      var predator = req.params.predator ? req.params.predator : "";

      this.databaseService
        .filterSpecies(scientificName, commonName, status, predator)
        .then((result: pg.QueryResult) => {
          const species: Especeoiseau[] = result.rows.map((espece: Especeoiseau) => ({
            nomscientifique: espece.nomscientifique,
            nomcommun: espece.nomcommun,
            statutspeces: espece.statutspeces,
            nomscientifiquecomsommer: espece.nomscientifiquecomsommer,
          }));
          res.json(species);
        })
        .catch((e: Error) => {
          console.error(e.stack);
        });
    });

    router.get(
      "/edit/:scientificName",
      (req: Request, res: Response, _: NextFunction) => {
        var scientificName = req.params.scientificName ? req.params.scientificName : "";
        this.databaseService
          .getSpecieByName(scientificName)
          .then((result:{specie: pg.QueryResult,predators: pg.QueryResult}) => {
            const speciesData = {specie: result.specie.rows[0], predators: result.predators.rows.map((predator: any) => predator.nomscientifique)};
            res.json(speciesData);
          })

          .catch((e: Error) => {
            console.error(e.stack);
          });
      }
    );
    router.put(
      "/edit/:nomscientifique",
      (req: Request, res: Response, _: NextFunction) => {
        const specie: Especeoiseau = {
          nomscientifique: req.body.nomscientifique,
          nomcommun: req.body.nomcommun,
          statutspeces: req.body.statutspeces,
          nomscientifiquecomsommer: req.body.nomscientifiquecomsommer,
        };

        this.databaseService
          .updateSpecie(specie)
          .then((result: pg.QueryResult) => {
            res.json(result.rowCount);
          })
          .catch((e: Error) => {
            console.error(e.stack);
          });
      }
    );
    router.get(
      "/add",
      (req: Request, res: Response, _: NextFunction) => {
        this.databaseService
          .getOptions()
          .then((predators: pg.QueryResult) => {
            res.json(predators.rows.map((predator: any) => predator.nomscientifique));
          })

          .catch((e: Error) => {
            console.error(e.stack);
          });
      }
    );
    router.post(
      "/add",
      (req: Request, res: Response, _: NextFunction) => {
        const specie: Especeoiseau = {
          nomscientifique: req.body.nomscientifique,
          nomcommun: req.body.nomcommun,
          statutspeces: req.body.statutspeces,
          nomscientifiquecomsommer: req.body.nomscientifiquecomsommer,
        };

        this.databaseService
          .addSpecie(specie)
          .then((result: pg.QueryResult) => {
            res.json(result.rowCount);
          })
          .catch((e: Error) => {
            console.error(e.stack);
          });
      }
    );

    router.delete(
      "/birdSpecies/",
      (req: Request, res: Response, _: NextFunction) => {
        this.databaseService
          .deleteSpecie(req.body.nomscientifique)
          .then((result: pg.QueryResult) => {
            res.json(result.rowCount);
          })
          .catch((e: Error) => {
            console.error(e.stack);
          });
      }
    );


    return router;
  }
}
