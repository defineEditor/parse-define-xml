// Define-XML 2.1 interfaces (attributes use lowerCamelCase comparing to the XML specification)

// Reexport core types
export * from "interfaces/define.xml.core";

import {
    ItemDefDataType,
    ItemGroupDefClassNames,
    ItemGroupDefSubclassNames,
    ItemGroupDefPurpose,
    PdfPageRefType,
    CodeListType,
    StandardName,
    StandardType,
    StandardStatus,
    Alias,
    TranslatedText,
    Leaf,
    WhereClauseDef,
    ExternalCodeList,
    EnumeratedItem,
    CodeListItem,
    FormalExpression,
    GlobalVariables,
} from "interfaces/define.xml.core";

export type OriginType = "Assigned" | "Collected" | "Derived" | "Not Available" | "Other" | "Predecessor" | "Protocol";
export type OriginSource = "Investigator" | "Sponsor" | "Subject" | "Vendor";

// PdfPageRef is specialized in 2.1 with optional title
export interface PdfPageRef {
    type: PdfPageRefType;
    pageRefs?: string;
    firstPage?: number;
    lastPage?: number;
    title?: string;
}

export interface DocumentRef {
    leafId: string;
    pdfPageRefs?: PdfPageRef[];
}

export interface CommentDef {
    oid: string;
    description?: TranslatedText[];
    documentRefs?: DocumentRef[];
}

export interface MethodDef {
    oid: string;
    name: string;
    type: "Computation" | "Imputation";
    description?: TranslatedText[];
    documentRefs?: DocumentRef[];
    formalExpressions?: FormalExpression[];
}

export interface Origin {
    type: OriginType;
    description?: TranslatedText[];
    documentRefs?: DocumentRef[];
    source?: OriginSource;
}

export interface CodeList {
    oid: string;
    name: string;
    dataType: CodeListType;
    standardOid?: string;
    isNonStandard?: true;
    description?: TranslatedText[];
    alias?: Alias[];
    commentOid?: string;
    sasFormatName?: string;
    // Children (one of the following groups is required)
    enumeratedItems?: EnumeratedItem[];
    codeListItems?: CodeListItem[];
    externalCodeList?: ExternalCodeList;
}

export interface Standard {
    oid: string;
    name: StandardName;
    type: StandardType;
    version: string;
    publishingSet?: string;
    status?: StandardStatus;
    commentOid?: string;
}

export interface MetaDataVersion {
    oid: string;
    name: string;
    description?: string;
    defineVersion: string;
    standards: Record<string, Standard>;
    standardsOrder: string[];
    itemGroupDefs: Record<string, ItemGroupDef>;
    itemGroupDefsOrder: string[];
    itemDefs: Record<string, ItemDef>;
    itemDefsOrder: string[];
    annotatedCrf?: DocumentRef[];
    supplementalDoc?: DocumentRef[];
    valueListDefs?: Record<string, ValueListDef>;
    valueListDefsOrder?: string[];
    whereClauseDefs?: Record<string, WhereClauseDef>;
    whereClauseDefsOrder?: string[];
    codeLists?: Record<string, CodeList>;
    codeListsOrder?: string[];
    methodDefs?: Record<string, MethodDef>;
    methodDefsOrder?: string[];
    commentDefs?: Record<string, CommentDef>;
    commentDefsOrder?: string[];
    leafs?: Record<string, Leaf>;
    leafsOrder?: string[];
    commentOid?: string;
}

export interface ValueListDef {
    oid: string;
    itemRefs: Record<string, ItemRef>;
    itemRefsOrder: string[];
    description?: TranslatedText[];
}

export interface Study {
    studyOid: string;
    globalVariables: GlobalVariables;
    metaDataVersion: MetaDataVersion;
}

export interface Odm {
    xmlns: "http://www.cdisc.org/ns/odm/v1.3";
    xmlns_def: "http://www.cdisc.org/ns/def/v2.1";
    xmlns_xlink?: "http://www.w3.org/1999/xlink"; // Conditional
    xmlns_xsi?: "http://www.w3.org/2001/XMLSchema-instance"; // Conditional
    xsi_schemaLocation?: string; // Optional
    odmVersion: "1.3.2";
    fileType: "Snapshot";
    fileOid: string;
    creationDateTime: string; // ISO8601 datetime
    context: string;
    study: Study;
    asOfDateTime?: string; // ISO8601 datetime
    originator?: string;
    sourceSystem?: string;
    sourceSystemVersion?: string;
}

export interface ItemGroupDefSubclass {
    name: ItemGroupDefSubclassNames;
    parentClassName?: ItemGroupDefClassNames | ItemGroupDefSubclassNames;
}

export interface ItemGroupDefClass {
    name: ItemGroupDefClassNames;
    subClasses?: ItemGroupDefSubclass[];
}

export interface ItemGroupDef {
    oid: string;
    name: string;
    repeating: boolean;
    purpose: ItemGroupDefPurpose;
    domain?: string; // Required for SDTM and SEND
    sasDatasetName?: string; // Required for regulatory submissions
    structure?: string; // Required for regulatory submissions
    standardOid?: string;
    isNonStandard?: true;
    class?: ItemGroupDefClass; // Required for regulatory submissions
    archiveLocationId?: string; // Required for regulatory submissions
    isReferenceData?: boolean;
    hasNoData?: true;
    commentOid?: string;
    description?: TranslatedText[];
    itemRefs: Record<string, ItemRef>;
    itemRefsOrder?: string[];
    alias?: Alias[];
    leaf?: Leaf;
}

export interface ItemDef {
    oid: string;
    name: string;
    dataType: ItemDefDataType;
    length?: number; // Required if DataType is "text", "integer", or "float"
    significantDigits?: number; // Required if DataType is "float"
    sasFieldName?: string; // Required for regulatory submissions
    displayFormat?: string;
    commentOid?: string;
    description?: TranslatedText[];
    codeListRef?: string;
    origins?: Origin[];
    valueListRef?: string;
    alias?: Alias[];
}

export interface ItemRef {
    itemOid: string;
    mandatory: boolean;
    orderNumber?: number;
    keySequence?: number; // Required for regulatory submissions
    methodOid?: string; // Conditional: required when referenced ItemDef has Origin@Type="Derived"
    role?: string; // Optional for SDTM standard domains, conditional required for SDTM custom domains
    roleCodeListOid?: string;
    whereClauseRefs?: string[];
    isNonStandard?: true;
    standardOid?: string;
}

export interface DefineXml {
    xml: {
        version?: string;
        encoding?: string;
    };
    styleSheet: {
        type?: string;
        href?: string;
    };
    odm: Odm;
}
