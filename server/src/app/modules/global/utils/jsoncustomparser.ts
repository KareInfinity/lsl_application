class JsonCustomParser {
	parse<T>(str: string, default_value: T) {
		var result: any = null;
		try {
			result = JSON.parse(str);
		} catch (e) {
			result = default_value;
		}
		return result;
	}
}
export const json_custom_parser = new JsonCustomParser();
