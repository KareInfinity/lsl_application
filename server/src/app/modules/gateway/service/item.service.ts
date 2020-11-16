import { using, Environment } from "../../global/utils";
import { BaseService } from "./base.service";
import * as _ from "lodash";
import { ItemRequest, ItemResponse, Item } from "../models/item.model";
import { DeviceModel } from "../models/device.model";
import { DeviceService } from "./device.service";
import { ErrorResponse } from "../../global/models/errorres.model";
export class ItemService extends BaseService {
	constructor() {
		super();
		this.environment = new Environment();
	}
	environment: Environment;

	async get(_item: ItemRequest): Promise<ItemResponse<DeviceModel>> {
		var result: ItemResponse<DeviceModel> = new ItemResponse();
		try {
			switch (_item.type) {
				case Item.TYPES.IDH:
					result = await this.getDevice(_item);
					break;
				case Item.TYPES.IV_WATCH:
					result = await this.getDevice(_item);
					break;
				case Item.TYPES.DEXCOM:
					result = await this.getDevice(_item);
					break;

				default:
					throw new ErrorResponse({
						message: `Item Type (${_item.type}) invalid`,
					});
			}
		} catch (error) {
			throw error;
		}
		return result;
	}
	async getDevice(_item: ItemRequest): Promise<ItemResponse<DeviceModel>> {
		var result: ItemResponse<DeviceModel> = new ItemResponse();
		try {
			var service = new DeviceService();
			var device_list = await service.get(
				new DeviceModel({ serial_no: _item.id, device_type: _item.type })
			);
			if (device_list.length == 0) {
				throw new ErrorResponse({
					message: `Device with serial number ${_item.id} not found`,
				});
			}
			result = new ItemResponse({
				id: _item.id,
				type: _item.type,
				details: device_list[0],
			});
		} catch (error) {
			throw error;
		}
		return result;
	}
}
