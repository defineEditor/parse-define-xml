/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Parse Define-XML 2.0 document to TypeScript interfaces
 */

import * as xml2js from "xml2js";
import { convertAttributeNameToLowerCamelCase, removeNamespaces } from "parser/utils";
import {
    parseTranslatedText,
    parseAliases,
    parseLeafs,
    parseWhereClauses,
    parseEnumeratedItems,
    parseCodeListItems,
    parseExternalCodeList,
    parseFormalExpressions,
    parseGlobalVariables,
} from "./define.core";
import type { Define20 } from "../interfaces/define.xml.20";
import { ArmDefine20 } from "../interfaces/arm.10";
import { parseAnalysisResultDisplays } from "./arm.10";
import { parseDocumentRefs } from "./define.20.core";

const parseOrigin = (originRaw: any): Define20.Origin => {
    const result: Define20.Origin = {
        type: originRaw["$"]["type"] as Define20.OriginType,
    };
    if (originRaw["description"]) {
        result.description = originRaw["description"].map(parseTranslatedText);
    }
    if (originRaw["documentRef"]) {
        result.documentRefs = parseDocumentRefs(originRaw["documentRef"]);
    }
    return result;
};

const parseCodeLists = (
    codeListsRaw: any[]
): { codeLists: Record<string, Define20.CodeList>; codeListsOrder: string[] } => {
    const codeLists: Record<string, Define20.CodeList> = {};
    const codeListsOrder: string[] = [];
    if (!codeListsRaw) return { codeLists, codeListsOrder };
    codeListsRaw.forEach((clRaw) => {
        if (!clRaw["$"]) return;
        const codeList: Define20.CodeList = {
            oid: clRaw["$"]["oid"],
            name: clRaw["$"]["name"],
            dataType: clRaw["$"]["dataType"] as Define20.CodeListType,
        };
        if (clRaw["$"]["sASFormatName"]) {
            codeList.sasFormatName = clRaw["$"]["sASFormatName"];
        }
        if (clRaw["alias"]) {
            codeList.alias = parseAliases(clRaw["alias"]);
        }
        if (clRaw["enumeratedItem"]) {
            codeList.enumeratedItems = parseEnumeratedItems(clRaw["enumeratedItem"]);
        }
        if (clRaw["codeListItem"]) {
            codeList.codeListItems = parseCodeListItems(clRaw["codeListItem"]);
        }
        if (clRaw["externalCodeList"]) {
            codeList.externalCodeList = parseExternalCodeList(clRaw["externalCodeList"][0]);
        }
        codeLists[codeList.oid] = codeList;
        codeListsOrder.push(codeList.oid);
    });
    return { codeLists, codeListsOrder };
};

const parseCommentDefs = (
    commentsRaw: any[]
): { commentDefs: Record<string, Define20.CommentDef>; commentDefsOrder: string[] } => {
    const commentDefs: Record<string, Define20.CommentDef> = {};
    const commentDefsOrder: string[] = [];
    if (!commentsRaw) return { commentDefs, commentDefsOrder };
    commentsRaw.forEach((commentRaw) => {
        const comment: Define20.CommentDef = {
            oid: commentRaw["$"]["oid"],
        };
        if (commentRaw["description"]) {
            comment.description = commentRaw["description"].map(parseTranslatedText);
        }
        if (commentRaw["documentRef"]) {
            comment.documentRefs = parseDocumentRefs(commentRaw["documentRef"]);
        }
        commentDefs[comment.oid] = comment;
        commentDefsOrder.push(comment.oid);
    });
    return { commentDefs, commentDefsOrder };
};

const parseMethodDefs = (
    methodsRaw: any[]
): { methodDefs: Record<string, Define20.MethodDef>; methodDefsOrder: string[] } => {
    const methodDefs: Record<string, Define20.MethodDef> = {};
    const methodDefsOrder: string[] = [];
    if (!methodsRaw) return { methodDefs, methodDefsOrder };
    methodsRaw.forEach((methodRaw) => {
        const method: Define20.MethodDef = {
            oid: methodRaw["$"]["oid"],
            name: methodRaw["$"]["name"],
            type: methodRaw["$"]["type"] as "Computation" | "Imputation",
        };
        if (methodRaw["description"]) {
            method.description = methodRaw["description"].map(parseTranslatedText);
        }
        if (methodRaw["documentRef"]) {
            method.documentRefs = parseDocumentRefs(methodRaw["documentRef"]);
        }
        if (methodRaw["formalExpression"]) {
            method.formalExpressions = parseFormalExpressions(methodRaw["formalExpression"]);
        }
        methodDefs[method.oid] = method;
        methodDefsOrder.push(method.oid);
    });
    return { methodDefs, methodDefsOrder };
};

