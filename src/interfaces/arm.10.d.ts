// ARM extension for Define-XML MetaDataVersion (works for both 2.0 and 2.1)
import { Define20 } from "interfaces/define.xml.20";
import { Define21 } from "interfaces/define.xml.21";

// ARM generic interfaces

type AnalysisReason =
    | "DATA DRIVEN"
    | "REQUESTED BY REGULATORY AGENCY"
    | "SPECIFIED IN PROTOCOL"
    | "SPECIFIED IN SAP"
    | string;
type AnalysisPurpose = "EXPLORATORY OUTCOME MEASURE" | "PRIMARY OUTCOME MEASURE" | "SECONDARY OUTCOME MEASURE" | string;

interface AnalysisDataset {
    itemGroupOid: string;
    whereClauseOid?: string;
    whereClauseRefs?: string[];
    analysisVariables?: string[];
}
interface AnalysisDatasets {
    analysisDatasets: Record<string, AnalysisDataset>;
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
    analysisReason: AnalysisReason;
    analysisPurpose: AnalysisPurpose;
    description: TranslatedText[];
    analysisDatasets: AnalysisDatasets;
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
export namespace ArmDefine20 {
    export type ProgrammingCode = ProgrammingCodeCore<Define20.DocumentRef>;
    export type Documentation = DocumentationCore<Define20.TranslatedText, Define20.DocumentRef>;
    export type AnalysisResult = AnalysisResultCore<Define20.TranslatedText, Documentation, ProgrammingCode>;
    export type ResultDisplay = ResultDisplayCore<Define20.TranslatedText, Define20.DocumentRef, AnalysisResult>;

    export type AnalysisResultDisplays = AnalysisResultDisplaysCore<
        ResultDisplayCore<Define20.TranslatedText, Define20.DocumentRef, AnalysisResult>
    >;

    type MetaDataVersion = Define20.MetaDataVersion & AnalysisResultDisplays;

    // ARM-extended DefineXml for 2.0
    export type DefineXml = Omit<Define20.DefineXml, "odm"> & {
        odm: Omit<Define20.DefineXml["odm"], "study"> & {
            xmlns_arm: "http://www.cdisc.org/ns/arm/v1.0";
            study: Omit<Define20.DefineXml["odm"]["study"], "metaDataVersion"> & {
                metaDataVersion: MetaDataVersion;
            };
        };
    };
}

// ARM Interfaces for Define-XML 2.1
export namespace ArmDefine21 {
    export type ProgrammingCode = ProgrammingCodeCore<Define21.DocumentRef>;
    export type Documentation = DocumentationCore<Define21.TranslatedText, Define21.DocumentRef>;
    export type AnalysisResult = AnalysisResultCore<Define21.TranslatedText, Documentation, ProgrammingCode>;
    export type ResultDisplay = ResultDisplayCore<Define21.TranslatedText, Define21.DocumentRef, AnalysisResult>;

    export type AnalysisResultDisplays = AnalysisResultDisplaysCore<
        ResultDisplayCore<Define21.TranslatedText, Define21.DocumentRef, AnalysisResult>
    >;

    type MetaDataVersion = Define21.MetaDataVersion & AnalysisResultDisplays;

    // ARM-extended DefineXml for 2.1
    export type DefineXml = Omit<Define21.DefineXml, "odm"> & {
        odm: Omit<Define21.DefineXml["odm"], "study"> & {
            xmlns_arm: "http://www.cdisc.org/ns/arm/v1.0";
            study: Omit<Define21.DefineXml["odm"]["study"], "metaDataVersion"> & {
                metaDataVersion: MetaDataVersion;
            };
        };
    };
}
