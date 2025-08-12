/* eslint-disable @typescript-eslint/no-explicit-any */

import {
    TranslatedText,
    Alias,
    Leaf,
    WhereClauseDef,
    RangeCheck,
    Comparator,
    SoftHard,
    EnumeratedItem,
    CodeListItem,
    ExternalCodeList,
    FormalExpression,
    GlobalVariables,
} from "interfaces/define.xml.core";

export const parseTranslatedText = (translatedTextRaw: any): TranslatedText => {
    const text = translatedTextRaw.translatedText[0];
    const translatedText: TranslatedText = {
        value: text.value || text,
    };
    if (text["$"] && text["$"]["xml:lang"]) {
        translatedText.xml_lang = text["$"]["xml:lang"];
    }
    return translatedText;
};

export const parseAliases = (aliasesRaw: any[]): Alias[] => {
    return aliasesRaw.map((aliasRaw) => ({
        context: aliasRaw["$"]["context"],
        name: aliasRaw["$"]["name"],
    }));
};

export const parseLeafs = (leafsRaw: any[]): { leafs: Record<string, Leaf>; leafsOrder: string[] } => {
    const leafs: Record<string, Leaf> = {};
    const leafsOrder: string[] = [];

    // If there are no leafs, return empty object and array
    if (!leafsRaw) return { leafs, leafsOrder };

    leafsRaw.forEach((leafRaw) => {
        // If the leaf does not have attributes, skip it
        if (!leafRaw["$"]) return;

        const leaf: Leaf = {
            id: leafRaw["$"]["id"],
            xlink_href: leafRaw["$"]["xlink:href"],
            title: leafRaw["title"][0],
        };

        leafs[leaf.id] = leaf;
        leafsOrder.push(leaf.id);
    });

    return { leafs, leafsOrder };
};

export const parseCheckValues = (checkValuesRaw: any[]): string[] => {
    if (!checkValuesRaw) return [];
    return checkValuesRaw.map((cv) => cv["_"] || cv);
};

export const parseRangeChecks = (rangeChecksRaw: any[]): RangeCheck[] => {
    if (!rangeChecksRaw) return [];
    return rangeChecksRaw.map((rc) => ({
        comparator: rc["$"]["comparator"] as Comparator,
        softHard: rc["$"]["softHard"] as SoftHard,
        itemOid: rc["$"]["itemOid"],
        checkValues: rc["checkValue"] ? parseCheckValues(rc["checkValue"]) : [],
    }));
};

export const parseWhereClauses = (
    whereClausesRaw: any[]
): { whereClauseDefs: Record<string, WhereClauseDef>; whereClauseDefsOrder: string[] } => {
    const whereClauseDefs: Record<string, WhereClauseDef> = {};
    const whereClauseDefsOrder: string[] = [];
    if (!whereClausesRaw) return { whereClauseDefs, whereClauseDefsOrder };
    whereClausesRaw.forEach((wcRaw) => {
        if (!wcRaw["$"]) return;
        const whereClause: WhereClauseDef = {
            oid: wcRaw["$"]["oid"],
            rangeChecks: wcRaw["rangeCheck"] ? parseRangeChecks(wcRaw["rangeCheck"]) : [],
        };
        if (wcRaw["$"]["commentOid"]) {
            whereClause.commentOid = wcRaw["$"]["commentOid"];
        }
        whereClauseDefs[whereClause.oid] = whereClause;
        whereClauseDefsOrder.push(whereClause.oid);
    });
    return { whereClauseDefs, whereClauseDefsOrder };
};

export const parseEnumeratedItems = (enumeratedItemsRaw: any[]): EnumeratedItem[] => {
    if (!enumeratedItemsRaw) return [];
    return enumeratedItemsRaw.map((item) => {
        const enumeratedItem: EnumeratedItem = {
            codedValue: item["$"]["codedValue"],
        };
        if (item["$"]["rank"]) {
            enumeratedItem.rank = Number(item["$"]["rank"]);
        }
        if (item["$"]["orderNumber"]) {
            enumeratedItem.orderNumber = Number(item["$"]["orderNumber"]);
        }
        if (item["$"]["extendedValue"]) {
            if (item["$"]["extendedValue"] === "Yes") {
                enumeratedItem.extendedValue = true;
            } else {
                throw new Error(
                    `Invalid value for extendedValue. Expected "Yes", received ${item["$"]["extendedValue"]}`
                );
            }
        }
        if (item["alias"]) {
            enumeratedItem.alias = parseAliases(item["alias"]);
        }
        return enumeratedItem;
    });
};

export const parseCodeListItems = (codeListItemsRaw: any[]): CodeListItem[] => {
    if (!codeListItemsRaw) return [];
    return codeListItemsRaw.map((item) => {
        const codeListItem: CodeListItem = {
            codedValue: item["$"]["codedValue"],
            decode: item["decode"] ? item["decode"].map(parseTranslatedText) : [],
        };
        if (item["$"]["rank"]) {
            codeListItem.rank = Number(item["$"]["rank"]);
        }
        if (item["$"]["orderNumber"]) {
            codeListItem.orderNumber = Number(item["$"]["orderNumber"]);
        }
        if (item["$"]["extendedValue"]) {
            if (item["$"]["extendedValue"] === "Yes") {
                codeListItem.extendedValue = true;
            } else {
                throw new Error(
                    `Invalid value for extendedValue. Expected "Yes", received ${item["$"]["extendedValue"]}`
                );
            }
        }
        if (item["alias"]) {
            codeListItem.alias = parseAliases(item["alias"]);
        }
        return codeListItem;
    });
};

export const parseExternalCodeList = (externalCodeListRaw: any): ExternalCodeList => {
    const result: ExternalCodeList = {
        dictionary: externalCodeListRaw["$"]["dictionary"],
        version: externalCodeListRaw["$"]["version"],
    };
    if (externalCodeListRaw["$"]["ref"]) {
        result.ref = externalCodeListRaw["$"]["ref"];
    }
    if (externalCodeListRaw["$"]["href"]) {
        result.href = externalCodeListRaw["$"]["href"];
    }
    return result;
};

export const parseFormalExpressions = (formalExpressionsRaw: any[]): FormalExpression[] => {
    if (!formalExpressionsRaw) return [];
    return formalExpressionsRaw.map((fe) => ({
        context: fe["$"]["context"],
        value: fe.value,
    }));
};

export const parseGlobalVariables = (globalVariablesRaw: any): GlobalVariables => ({
    studyName: globalVariablesRaw["studyName"][0],
    studyDescription: globalVariablesRaw["studyDescription"][0],
    protocolName: globalVariablesRaw["protocolName"][0],
});