const parseItemRef = (itemRefRaw: any): Define20.ItemRef => {
    const rawMandatory = itemRefRaw["$"]["mandatory"];
    if (rawMandatory !== "Yes" && rawMandatory !== "No") {
        throw new Error(`Invalid value for ItemRef.mandatory: ${rawMandatory}`);
    }
    const itemRef: Define20.ItemRef = {
        itemOid: itemRefRaw["$"]["itemOid"],
        mandatory: rawMandatory === "Yes",
    };
    if (itemRefRaw["$"]["methodOid"]) {
        itemRef.methodOid = itemRefRaw["$"]["methodOid"];
    }
    if (itemRefRaw["$"]["role"]) {
        itemRef.role = itemRefRaw["$"]["role"];
    }
    if (itemRefRaw["$"]["roleCodeListOid"]) {
        itemRef.roleCodeListOid = itemRefRaw["$"]["roleCodeListOid"];
    }
    if (itemRefRaw["$"]["orderNumber"]) {
        itemRef.orderNumber = Number(itemRefRaw["$"]["orderNumber"]);
    }
    if (itemRefRaw["$"]["keySequence"]) {
        itemRef.keySequence = Number(itemRefRaw["$"]["keySequence"]);
    }
    if (itemRefRaw["$"]["whereClauseRef"]) {
        itemRef.whereClauseRefs = itemRefRaw["whereClauseRef"].map((ref: any) => ref["$"]["whereClauseOid"]);
    }

    return itemRef;
};

const parseValueLists = (
    valueListsRaw: any[]
): { valueListDefs: Record<string, Define20.ValueListDef>; valueListDefsOrder: string[] } => {
    const valueLists: Record<string, Define20.ValueListDef> = {};
    const valueListDefsOrder: string[] = [];
    if (!valueListsRaw) return { valueListDefs: valueLists, valueListDefsOrder };
    valueListsRaw.forEach((vlRaw) => {
        const { itemRefs, itemRefsOrder } = vlRaw["itemRef"]
            ? parseItemRefs(vlRaw["itemRef"])
            : { itemRefs: {}, itemRefsOrder: [] };
        const valueList: Define20.ValueListDef = {
            oid: vlRaw["$"]["oid"],
            itemRefs,
            itemRefsOrder,
        };
        valueLists[valueList.oid] = valueList;
        valueListDefsOrder.push(valueList.oid);
    });
    return { valueListDefs: valueLists, valueListDefsOrder };
};

const parseItemRefs = (itemRefsRaw: any[]): { itemRefs: Record<string, Define20.ItemRef>; itemRefsOrder: string[] } => {
    const itemRefs: Record<string, Define20.ItemRef> = {};
    const itemRefsOrder: string[] = [];
    if (!itemRefsRaw) return { itemRefs, itemRefsOrder };
    itemRefsRaw.forEach((itemRefRaw) => {
        if (!itemRefRaw["$"] || !itemRefRaw["$"]["itemOid"]) return;
        const oid = itemRefRaw["$"]["itemOid"];
        itemRefs[oid] = parseItemRef(itemRefRaw);
        itemRefsOrder.push(oid);
    });
    return { itemRefs, itemRefsOrder };
};

const parseItemDefs = (itemDefsRaw: any[]): { itemDefs: Record<string, Define20.ItemDef>; itemDefsOrder: string[] } => {
    const itemDefs: Record<string, Define20.ItemDef> = {};
    const itemDefsOrder: string[] = [];
    if (!itemDefsRaw) return { itemDefs, itemDefsOrder };
    itemDefsRaw.forEach((itemDefRaw) => {
        const itemDef: Define20.ItemDef = {
            oid: itemDefRaw["$"]["oid"],
            name: itemDefRaw["$"]["name"],
            dataType: itemDefRaw["$"]["dataType"] as Define20.ItemDefDataType,
        };
        if (itemDefRaw["$"]["length"]) {
            itemDef.length = Number(itemDefRaw["$"]["length"]);
        }
        if (itemDefRaw["$"]["significantDigits"]) {
            itemDef.significantDigits = Number(itemDefRaw["$"]["significantDigits"]);
        }
        if (itemDefRaw["$"]["sASFieldName"]) {
            itemDef.sasFieldName = itemDefRaw["$"]["sASFieldName"];
        }
        if (itemDefRaw["$"]["displayFormat"]) {
            itemDef.displayFormat = itemDefRaw["$"]["displayFormat"];
        }
        if (itemDefRaw["$"]["commentOid"]) {
            itemDef.commentOid = itemDefRaw["$"]["commentOid"];
        }
        if (itemDefRaw["description"]) {
            itemDef.description = itemDefRaw["description"].map(parseTranslatedText);
        }
        if (itemDefRaw["codeListRef"]) {
            itemDef.codeListRef = itemDefRaw["codeListRef"][0]["$"]["codeListOid"];
        }
        if (itemDefRaw["origin"]) {
            itemDef.origins = [parseOrigin(itemDefRaw["origin"][0])];
        }
        if (itemDefRaw["valueListRef"]) {
            itemDef.valueListRef = itemDefRaw["valueListRef"][0]["$"]["valueListOid"];
        }
        itemDefs[itemDef.oid] = itemDef;
        itemDefsOrder.push(itemDef.oid);
    });
    return { itemDefs, itemDefsOrder };
};

