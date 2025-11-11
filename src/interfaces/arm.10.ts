// ARM extension for Define-XML MetaDataVersion (works for both 2.0 and 2.1)
import { Define20 } from "./define.xml.20";
import { Define21 } from "./define.xml.21";

// ARM generic interfaces

type AnalysisReasonCore =
    | "DATA DRIVEN"
    | "REQUESTED BY REGULATORY AGENCY"
    | "SPECIFIED IN PROTOCOL"
    | "SPECIFIED IN SAP"
    | string;
type AnalysisPurposeCore =
    | "EXPLORATORY OUTCOME MEASURE"
    | "PRIMARY OUTCOME MEASURE"
    | "SECONDARY OUTCOME MEASURE"
    | string;

export interface AnalysisDatasetCore {
    itemGroupOid: string;
    whereClauseOid?: string;
    whereClauseRefs?: string[];
    analysisVariables?: string[];
}

export interface AnalysisDatasetsCore {
    analysisDatasets: Record<string, AnalysisDatasetCore>;
    analysisDatasetsOrder: string[];
    commentOid?: string;
}

interface AnalysisResultDisplaysCore<ResultDisplay> {
    analysisResultDisplays: {
        resultDisplays: Record<string, ResultDisplay>;
        resultDisplayOrder: string[];
    };
}

interface ResultDisplayCore<TranslatedText, DocumentRef, AnalysisResult> {
    oid: string;
    name: string;
    description: TranslatedText[];
    analysisResults: Record<string, AnalysisResult>;
    analysisResultOrder: string[];
    documents?: DocumentRef[];
}
interface AnalysisResultCore<TranslatedText, Documentation, ProgrammingCode> {
    oid: string;
    parameterOid?: string;
    analysisReason: AnalysisReasonCore;
    analysisPurpose: AnalysisPurposeCore;
    description: TranslatedText[];
    analysisDatasets: AnalysisDatasetsCore;
    documentation?: Documentation;
    programmingCode?: ProgrammingCode;
}
interface DocumentationCore<TranslatedText, DocumentRef> {
    description: TranslatedText[];
    documents?: DocumentRef[];
}

interface ProgrammingCodeCore<DocumentRef> {
    context?: string;
    code?: string;
    documents?: DocumentRef[];
}

