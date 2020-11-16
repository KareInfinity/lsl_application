import { DeviceModel } from "../../../models/device.model";
import * as _ from "lodash";
export class DeviceDatasetModel extends DeviceModel {
  device_id: number = 0;
  constructor(init?: Partial<DeviceDatasetModel>) {
    super(init);
    if (init) {
      if (typeof init.device_id == "number") this.device_id = init.device_id;
    }
  }
}
