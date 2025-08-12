// ARM extension for Define-XML MetaDataVersion (works for both 2.0 and 2.1)
import type {
    DefineXml as DefineXml20,
    MetaDataVersion as DefineMetaDataVersion20,
    TranslatedText as Description20,
    DocumentRef as DocumentRef20,
} from "interfaces/define.xml.20";
import type {
    DefineXml as DefineXml21,
    MetaDataVersion as DefineMetaDataVersion21,
    TranslatedText as Description21,
    DocumentRef as DocumentRef21,
} from "interfaces/define.xml.21";

// ARM generic interfaces
interface AnalysisResultDisplays<ResultDisplay> {
    analysisResultDisplays: {
        resultDisplays: Record<string, ResultDisplay>;
        resultDisplayOrder: string[];
    };
}

interface ResultDisplay<Description, DocumentRef, AnalysisResult> {
    oid: string;
    name: string;
    description: Description[];
    analysisResults: Record<string, AnalysisResult>;
    analysisResultOrder: string[];
    documents?: DocumentRef[];
}

export type AnalysisReason =
    | "DATA DRIVEN"
    | "REQUESTED BY REGULATORY AGENCY"
    | "SPECIFIED IN PROTOCOL"
    | "SPECIFIED IN SAP"
    | string;
export type AnalysisPurpose =
    | "EXPLORATORY OUTCOME MEASURE"
    | "PRIMARY OUTCOME MEASURE"
    | "SECONDARY OUTCOME MEASURE"
    | string;

interface AnalysisResult<Description, Documentation, ProgrammingCode> {
    oid: string;
    parameterOid?: string;
    analysisReason: AnalysisReason;
    analysisPurpose: AnalysisPurpose;
    description: Description[];
    analysisDatasets: AnalysisDatasets;
    documentation?: Documentation;
    programmingCode?: ProgrammingCode;
}

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

interface Documentation<Description, DocumentRef> {
    description: Description[];
    documents?: DocumentRef[];
}

interface ProgrammingCode<DocumentRef> {
    context?: string;
    code?: string;
    documents?: DocumentRef[];
}

// ARM Interfaces for Define-XML 2.0
export type AnalysisResultDisplays20 = AnalysisResultDisplays<
    ResultDisplay<Description20, DocumentRef20, AnalysisResult20>
>;
export type ResultDisplay20 = ResultDisplay<Description20, DocumentRef20, AnalysisResult20>;
export type AnalysisResult20 = AnalysisResult<Description20, Documentation20, ProgrammingCode20>;
export type Documentation20 = Documentation<Description20, DocumentRef20>;
export type ProgrammingCode20 = ProgrammingCode<DocumentRef20>;

type MetaDataVersion20 = DefineMetaDataVersion20 & AnalysisResultDisplays20;

// ARM-extended DefineXml for 2.0
export type ArmDefineXml20 = Omit<DefineXml20, "odm"> & {
    odm: Omit<DefineXml20["odm"], "study"> & {
        xmlns_arm: "http://www.cdisc.org/ns/arm/v1.0";
        study: Omit<DefineXml20["odm"]["study"], "metaDataVersion"> & {
            metaDataVersion: MetaDataVersion20;
        };
    };
};

// ARM Interfaces for Define-XML 2.1
export type AnalysisResultDisplays21 = AnalysisResultDisplays<
    ResultDisplay<Description21, DocumentRef21, AnalysisResult21>
>;
export type ResultDisplay21 = ResultDisplay<Description21, DocumentRef21, AnalysisResult21>;
export type Documentation21 = Documentation<Description21, DocumentRef21>;
export type ProgrammingCode21 = ProgrammingCode<DocumentRef21>;
export type AnalysisResult21 = AnalysisResult<Description21, Documentation21, ProgrammingCode21>;

// Generic ARM MetaDataVersion extension
type MetaDataVersion21 = DefineMetaDataVersion21 & AnalysisResultDisplays21;

// ARM-extended DefineXml for 2.1
export type ArmDefineXml21 = Omit<DefineXml21, "odm"> & {
    odm: Omit<DefineXml21["odm"], "study"> & {
        xmlns_arm: "http://www.cdisc.org/ns/arm/v1.0";
        study: Omit<DefineXml21["odm"]["study"], "metaDataVersion"> & {
            metaDataVersion: MetaDataVersion21;
        };
    };
};