// ARM Interfaces for Define-XML 2.0
export declare namespace ArmDefine20 {
    // Re-export all types and interfaces from Define20 except ARM-specific ones
    export type ItemDef = Define20.ItemDef;
    export type ItemRef = Define20.ItemRef;
    export type ItemGroupDef = Define20.ItemGroupDef;
    export type ItemGroupDefClassNames = Define20.ItemGroupDefClassNames;
    export type ItemGroupDefPurpose = Define20.ItemGroupDefPurpose;
    export type ValueListDef = Define20.ValueListDef;
    export type CodeList = Define20.CodeList;
    export type CodeListType = Define20.CodeListType;
    export type CommentDef = Define20.CommentDef;
    export type MethodDef = Define20.MethodDef;
    export type Origin = Define20.Origin;
    export type OriginType = Define20.OriginType;
    export type Alias = Define20.Alias;
    export type TranslatedText = Define20.TranslatedText;
    export type Leaf = Define20.Leaf;
    export type DocumentRef = Define20.DocumentRef;
    export type PdfPageRef = Define20.PdfPageRef;
    export type PdfPageRefType = Define20.PdfPageRefType;
    export type WhereClauseDef = Define20.WhereClauseDef;
    export type ExternalCodeList = Define20.ExternalCodeList;
    export type EnumeratedItem = Define20.EnumeratedItem;
    export type CodeListItem = Define20.CodeListItem;
    export type FormalExpression = Define20.FormalExpression;
    export type GlobalVariables = Define20.GlobalVariables;
    export type Study = Define20.Study;
    export type DefineXml = Omit<Define20.DefineXml, "odm"> & {
        odm: Omit<Define20.DefineXml["odm"], "study"> & {
            xmlns_arm: "http://www.cdisc.org/ns/arm/v1.0";
            study: Omit<Define20.DefineXml["odm"]["study"], "metaDataVersion"> & {
                metaDataVersion: MetaDataVersion;
            };
        };
    };
    export type AnalysisDatasets = AnalysisDatasetsCore;
    export type AnalysisDataset = AnalysisDatasetCore;
    export type AnalysisReason = AnalysisReasonCore;
    export type AnalysisPurpose = AnalysisPurposeCore;
    export type ProgrammingCode = ProgrammingCodeCore<Define20.DocumentRef>;
    export type Documentation = DocumentationCore<Define20.TranslatedText, Define20.DocumentRef>;
    export type AnalysisResult = AnalysisResultCore<Define20.TranslatedText, Documentation, ProgrammingCode>;
    export type ResultDisplay = ResultDisplayCore<Define20.TranslatedText, Define20.DocumentRef, AnalysisResult>;
    export type AnalysisResultDisplays = AnalysisResultDisplaysCore<
        ResultDisplayCore<Define20.TranslatedText, Define20.DocumentRef, AnalysisResult>
    >;
    export type MetaDataVersion = Define20.MetaDataVersion & AnalysisResultDisplays;
}
// ARM Interfaces for Define-XML 2.1
export declare namespace ArmDefine21 {
    // Re-export all types and interfaces from Define21 except ARM-specific ones
    export type ItemDef = Define21.ItemDef;
    export type ItemRef = Define21.ItemRef;
    export type ItemGroupDef = Define21.ItemGroupDef;
    export type ItemGroupDefClass = Define21.ItemGroupDefClass;
    export type ItemGroupDefSubclass = Define21.ItemGroupDefSubclass;
    export type ItemGroupDefClassNames = Define21.ItemGroupDefClassNames;
    export type ItemGroupDefSubclassNames = Define21.ItemGroupDefSubclassNames;
    export type ItemGroupDefPurpose = Define21.ItemGroupDefPurpose;
    export type ValueListDef = Define21.ValueListDef;
    export type CodeList = Define21.CodeList;
    export type CodeListType = Define21.CodeListType;
    export type CommentDef = Define21.CommentDef;
    export type MethodDef = Define21.MethodDef;
    export type Origin = Define21.Origin;
    export type OriginType = Define21.OriginType;
    export type OriginSource = Define21.OriginSource;
    export type Standard = Define21.Standard;
    export type Alias = Define21.Alias;
    export type TranslatedText = Define21.TranslatedText;
    export type Leaf = Define21.Leaf;
    export type DocumentRef = Define21.DocumentRef;
    export type PdfPageRef = Define21.PdfPageRef;
    export type PdfPageRefType = Define21.PdfPageRefType;
    export type WhereClauseDef = Define21.WhereClauseDef;
    export type ExternalCodeList = Define21.ExternalCodeList;
    export type EnumeratedItem = Define21.EnumeratedItem;
    export type CodeListItem = Define21.CodeListItem;
    export type FormalExpression = Define21.FormalExpression;
    export type GlobalVariables = Define21.GlobalVariables;
    export type Study = Define21.Study;
    export type DefineXml = Omit<Define21.DefineXml, "odm"> & {
        odm: Omit<Define21.DefineXml["odm"], "study"> & {
            xmlns_arm: "http://www.cdisc.org/ns/arm/v1.0";
            study: Omit<Define21.DefineXml["odm"]["study"], "metaDataVersion"> & {
                metaDataVersion: MetaDataVersion;
            };
        };
    };
    export type AnalysisDatasets = AnalysisDatasetsCore;
    export type AnalysisDataset = AnalysisDatasetCore;
    export type AnalysisReason = AnalysisReasonCore;
    export type AnalysisPurpose = AnalysisPurposeCore;
    export type ProgrammingCode = ProgrammingCodeCore<Define21.DocumentRef>;
    export type Documentation = DocumentationCore<Define21.TranslatedText, Define21.DocumentRef>;
    export type AnalysisResult = AnalysisResultCore<Define21.TranslatedText, Documentation, ProgrammingCode>;
    export type ResultDisplay = ResultDisplayCore<Define21.TranslatedText, Define21.DocumentRef, AnalysisResult>;
    export type AnalysisResultDisplays = AnalysisResultDisplaysCore<
        ResultDisplayCore<Define21.TranslatedText, Define21.DocumentRef, AnalysisResult>
    >;
    export type MetaDataVersion = Define21.MetaDataVersion & AnalysisResultDisplays;
}

export type DefineXml = ArmDefine20.DefineXml | ArmDefine21.DefineXml | Define20.DefineXml | Define21.DefineXml;
