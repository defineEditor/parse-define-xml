/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Parse Define-XML 2.1 document to TypeScript interfaces
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
} from "parser/define.core";
import type {
    Odm,
    Study,
    MetaDataVersion,
    ItemGroupDef,
    ItemGroupDefClassNames,
    ItemGroupDefPurpose,
    ItemDef,
    ItemDefDataType,
    ItemRef,
    ValueListDef,
    CodeList,
    CodeListType,
    CommentDef,
    MethodDef,
    Origin,
    OriginType,
    Standard,
    ItemGroupDefSubclassNames,
    ItemGroupDefSubclass,
    ItemGroupDefClass,
    OriginSource,
    DefineXml,
} from "interfaces/define.xml.21.d.ts";
import { ArmDefineXml21 } from "interfaces/arm.10";
import { parseAnalysisResultDisplays } from "parser/arm.10";
import { parseDocumentRefs } from "parser/define.21.core";

const parseOrigin = (originRaw: any[]): Origin[] => {
    return originRaw.map((item) => {
        const result: Origin = {
            type: item["$"]["type"] as OriginType,
        };

        if (item["$"]["source"]) {
            result.source = item["$"]["source"] as OriginSource;
        }
        if (item["description"]) {
            result.description = item["description"].map(parseTranslatedText);
        }
        if (item["documentRef"]) {
            result.documentRefs = parseDocumentRefs(item["documentRef"]);
        }
        return result;
    });
};

