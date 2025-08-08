// Define-XML 2.0 interfaces (attributes use lowerCamelCase comparing to the XML specification)
// See also: main.d.ts for shared interfaces

// Reexport core types
export * from "interfaces/define.xml.core";

import {
    ItemDefDataType,
    ItemGroupDefClassNames,
    ItemGroupDefPurpose,
    PdfPageRefType,
    Comparator,
    SoftHard,
    CodeListType,
} from "interfaces/define.xml.core";

export type OriginType = "CRF" | "Derived" | "Assigned" | "Protocol" | "eDT" | "Predecessor";

export interface Alias {
    context: string;
    name: string;
}

export interface TranslatedText {
    xml_lang?: string;
    value: string;
}

export interface Leaf {
    id: string;
    xlink_href: string;
    title: string;
}

export interface DocumentRef {
    leafId: string;
    pdfPageRefs?: PdfPageRef[];
}

export interface PdfPageRef {
    type: PdfPageRefType;
    pageRefs?: string;
    firstPage?: number;
    lastPage?: number;
}

export interface Origin {
    type: OriginType;
    descriptions?: TranslatedText[];
    documentRefs?: DocumentRef[];
}

export interface WhereClauseRef {
    whereClauseOid: string;
}

export interface WhereClauseDef {
    oid: string;
    commentOid?: string;
    rangeChecks: RangeCheck[];
}

export interface RangeCheck {
    comparator: Comparator;
    softHard: SoftHard;
    itemOid: string;
    checkValues: string[];
}

export interface CodeList {
    oid: string;
    name: string;
    dataType: CodeListType;
    sasFormatName?: string;
    alias?: Alias[];
    // Children (one of the following groups is required)
    enumeratedItems?: EnumeratedItem[];
    codeListItems?: CodeListItem[];
    externalCodeList?: ExternalCodeList;
}

export interface ExternalCodeList {
    dictionary: string;
    version: string;
    ref?: string;
    href?: string;
}

export interface EnumeratedItem {
    codedValue: string;
    rank?: number;
    orderNumber?: number;
    extendedValue?: "Yes";
    alias?: Alias[];
}

export interface CodeListItem {
    codedValue: string;
    rank?: number;
    orderNumber?: number;
    extendedValue?: "Yes";
    decode: TranslatedText[];
    alias?: Alias[];
}

export interface CommentDef {
    oid: string;
    descriptions?: TranslatedText[];
    documentRefs?: DocumentRef[];
}

export interface FormalExpression {
    context: string;
    value: string;
}

export interface MethodDef {
    oid: string;
    name: string;
    type: "Computation" | "Imputation";
    descriptions?: TranslatedText[];
    documentRefs?: DocumentRef[];
    formalExpressions?: FormalExpression[];
}

export interface MetaDataVersion {
    oid: string;
    name: string;
    description?: string;
    defineVersion: string;
    standardName: string;
    standardVersion: string;
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
}

export interface ValueListDef {
    oid: string;
    itemRefs: Record<string, ItemRef>;
    itemRefsOrder: string[];
}

export interface GlobalVariables {
    studyName: string;
    studyDescription: string;
    protocolName: string;
}

export interface Study {
    studyOid: string;
    globalVariables: GlobalVariables;
    metaDataVersion: MetaDataVersion;
}

export interface Odm {
    xmlns: "http://www.cdisc.org/ns/odm/v1.3";
    xmlns_def: "http://www.cdisc.org/ns/def/v2.0";
    xmlns_xlink?: "http://www.w3.org/1999/xlink"; // Conditional
    xmlns_xsi?: "http://www.w3.org/2001/XMLSchema-instance"; // Conditional
    xsi_schemaLocation?: string; // Optional
    odmVersion: "1.3.2";
    fileType: "Snapshot";
    fileOid: string;
    creationDateTime: string; // ISO8601 datetime
    asOfDateTime?: string; // ISO8601 datetime
    originator?: string;
    sourceSystem?: string;
    sourceSystemVersion?: string;
    study: Study;
}

export interface ItemGroupDef {
    oid: string;
    name: string;
    repeating: "Yes" | "No";
    purpose: ItemGroupDefPurpose;
    domain?: string; // Required for SDTM and SEND
    sasDatasetName?: string; // Required for regulatory submissions
    structure?: string; // Required for regulatory submissions
    class?: ItemGroupDefClassNames; // Required for regulatory submissions
    archiveLocationId?: string; // Required for regulatory submissions
    isReferenceData?: "Yes" | "No";
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
    origin?: Origin;
    valueListRef?: string;
}

export interface ItemRef {
    itemOid: string;
    mandatory: "Yes" | "No";
    orderNumber?: number;
    keySequence?: number; // Required for regulatory submissions
    methodOid?: string; // Conditional: required when referenced ItemDef has Origin@Type="Derived"
    role?: string; // Optional for SDTM standard domains, conditional required for SDTM custom domains
    roleCodeListOid?: string;
    whereClauseRefs?: string[];
}
