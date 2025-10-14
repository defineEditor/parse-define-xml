// Define-XML 2.0 interfaces (attributes use lowerCamelCase comparing to the XML specification)

import * as Core from "./define.xml.core";
export declare namespace Define20 {
    // Core type aliases for namespace usage
    export type ItemDefDataType = Core.ItemDefDataType;
    export type ItemGroupDefClassNames = Core.ItemGroupDefClassNames;
    export type ItemGroupDefPurpose = Core.ItemGroupDefPurpose;
    export type PdfPageRefType = Core.PdfPageRefType;
    export type CodeListType = Core.CodeListType;
    export type Alias = Core.Alias;
    export type TranslatedText = Core.TranslatedText;
    export type Leaf = Core.Leaf;
    export type WhereClauseDef = Core.WhereClauseDef;
    export type EnumeratedItem = Core.EnumeratedItem;
    export type CodeListItem = Core.CodeListItem;
    export type ExternalCodeList = Core.ExternalCodeList;
    export type FormalExpression = Core.FormalExpression;
    export type GlobalVariables = Core.GlobalVariables;
    export type OriginType = "CRF" | "Derived" | "Assigned" | "Protocol" | "eDT" | "Predecessor";

    export interface Origin {
        type: OriginType;
        description?: TranslatedText[];
        documentRefs?: DocumentRef[];
    }

    export interface PdfPageRef {
        type: PdfPageRefType;
        pageRefs?: string;
        firstPage?: number;
        lastPage?: number;
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
        repeating: boolean;
        purpose: ItemGroupDefPurpose;
        domain?: string; // Required for SDTM and SEND
        sasDatasetName?: string; // Required for regulatory submissions
        structure?: string; // Required for regulatory submissions
        class?: ItemGroupDefClassNames; // Required for regulatory submissions
        archiveLocationId?: string; // Required for regulatory submissions
        isReferenceData?: boolean;
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
}
