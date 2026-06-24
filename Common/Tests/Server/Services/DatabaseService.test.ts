import BaseModel from "../../../Models/DatabaseModels/DatabaseBaseModel/DatabaseBaseModel";
import DatabaseService from "../../../Server/Services/DatabaseService";
import SortOrder from "../../../Types/BaseDatabase/SortOrder";

describe("DatabaseService", () => {
  describe("addSortColumnsToSelect", () => {
    test("temporarily selects top-level sort columns missing from select", () => {
      const service: DatabaseService<BaseModel> = new DatabaseService(
        BaseModel,
      );
      const findBy: any = {
        select: {
          _id: true,
          incidentStateId: true,
        },
        sort: {
          startsAt: SortOrder.Ascending,
        },
      };

      const addedColumns: Array<string> = (
        service as any
      ).addSortColumnsToSelect(findBy);

      expect(addedColumns).toEqual(["startsAt"]);
      expect(findBy.select.startsAt).toBe(true);
    });

    test("does not mark explicitly selected sort columns as temporary", () => {
      const service: DatabaseService<BaseModel> = new DatabaseService(
        BaseModel,
      );
      const findBy: any = {
        select: {
          _id: true,
          startsAt: true,
        },
        sort: {
          startsAt: SortOrder.Ascending,
        },
      };

      const addedColumns: Array<string> = (
        service as any
      ).addSortColumnsToSelect(findBy);

      expect(addedColumns).toEqual([]);
      expect(findBy.select.startsAt).toBe(true);
    });
  });
});