const parseItemGroups = (
    itemGroupsRaw: any[]
): { itemGroupDefs: Record<string, Define20.ItemGroupDef>; itemGroupDefsOrder: string[] } => {
    const itemGroupDefs: Record<string, Define20.ItemGroupDef> = {};
    const itemGroupDefsOrder: string[] = [];
    if (!itemGroupsRaw) return { itemGroupDefs, itemGroupDefsOrder };
    itemGroupsRaw.forEach((igRaw) => {
        const { itemRefs, itemRefsOrder } = igRaw["itemRef"]
            ? parseItemRefs(igRaw["itemRef"])
            : { itemRefs: {}, itemRefsOrder: [] };
        const rawRepeating = igRaw["$"]["repeating"];
        if (rawRepeating !== "Yes" && rawRepeating !== "No") {
            throw new Error(`Invalid value for ItemGroupDef.repeating: ${rawRepeating}`);
        }
        const itemGroup: Define20.ItemGroupDef = {
            oid: igRaw["$"]["oid"],
            name: igRaw["$"]["name"],
            repeating: rawRepeating === "Yes",
            purpose: igRaw["$"]["purpose"] as Define20.ItemGroupDefPurpose,
            sasDatasetName: igRaw["$"]["sASDatasetName"],
            structure: igRaw["$"]["structure"],
            class: igRaw["$"]["class"] as Define20.ItemGroupDefClassNames,
            archiveLocationId: igRaw["$"]["archiveLocationId"],
            itemRefs,
            itemRefsOrder,
        };
        if (igRaw["$"]["domain"]) {
            itemGroup.domain = igRaw["$"]["domain"];
        }
        if (igRaw["$"]["isReferenceData"]) {
            const rawIsReferenceData = igRaw["$"]["isReferenceData"];
            if (rawIsReferenceData !== "Yes" && rawIsReferenceData !== "No") {
                throw new Error(`Invalid value for ItemGroupDef.isReferenceData: ${rawIsReferenceData}`);
            }
            itemGroup.isReferenceData = rawIsReferenceData === "Yes";
        }
        if (igRaw["$"]["commentOid"]) {
            itemGroup.commentOid = igRaw["$"]["commentOid"];
        }
        if (igRaw["description"]) {
            itemGroup.description = igRaw["description"].map(parseTranslatedText);
        }
        if (igRaw["alias"]) {
            itemGroup.alias = parseAliases(igRaw["alias"]);
        }
        if (igRaw["leaf"]) {
            // For datasets, we expect a single leaf
            itemGroup.leaf = Object.values(parseLeafs(igRaw["leaf"]).leafs)[0];
        }
        itemGroupDefs[itemGroup.oid] = itemGroup;
        itemGroupDefsOrder.push(itemGroup.oid);
    });
    return { itemGroupDefs, itemGroupDefsOrder };
};

interface ParseMetadata {
    (metadataRaw: any, hasArm: true): ArmDefine20.MetaDataVersion;
    (metadataRaw: any, hasArm?: false): Define20.MetaDataVersion;
}

