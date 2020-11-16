import { using } from "../../global/utils";
import { BaseService } from "./base.service";
import { ReferenceListModel } from "../models/referencelist.model";
import { ConnectionPool, Transaction, IResult } from "mssql";
import * as _ from "lodash";

export class ReferenceListService extends BaseService {
	sql_get_referencelist_by_reftype: string = `SELECT id, ref_type_code, ref_type_display_text, ref_value_code, ref_value_display_text, sorting_index, created_by, modified_by, created_on, modified_on, version, is_active, lang_code, is_suspended, parent_id, is_factory, notes
	FROM referencelist WHERE ref_type_code = $1 order by sorting_index`;
	sql_get_date_range_referencelist: string = `SELECT id, ref_type_code, ref_type_display_text, ref_value_code, ref_value_display_text, sorting_index
	FROM tblReferenceData WHERE ref_type_code = 'DATE_RANGE_FILTER' order by sorting_index`;
	sql_insert_referencelist: string = ``;
	sql_update_referencelist: string = ``;

	async getDateRangeReferenceList(_ref_type_code: string): Promise<Array<ReferenceListModel>> {
		let result: Array<ReferenceListModel> = new Array<ReferenceListModel>();
		try {
			await using(this.db.getDisposablePool(), async (pool) => {
				var client = await pool.connect();
				var qb = new this.utils.QueryBuilder(this.sql_get_date_range_referencelist);
				var query_string = qb.getQuery();
				var { recordset }: IResult<any> = await client.query(
					query_string
				);
				_.forEach(recordset, (v, k) => {
					var referencelist = new ReferenceListModel(v);
					result.push(referencelist);
				});
				// await client.query("COMMIT");
			});
		} catch (e) {
			// await client.query("ROLLBACK");
			throw e;
		}
		return result;
	}
}
