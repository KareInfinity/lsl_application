import * as _ from "lodash";
import { Base } from "./base.model";
class User extends Base {
  name?: string;
  id?: number;
  constructor(init?: Partial<User>) {
    super(init);
    if (init) {
      if (typeof init.id == "number") this.id = init.id;
      if (typeof init.name == "string") this.name = init.name;
    }
  }
}

export { User };
