
import * as _ from "lodash";
import { Base } from "./base.model";

export class DriverModel extends Base {
    id: number = 0;
    precent_driver_id: number = 0;
    driver_code: string = "";
    driver_name: string = "";
    /* template */
    created_by: number = 0;
    modified_by: number = 0;
    created_on: Date | null = null;
    modified_on: Date | null = null;
    is_active: boolean = true;
    is_factory: boolean = false;
    /* extensions */
    idh_session_id: number = 0;

    constructor(init?: Partial<DriverModel>) {
        super(init);
        if (typeof init?.id == "number") this.id = init.id;
        if (typeof init?.precent_driver_id == "number") this.precent_driver_id = init.precent_driver_id;
        if (typeof init?.driver_code == "string")
            this.driver_code = init.driver_code;
        if (typeof init?.driver_name == "string")
            this.driver_name = init.driver_name;
        //
        if (typeof init?.created_by == "number")
            this.created_by = init.created_by;
        if (typeof init?.modified_by == "number")
            this.modified_by = init.modified_by;
        if (typeof init?.is_active == "boolean")
            this.is_active = init.is_active;
        if (
            init?.created_on instanceof Date ||
            typeof init?.created_on == "string"
        )
            this.created_on = new Date(init.created_on);
        if (
            init?.modified_on instanceof Date ||
            typeof init?.modified_on == "string"
        )
            this.modified_on = new Date(init.modified_on);
        /* extensions */
        if (typeof init?.idh_session_id == "number") this.idh_session_id = init.idh_session_id;
    }
}
