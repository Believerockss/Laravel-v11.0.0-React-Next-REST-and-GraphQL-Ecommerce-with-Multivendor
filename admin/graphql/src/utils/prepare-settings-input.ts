type AnyObject = Record<string, any>;

export function prepareSettingsInputData(obj: AnyObject): AnyObject {
    if (obj !== null && typeof obj === 'object') {
        if (Array.isArray(obj)) {
            return obj.map((item) => prepareSettingsInputData(item)) as any[];
        } else {
            const newObj: AnyObject = {};
            for (const key in obj) {
                if (key !== '__typename') {
                    newObj[key] = prepareSettingsInputData(obj[key]);
                }
            }
            return newObj;
        }
    }
    return obj;
};