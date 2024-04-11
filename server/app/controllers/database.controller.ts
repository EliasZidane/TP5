import { NextFunction, Request, Response, Router } from "express";
import { inject, injectable } from "inversify";
import * as pg from "pg";

import { Especeoiseau } from "../../../common/tables/Especeoiseau";
// import { HotelPK } from "../../../common/tables/HotelPK";
// import { Room } from "../../../common/tables/Room";
// import { Guest } from "../../../common/tables/Guest";

import { DatabaseService } from "../services/database.service";
import Types from "../types";

@injectable()
export class DatabaseController {
  public constructor(
    @inject(Types.DatabaseService) private databaseService: DatabaseService
  ) {}

  public get router(): Router {
    const router: Router = Router();

    // ======= BIRD SPECIES ROUTES =======
    // ex http://localhost:3000/database/hotel?scientificName=3&name=LeGrandHotel&city=laval
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
          .then((result:{specie: pg.QueryResult, statuses: pg.QueryResult, predators: pg.QueryResult}) => {
            // console.log(result);
            const speciesData = {specie: result.specie.rows[0], statuses: result.statuses.rows.map((status: any) => status.statutspeces), predators: result.predators.rows.map((predator: any) => predator.nomscientifique)};
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
          .then((result:{statuses: pg.QueryResult, predators: pg.QueryResult}) => {
            // console.log(result);
            const options = {statuses: result.statuses.rows.map((status: any) => status.statutspeces), predators: result.predators.rows.map((predator: any) => predator.nomscientifique)};
            res.json(options);
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

    // router.post(
    //   "/birdspecies/insert",
    //   (req: Request, res: Response, _: NextFunction) => {
    //     const hotel: Hotel = {
    //       scientificName: req.body.scientificName,
    //       name: req.body.name,
    //       city: req.body.city,
    //     };

    //     this.databaseService
    //       .createHotel(hotel)
    //       .then((result: pg.QueryResult) => {
    //         res.json(result.rowCount);
    //       })
    //       .catch((e: Error) => {
    //         console.error(e.stack);
    //         res.json(-1);
    //       });
    //   }
    // );

    router.post(
      "/birdSpecies/",
      (req: Request, res: Response, _: NextFunction) => {
        console.log("Va delete ",req.body)
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



    // // ======= ROOMS ROUTES =======
    // router.get("/add", (req: Request, res: Response, _: NextFunction) => {
    //   const scientificName = req.query.scientificName ? req.query.scientificName : "";
    //   const roomNb = req.query.roomNb ? req.query.roomNb : "";
    //   const roomType = req.query.type ? req.query.type : "";
    //   const roomPrice = req.query.price
    //     ? parseFloat(req.query.price as string)
    //     : -1;

    //   this.databaseService
    //     .filterRooms(
    //       scientificName as string,
    //       roomNb as string,
    //       roomType as string,
    //       roomPrice
    //     )
    //     .then((result: pg.QueryResult) => {
    //       const rooms: Room[] = result.rows.map((room: Room) => ({
    //         scientificName: room.scientificName,
    //         roomnb: room.roomnb,
    //         type: room.type,
    //         price: parseFloat(room.price.toString()),
    //       }));

    //       res.json(rooms);
    //     })
    //     .catch((e: Error) => {
    //       console.error(e.stack);
    //     });
    // });

    // router.post(
    //   "/add/insert",
    //   (req: Request, res: Response, _: NextFunction) => {
    //     const room: Room = {
    //       scientificName: req.body.scientificName,
    //       roomnb: req.body.roomnb,
    //       type: req.body.type,
    //       price: parseFloat(req.body.price),
    //     };

    //     this.databaseService
    //       .createRoom(room)
    //       .then((result: pg.QueryResult) => {
    //         res.json(result.rowCount);
    //       })
    //       .catch((e: Error) => {
    //         console.error(e.stack);
    //         res.json(-1);
    //       });
    //   }
    // );

    // router.put(
    //   "/add/update",
    //   (req: Request, res: Response, _: NextFunction) => {
    //     const room: Room = {
    //       scientificName: req.body.scientificName,
    //       roomnb: req.body.roomnb,
    //       type: req.body.type,
    //       price: parseFloat(req.body.price),
    //     };

    //     this.databaseService
    //       .updateRoom(room)
    //       .then((result: pg.QueryResult) => {
    //         res.json(result.rowCount);
    //       })
    //       .catch((e: Error) => {
    //         console.error(e.stack);
    //         res.json(-1);
    //       });
    //   }
    // );

    // router.post(
    //   "/add/delete/:scientificName/:roomNb",
    //   (req: Request, res: Response, _: NextFunction) => {
    //     const scientificName: string = req.params.scientificName;
    //     const roomNb: string = req.params.roomNb;

    //     this.databaseService
    //       .deleteRoom(scientificName, roomNb)
    //       .then((result: pg.QueryResult) => {
    //         res.json(result.rowCount);
    //       })
    //       .catch((e: Error) => {
    //         console.error(e.stack);
    //         res.json(-1);
    //       });
    //   }
    // );

    // // ======= GUEST ROUTES =======
    // router.post(
    //   "/edit/insert",
    //   (req: Request, res: Response, _: NextFunction) => {
    //     const guest: Guest = {
    //       guestnb: req.body.guestnb,
    //       nas: req.body.nas,
    //       name: req.body.name,
    //       gender: req.body.gender,
    //       city: req.body.city,
    //     };

    //     this.databaseService
    //       .createGuest(guest)
    //       .then((result: pg.QueryResult) => {
    //         res.json(result.rowCount);
    //       })
    //       .catch((e: Error) => {
    //         console.error(e.stack);
    //         res.json(-1);
    //       });
    //   }
    // );

    // router.get(
    //   "/edit/:scientificName/:roomNb",
    //   (req: Request, res: Response, _: NextFunction) => {
    //     const scientificName: string = req.params.scientificName;
    //     const roomNb: string = req.params.roomNb;

    //     this.databaseService
    //       .getGuests(scientificName, roomNb)
    //       .then((result: pg.QueryResult) => {
    //         const guests: Guest[] = result.rows.map((guest: any) => ({
    //           guestnb: guest.guestnb,
    //           nas: guest.nas,
    //           name: guest.name,
    //           gender: guest.gender,
    //           city: guest.city,
    //         }));
    //         res.json(guests);
    //       })
    //       .catch((e: Error) => {
    //         console.error(e.stack);
    //         res.json(-1);
    //       });
    //   }
    // );

    // // ======= GENERAL ROUTES =======
    // router.get(
    //   "/tables/:tableName",
    //   (req: Request, res: Response, next: NextFunction) => {
    //     this.databaseService
    //       .getAllFromTable(req.params.tableName)
    //       .then((result: pg.QueryResult) => {
    //         res.json(result.rows);
    //       })
    //       .catch((e: Error) => {
    //         console.error(e.stack);
    //       });
    //   }
    // );

    return router;
  }
}
