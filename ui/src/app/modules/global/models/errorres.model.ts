import { Base } from "./base.model";
import * as _ from "lodash";
class ErrorResponse<T> extends Base {
  success: boolean = false;
  message: string = "";
  item?: any;
  constructor(init?: Partial<ErrorResponse<T>>) {
    super(init);
    if (init) {
      this.message = _.get(init, "message", "");
      if (_.get(init, "item", null) != null) {
        this.item = init.item;
      }
    }
  }
}
// module ErrorResponse
// {
//     export enum statuses
//     {
// 		success="SUCCESS",
// 		failure="FAILURE"
//     }
// }

export { ErrorResponse };