const parseMetaDataVersion: ParseMetadata = (metadataRaw: any, hasArm?: boolean): any => {
    const { itemGroupDefs, itemGroupDefsOrder } = parseItemGroups(metadataRaw["itemGroupDef"]);
    const { itemDefs, itemDefsOrder } = parseItemDefs(metadataRaw["itemDef"]);

    const result: Define20.MetaDataVersion = {
        oid: metadataRaw["$"]["oid"],
        name: metadataRaw["$"]["name"],
        description: metadataRaw["$"]["description"],
        defineVersion: metadataRaw["$"]["defineVersion"],
        standardName: metadataRaw["$"]["standardName"],
        standardVersion: metadataRaw["$"]["standardVersion"],
        itemGroupDefs,
        itemGroupDefsOrder,
        itemDefs,
        itemDefsOrder,
    };

    if (metadataRaw["annotatedCrf"]) {
        const annotatedCrf = metadataRaw["annotatedCrf"] ? parseDocumentRefs(metadataRaw["annotatedCrf"]) : undefined;
        result.annotatedCrf = annotatedCrf;
    }
    if (metadataRaw["supplementalDoc"]) {
        const supplementalDoc = metadataRaw["supplementalDoc"]
            ? parseDocumentRefs(metadataRaw["supplementalDoc"])
            : undefined;
        result.supplementalDoc = supplementalDoc;
    }
    if (metadataRaw["valueListDef"]) {
        const { valueListDefs, valueListDefsOrder } = parseValueLists(metadataRaw["valueListDef"]);
        result.valueListDefs = valueListDefs;
        result.valueListDefsOrder = valueListDefsOrder;
    }
    if (metadataRaw["whereClauseDef"]) {
        const { whereClauseDefs, whereClauseDefsOrder } = parseWhereClauses(metadataRaw["whereClauseDef"]);
        result.whereClauseDefs = whereClauseDefs;
        result.whereClauseDefsOrder = whereClauseDefsOrder;
    }
    if (metadataRaw["codeList"]) {
        const { codeLists, codeListsOrder } = parseCodeLists(metadataRaw["codeList"]);
        result.codeLists = codeLists;
        result.codeListsOrder = codeListsOrder;
    }
    if (metadataRaw["methodDef"]) {
        const { methodDefs, methodDefsOrder } = parseMethodDefs(metadataRaw["methodDef"]);
        result.methodDefs = methodDefs;
        result.methodDefsOrder = methodDefsOrder;
    }
    if (metadataRaw["commentDef"]) {
        const { commentDefs, commentDefsOrder } = parseCommentDefs(metadataRaw["commentDef"]);
        result.commentDefs = commentDefs;
        result.commentDefsOrder = commentDefsOrder;
    }
    if (metadataRaw["leaf"]) {
        const { leafs, leafsOrder } = parseLeafs(metadataRaw["leaf"]);
        result.leafs = leafs;
        result.leafsOrder = leafsOrder;
    }

    if (hasArm === true) {
        const resultWithArm: ArmDefine20.MetaDataVersion = {
            ...result,
            analysisResultDisplays: parseAnalysisResultDisplays(metadataRaw["analysisResultDisplays"], "2.0"),
        };
        return resultWithArm;
    } else {
        return result;
    }
};

interface ParseStudy {
    (studyRaw: any, hasArm: true): ArmDefine20.DefineXml["odm"]["study"];
    (studyRaw: any, hasArm?: false): Define20.Study;
}

const parseStudy: ParseStudy = (studyRaw: any, hasArm?: boolean): any => {
    if (hasArm === true) {
        const studyWithArm: ArmDefine20.DefineXml["odm"]["study"] = {
            studyOid: studyRaw["$"]["oid"],
            globalVariables: parseGlobalVariables(studyRaw["globalVariables"][0]),
            metaDataVersion: parseMetaDataVersion(studyRaw["metaDataVersion"][0], hasArm),
        };
        return studyWithArm;
    } else {
        const study: Define20.Study = {
            studyOid: studyRaw["$"]["oid"],
            globalVariables: parseGlobalVariables(studyRaw["globalVariables"][0]),
            metaDataVersion: parseMetaDataVersion(studyRaw["metaDataVersion"][0]),
        };
        return study;
    }
};

interface ParseOdm {
    (odmRaw: any, hasArm: true): ArmDefine20.DefineXml["odm"];
    (odmRaw: any, hasArm?: false): Define20.Odm;
}