const parseCodeLists = (codeListsRaw: any[]): { codeLists: Record<string, CodeList>; codeListsOrder: string[] } => {
    const codeLists: Record<string, CodeList> = {};
    const codeListsOrder: string[] = [];
    if (!codeListsRaw) return { codeLists, codeListsOrder };
    codeListsRaw.forEach((clRaw) => {
        if (!clRaw["$"]) return;
        const codeList: CodeList = {
            oid: clRaw["$"]["oid"],
            name: clRaw["$"]["name"],
            dataType: clRaw["$"]["dataType"] as CodeListType,
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
        if (clRaw["$"]["standardOid"]) {
            codeList.standardOid = clRaw["$"]["standardOid"];
        }
        if (clRaw["$"]["isNonStandard"]) {
            if (clRaw["$"]["isNonStandard"] === "Yes") {
                codeList.isNonStandard = true;
            } else {
                throw new Error(
                    `Invalid value for isNonStandard. Expected "Yes", received ${clRaw["$"]["isNonStandard"]}`
                );
            }
        }
        if (clRaw["$"]["commentOid"]) {
            codeList.commentOid = clRaw["$"]["commentOid"];
        }
        if (clRaw["description"]) {
            codeList.description = clRaw["description"].map(parseTranslatedText);
        }
        codeLists[codeList.oid] = codeList;
        codeListsOrder.push(codeList.oid);
    });
    return { codeLists, codeListsOrder };
};

const parseCommentDefs = (
    commentsRaw: any[]
): { commentDefs: Record<string, CommentDef>; commentDefsOrder: string[] } => {
    const commentDefs: Record<string, CommentDef> = {};
    const commentDefsOrder: string[] = [];
    if (!commentsRaw) return { commentDefs, commentDefsOrder };
    commentsRaw.forEach((commentRaw) => {
        const comment: CommentDef = {
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

const parseMethodDefs = (methodsRaw: any[]): { methodDefs: Record<string, MethodDef>; methodDefsOrder: string[] } => {
    const methodDefs: Record<string, MethodDef> = {};
    const methodDefsOrder: string[] = [];
    if (!methodsRaw) return { methodDefs, methodDefsOrder };
    methodsRaw.forEach((methodRaw) => {
        const method: MethodDef = {
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

const parseItemRef = (itemRefRaw: any): ItemRef => {
    let mandatory: boolean = false;
    if (itemRefRaw["$"]["mandatory"] === "Yes" || itemRefRaw["$"]["mandatory"] === "No") {
        mandatory = itemRefRaw["$"]["mandatory"] == "Yes" ? true : false;
    } else {
        throw new Error(
            `Invalid value for mandatory. Expected "Yes" or "No", received ${itemRefRaw["$"]["mandatory"]}`
        );
    }
    const itemRef: ItemRef = {
        itemOid: itemRefRaw["$"]["itemOid"],
        mandatory,
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
    if (itemRefRaw["$"]["standardOid"]) {
        itemRef.standardOid = itemRefRaw["$"]["standardOid"];
    }
    if (itemRefRaw["$"]["isNonStandard"]) {
        if (itemRefRaw["$"]["isNonStandard"] === "Yes") {
            itemRef.isNonStandard = true;
        } else {
            throw new Error(
                `Invalid value for isNonStandard. Expected "Yes", received ${itemRefRaw["$"]["isNonStandard"]}`
            );
        }
    }

    return itemRef;
};

const parseValueLists = (
    valueListsRaw: any[]
): { valueListDefs: Record<string, ValueListDef>; valueListDefsOrder: string[] } => {
    const valueLists: Record<string, ValueListDef> = {};
    const valueListDefsOrder: string[] = [];
    if (!valueListsRaw) return { valueListDefs: valueLists, valueListDefsOrder };
    valueListsRaw.forEach((vlRaw) => {
        const { itemRefs, itemRefsOrder } = vlRaw["itemRef"]
            ? parseItemRefs(vlRaw["itemRef"])
            : { itemRefs: {}, itemRefsOrder: [] };
        const valueList: ValueListDef = {
            oid: vlRaw["$"]["oid"],
            itemRefs,
            itemRefsOrder,
        };
        if (vlRaw["description"]) {
            valueList.description = vlRaw["description"].map(parseTranslatedText);
        }
        valueLists[valueList.oid] = valueList;
        valueListDefsOrder.push(valueList.oid);
    });
    return { valueListDefs: valueLists, valueListDefsOrder };
};

const parseItemRefs = (itemRefsRaw: any[]): { itemRefs: Record<string, ItemRef>; itemRefsOrder: string[] } => {
    const itemRefs: Record<string, ItemRef> = {};
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

const parseItemDefs = (itemDefsRaw: any[]): { itemDefs: Record<string, ItemDef>; itemDefsOrder: string[] } => {
    const itemDefs: Record<string, ItemDef> = {};
    const itemDefsOrder: string[] = [];
    if (!itemDefsRaw) return { itemDefs, itemDefsOrder };
    itemDefsRaw.forEach((itemDefRaw) => {
        const itemDef: ItemDef = {
            oid: itemDefRaw["$"]["oid"],
            name: itemDefRaw["$"]["name"],
            dataType: itemDefRaw["$"]["dataType"] as ItemDefDataType,
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
            itemDef.origins = parseOrigin(itemDefRaw["origin"]);
        }
        if (itemDefRaw["valueListRef"]) {
            itemDef.valueListRef = itemDefRaw["valueListRef"][0]["$"]["valueListOid"];
        }
        if (itemDefRaw["alias"]) {
            itemDef.alias = parseAliases(itemDefRaw["alias"]);
        }
        itemDefs[itemDef.oid] = itemDef;
        itemDefsOrder.push(itemDef.oid);
    });
    return { itemDefs, itemDefsOrder };
};

const parseClass = (classRaw: any): ItemGroupDefClass => {
    if (!Array.isArray(classRaw) || !classRaw[0]) {
        throw new Error("Expected class to be a non-empty array");
    }

    const result: ItemGroupDefClass = {
        name: classRaw[0]["$"]["name"] as ItemGroupDefClassNames,
    };

    const subClasses: ItemGroupDefSubclass[] = [];

    if (classRaw[0]["subClass"]) {
        classRaw[0]["subClass"].forEach((subClassRaw: any) => {
            const subClass: ItemGroupDefSubclass = {
                name: subClassRaw["$"]["name"] as ItemGroupDefSubclassNames,
            };
            if (subClassRaw["$"]["parentClassName"]) {
                subClass.parentClassName = subClassRaw["$"]["parentClassName"] as
                    | ItemGroupDefClassNames
                    | ItemGroupDefSubclassNames;
            }
            subClasses.push(subClass);
        });
        result.subClasses = subClasses;
    }

    return result;
};

const parseItemGroups = (
    itemGroupsRaw: any[]
): { itemGroupDefs: Record<string, ItemGroupDef>; itemGroupDefsOrder: string[] } => {
    const itemGroupDefs: Record<string, ItemGroupDef> = {};
    const itemGroupDefsOrder: string[] = [];
    if (!itemGroupsRaw) return { itemGroupDefs, itemGroupDefsOrder };
    itemGroupsRaw.forEach((igRaw) => {
        const { itemRefs, itemRefsOrder } = igRaw["itemRef"]
            ? parseItemRefs(igRaw["itemRef"])
            : { itemRefs: {}, itemRefsOrder: [] };
        let repeating: boolean = false;
        if (igRaw["$"]["repeating"] === "Yes" || igRaw["$"]["repeating"] === "No") {
            repeating = igRaw["$"]["repeating"] == "Yes" ? true : false;
        } else {
            throw new Error(`Invalid value for repeating. Expected "Yes" or "No", received ${igRaw["$"]["repeating"]}`);
        }
        const itemGroup: ItemGroupDef = {
            oid: igRaw["$"]["oid"],
            name: igRaw["$"]["name"],
            repeating,
            purpose: igRaw["$"]["purpose"] as ItemGroupDefPurpose,
            sasDatasetName: igRaw["$"]["sASDatasetName"],
            structure: igRaw["$"]["structure"],
            archiveLocationId: igRaw["$"]["archiveLocationId"],
            itemRefs,
            itemRefsOrder,
        };
        if (igRaw["$"]["standardOid"]) {
            itemGroup.standardOid = igRaw["$"]["standardOid"];
        }
        if (igRaw["$"]["isNonStandard"]) {
            if (igRaw["$"]["isNonStandard"] === "Yes") {
                itemGroup.isNonStandard = true;
            } else {
                throw new Error(
                    `Invalid value for isNonStandard. Expected "Yes", received ${igRaw["$"]["isNonStandard"]}`
                );
            }
        }
        if (igRaw["$"]["hasNoData"]) {
            if (igRaw["$"]["hasNoData"] === "Yes") {
                itemGroup.hasNoData = true;
            } else {
                throw new Error(`Invalid value for hasNoData. Expected "Yes", received ${igRaw["$"]["hasNoData"]}`);
            }
        }
        if (igRaw["class"]) {
            itemGroup.class = igRaw["class"] ? parseClass(igRaw["class"]) : undefined;
        }
        if (igRaw["$"]["domain"]) {
            itemGroup.domain = igRaw["$"]["domain"];
        }
        if (igRaw["$"]["isReferenceData"]) {
            /* Convert using approach similar to this:
            if (item["$"]["extendedValue"] === "Yes") {
                enumeratedItem.extendedValue = true;
            } else {
                throw new Error(`Invalid value for extendedValue. Expected "Yes", received ${item["$"]["extendedValue"]}`);
            }
            */
            if (igRaw["$"]["isReferenceData"] === "Yes" || igRaw["$"]["isReferenceData"] === "No") {
                itemGroup.isReferenceData = igRaw["$"]["isReferenceData"] === "Yes" ? true : false;
            } else {
                throw new Error(
                    `Invalid value for isReferenceData. Expected "Yes" or "No", received ${igRaw["isReferenceData"]}`
                );
            }
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

const parseStandards = (standardsRaw: any[]): { standards: Record<string, Standard>; standardsOrder: string[] } => {
    const standards: Record<string, Standard> = {};
    const standardsOrder: string[] = [];
    if (!standardsRaw) return { standards, standardsOrder };
    standardsRaw[0]?.standard.forEach((stdRaw: Record<string, any>) => {
        const standard: Standard = {
            oid: stdRaw["$"]["oid"],
            name: stdRaw["$"]["name"],
            type: stdRaw["$"]["type"],
            version: stdRaw["$"]["version"],
        };
        if (stdRaw["$"]["publishingSet"]) {
            standard.publishingSet = stdRaw["$"]["publishingSet"];
        }
        if (stdRaw["$"]["status"]) {
            standard.status = stdRaw["$"]["status"];
        }
        if (stdRaw["$"]["commentOid"]) {
            standard.commentOid = stdRaw["$"]["commentOid"];
        }
        standards[standard.oid] = standard;
        standardsOrder.push(standard.oid);
    });
    return { standards, standardsOrder };
};

interface ParseMetadata {
    (metadataRaw: any, hasArm: true): ArmDefineXml21["odm"]["study"]["metaDataVersion"];
    (metadataRaw: any, hasArm?: false): MetaDataVersion;
}

const parseMetaDataVersion: ParseMetadata = (metadataRaw: any, hasArm?: boolean): any => {
    const { itemGroupDefs, itemGroupDefsOrder } = parseItemGroups(metadataRaw["itemGroupDef"]);
    const { itemDefs, itemDefsOrder } = parseItemDefs(metadataRaw["itemDef"]);
    const { standards, standardsOrder } = parseStandards(metadataRaw["standards"]);

    const result: MetaDataVersion = {
        oid: metadataRaw["$"]["oid"],
        name: metadataRaw["$"]["name"],
        description: metadataRaw["$"]["description"],
        defineVersion: metadataRaw["$"]["defineVersion"],
        standards,
        standardsOrder,
        itemGroupDefs,
        itemGroupDefsOrder,
        itemDefs,
        itemDefsOrder,
    };

    if (metadataRaw["$"]["commentOid"]) {
        result.commentOid = metadataRaw["$"]["commentOid"];
    }
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
        const resultWithArm: ArmDefineXml21["odm"]["study"]["metaDataVersion"] = {
            ...result,
            analysisResultDisplays: parseAnalysisResultDisplays(metadataRaw["analysisResultDisplays"], "2.1"),
        };
        return resultWithArm;
    } else {
        return result;
    }
};

interface ParseStudy {
    (studyRaw: any, hasArm: true): ArmDefineXml21["odm"]["study"];
    (studyRaw: any, hasArm?: false): Study;
}

const parseStudy: ParseStudy = (studyRaw: any, hasArm?: boolean): any => {
    if (hasArm === true) {
        const studyWithArm: ArmDefineXml21["odm"]["study"] = {
            studyOid: studyRaw["$"]["oid"],
            globalVariables: parseGlobalVariables(studyRaw["globalVariables"][0]),
            metaDataVersion: parseMetaDataVersion(studyRaw["metaDataVersion"][0], hasArm),
        };
        return studyWithArm;
    } else {
        const study: Study = {
            studyOid: studyRaw["$"]["oid"],
            globalVariables: parseGlobalVariables(studyRaw["globalVariables"][0]),
            metaDataVersion: parseMetaDataVersion(studyRaw["metaDataVersion"][0]),
        };
        return study;
    }
};

interface ParseOdm {
    (odmRaw: any, hasArm: true): ArmDefineXml21["odm"];
    (odmRaw: any, hasArm?: false): Odm;
}

const parseOdm: ParseOdm = (odmRaw: any, hasArm?: boolean): any => {
    let study: Study | ArmDefineXml21["odm"]["study"];
    if (hasArm === true) {
        study = parseStudy(odmRaw["study"][0], true);
    } else {
        study = parseStudy(odmRaw["study"][0]);
    }
    const result: Odm = {
        xmlns: odmRaw["$"]["xmlns"] as "http://www.cdisc.org/ns/odm/v1.3",
        xmlns_def: odmRaw["$"]["xmlns:def"] as "http://www.cdisc.org/ns/def/v2.1",
        xsi_schemaLocation: odmRaw["$"]["xsi:schemaLocation"],
        odmVersion: "1.3.2",
        fileType: "Snapshot",
        fileOid: odmRaw["$"]["fileOid"],
        creationDateTime: odmRaw["$"]["creationDateTime"],
        study,
        context: odmRaw["$"]["context"],
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
        const resultWithArm: ArmDefineXml21["odm"] = {
            ...(result as ArmDefineXml21["odm"]),
            xmlns_arm: odmRaw["$"]["xmlns:arm"] as "http://www.cdisc.org/ns/arm/v1.0",
        };
        return resultWithArm;
    } else {
        return result;
    }
};

/**
 * Main parser function for Define-XML 2.1
 */
interface ParseDefineXml {
    (xmlString: string, hasArm?: false): Promise<DefineXml>;
    (xmlString: string, hasArm?: true): Promise<ArmDefineXml21>;
}
const parseDefineXml: ParseDefineXml = async (xmlString: string, hasArm?: boolean): Promise<any> => {
    // Parse XML string into object using xml2js
    const defineXml: Partial<DefineXml> = {
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

    defineXml.odm =
        hasArm === true ? parseOdm(parsedXmlUpdated["odm"], true) : parseOdm(parsedXmlUpdated["odm"], false);

    return defineXml as DefineXml;
};

export default parseDefineXml;
