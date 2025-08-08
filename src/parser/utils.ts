/**
 * Removes only 'def:' and 'arm:' namespaces from attribute/element names in an object recursively.
 * Modeled after removeNamespace from parseUtils.js
 */
const removeNamespaces = (input: unknown): unknown => {
    if (Array.isArray(input)) {
        return input.map(removeNamespaces);
    }
    if (typeof input === "object" && input !== null) {
        const obj = input as Record<string, unknown>;
        const result: Record<string, unknown> = {};
        for (const prop in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, prop)) {
                let propUpdated = prop;
                // Only remove 'def:' and 'arm:' namespaces
                if (/^(?:def|arm):/.test(prop)) {
                    propUpdated = prop.replace(/^(?:def|arm):(.*)/, "$1");
                }
                const value = obj[prop];
                result[propUpdated] = removeNamespaces(value);
            }
        }
        return result;
    }
    return input;
};

/**
 * Converts all attribute and element names in an object to lower camel case.
 * Similar to convertAttrsToLCC from parseUtils.js
 */
const convertAttributeNameToLowerCamelCase = (input: unknown): unknown => {
    if (Array.isArray(input)) {
        return input.map(convertAttributeNameToLowerCamelCase);
    }
    if (typeof input === "object" && input !== null) {
        const obj = input as Record<string, unknown>;
        const result: Record<string, unknown> = {};
        for (const prop in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, prop)) {
                let propUpdated = prop;
                // Rename only properties starting with a capital letter
                if (/^[A-Z]|leafID/.test(prop)) {
                    if (/^[A-Z0-9_]+$/.test(prop)) {
                        // All caps OID -> oid
                        propUpdated = prop.toLowerCase();
                    } else if (/[a-z](OID|CRF|ID)/.test(propUpdated)) {
                        // Abbreviations mid word: FileOID -> fileOid
                        propUpdated = propUpdated.replace(/^([a-zA-Z0-9]*[a-z])(OID|CRF|ID)/, (_unused, p1, p2) => {
                            return (
                                p1.slice(0, 1).toLowerCase() + p1.slice(1) + p2.slice(0, 1) + p2.slice(1).toLowerCase()
                            );
                        });
                    } else if (prop === "ODMVersion") {
                        propUpdated = "odmVersion";
                    } else {
                        propUpdated = prop.slice(0, 1).toLowerCase() + prop.slice(1);
                    }
                }
                const value = obj[prop];
                result[propUpdated] = convertAttributeNameToLowerCamelCase(value);
            }
        }
        return result;
    }
    return input;
};

export { convertAttributeNameToLowerCamelCase, removeNamespaces };