const parseOdm: ParseOdm = (odmRaw: any, hasArm?: boolean): any => {
    let study: Define20.Study | ArmDefine20.DefineXml["odm"]["study"];
    if (hasArm === true) {
        study = parseStudy(odmRaw["study"][0], true);
    } else {
        study = parseStudy(odmRaw["study"][0]);
    }
    const result: Define20.Odm | ArmDefine20.DefineXml["odm"] = {
        xmlns: odmRaw["$"]["xmlns"] as "http://www.cdisc.org/ns/odm/v1.3",
        xmlns_def: odmRaw["$"]["xmlns:def"] as "http://www.cdisc.org/ns/def/v2.0",
        xsi_schemaLocation: odmRaw["$"]["xsi:schemaLocation"],
        odmVersion: "1.3.2",
        fileType: "Snapshot",
        fileOid: odmRaw["$"]["fileOid"],
        creationDateTime: odmRaw["$"]["creationDateTime"],
        study,
    };
    if (odmRaw["$"]["asOfDateTime"]) {
        result.asOfDateTime = odmRaw["$"]["asOfDateTime"];
    }
    if (odmRaw["$"]["originator"]) {
        result.originator = odmRaw["$"]["originator"];
    }
    if (odmRaw["$"]["sourceSystem"]) {
        result.sourceSystem = odmRaw["$"]["sourceSystem"];
    }
    if (odmRaw["$"]["sourceSystemVersion"]) {
        result.sourceSystemVersion = odmRaw["$"]["sourceSystemVersion"];
    }
    if (odmRaw["$"]["xmlns:xlink"]) {
        result.xmlns_xlink = odmRaw["$"]["xmlns:xlink"] as "http://www.w3.org/1999/xlink";
    }
    if (odmRaw["$"]["xmlns:xsi"]) {
        result.xmlns_xsi = odmRaw["$"]["xmlns:xsi"] as "http://www.w3.org/2001/XMLSchema-instance";
    }
    if (hasArm === true) {
        const resultWithArm: ArmDefine20.DefineXml["odm"] = {
            ...(result as ArmDefine20.DefineXml["odm"]),
            xmlns_arm: odmRaw["$"]["xmlns:arm"] as "http://www.cdisc.org/ns/arm/v1.0",
        };
        return resultWithArm;
    } else {
        return result;
    }
};

/**
 * Main parser function for Define-XML 2.0
 */
interface ParseDefineXml {
    (xmlString: string, hasArm?: false): Promise<Define20.DefineXml>;
    (xmlString: string, hasArm?: true): Promise<ArmDefine20.DefineXml>;
}
const parseDefineXml: ParseDefineXml = async (xmlString: string, hasArm?: boolean): Promise<any> => {
    // Parse XML string into object using xml2js
    const defineXml: Partial<Define20.DefineXml> = {
        xml: {},
        styleSheet: {},
    };
    let parsedXml: Record<string, any> = {};

    try {
        // Read first lines until ODM tag which contain XML declaration and stylesheet information
        const xmlHeader = xmlString.match(/<\?xml.*\?>/);
        const xmlStyleSheet = xmlString.match(/<\?xml-stylesheet.*\?>/);
        if (xmlHeader && defineXml.xml) {
            const versionMatch = xmlHeader[0].match(/<\?xml.*\s+version="([^"]+)"\s+encoding="([^"]+)"\s*\?>/);
            const encodingMatch = xmlHeader[0].match(/<\?xml.*\s+encoding="([^"]+)"\s*\?>/);
            if (versionMatch) {
                defineXml.xml.version = versionMatch[1];
            }
            if (encodingMatch) {
                defineXml.xml.encoding = encodingMatch[1];
            }
        }
        if (xmlStyleSheet && defineXml.styleSheet) {
            const typeMatch = xmlStyleSheet[0].match(/type="([^"]+)"/);
            const hrefMatch = xmlStyleSheet[0].match(/href="([^"]+)"/);
            if (typeMatch) {
                defineXml.styleSheet.type = typeMatch[1];
            }
            if (hrefMatch) {
                defineXml.styleSheet.href = hrefMatch[1];
            }
        }
        parsedXml = await xml2js.parseStringPromise(xmlString, {
            explicitArray: true,
            mergeAttrs: false,
            explicitCharkey: false,
            charkey: "value",
            attrkey: "$",
        });
    } catch (err: any) {
        throw new Error(`XML parsing failed: ${err.message}`);
    }

    // Convert all attribute/element names to lower camel case and remove def: and arm: namespaces
    const parsedXmlUpdated = convertAttributeNameToLowerCamelCase(removeNamespaces(parsedXml)) as Record<string, any>;

    if (!parsedXmlUpdated || !parsedXmlUpdated["odm"]) {
        throw new Error("Invalid Define-XML structure: missing ODM root element");
    }

    if (hasArm === true) {
        defineXml.odm = parseOdm(parsedXmlUpdated["odm"], true) as ArmDefine20.DefineXml["odm"];
        return defineXml as ArmDefine20.DefineXml;
    } else {
        defineXml.odm = parseOdm(parsedXmlUpdated["odm"]) as Define20.DefineXml["odm"];
        return defineXml as Define20.DefineXml;
    }
};

export default parseDefineXml;
