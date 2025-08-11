// ARM extension for Define-XML MetaDataVersion (works for both 2.0 and 2.1)
import type {
    DefineXml as DefineXml20,
    MetaDataVersion as DefineMetaDataVersion20,
    TranslatedText as Description20,
    DocumentRef as DocumentRef20,
    WhereClauseRef as WhereClauseRef20,
} from "interfaces/define.xml.20";
import type {
    DefineXml as DefineXml21,
    MetaDataVersion as DefineMetaDataVersion21,
    TranslatedText as Description21,
    DocumentRef as DocumentRef21,
    WhereClauseRef as WhereClauseRef21,
} from "interfaces/define.xml.21";

// --- ARM GENERIC INTERFACES ---
interface AnalysisResultDisplays<ResultDisplay> {
    resultDisplays: Record<string, ResultDisplay>;
    resultDisplayOrder: string[];
}

interface ResultDisplay<Description, DocumentRef, AnalysisResult> {
    oid: string;
    name: string;
    descriptions: Description[];
    documents: DocumentRef[];
    analysisResults: Record<string, AnalysisResult>;
    analysisResultOrder: string[];
}

interface AnalysisResult<Description, AnalysisDatasets, Documentation, ProgrammingCode> {
    oid: string;
    parameterOid?: string;
    analysisReason: string;
    analysisPurpose: string;
    descriptions: Description[];
    analysisDatasets: AnalysisDatasets;
    documentation?: Documentation;
    programmingCode?: ProgrammingCode;
}

interface AnalysisDatasets<AnalysisDataset> {
    analysisDatasets: Record<string, AnalysisDataset>;
    analysisDatasetOrder: string[];
    analysisDatasetsCommentOid?: string;
}

interface AnalysisDataset<WhereClauseRef> {
    itemGroupOid: string;
    whereClauseOid?: string;
    whereClauseRefs?: WhereClauseRef[];
    analysisVariableOids: string[];
}

interface Documentation<Description, DocumentRef> {
    descriptions: Description[];
    documents: DocumentRef[];
}

interface ProgrammingCode<DocumentRef> {
    context?: string;
    code?: string;
    documents: DocumentRef[];
}

// ARM Interfaces for Define-XML 2.0
export type AnalysisResultDisplays20 = AnalysisResultDisplays<
    ResultDisplay<Description20, DocumentRef20, AnalysisResult20>
>;
export type ResultDisplay20 = ResultDisplay<Description20, DocumentRef20, AnalysisResult20>;
export type AnalysisResult20 = AnalysisResult<Description20, AnalysisDatasets20, Documentation20, ProgrammingCode20>;
export type AnalysisDatasets20 = AnalysisDatasets<AnalysisDataset20>;
export type AnalysisDataset20 = AnalysisDataset<WhereClauseRef20>;
export type Documentation20 = Documentation<Description20, DocumentRef20>;
export type ProgrammingCode20 = ProgrammingCode<DocumentRef20>;

type MetaDataVersion20 = DefineMetaDataVersion20 & AnalysisResultDisplays20;

// ARM-extended DefineXml for 2.0
export type ArmDefineXml20 = Omit<DefineXml20, "odm"> & {
    odm: Omit<DefineXml20["odm"], "study"> & {
        xml_ns: string;
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
export type AnalysisResult21 = AnalysisResult<
    Description21,
    ArmAnalysisDatasets21,
    ArmDocumentation21,
    ArmProgrammingCode21
>;
export type ArmAnalysisDatasets21 = AnalysisDatasets<ArmAnalysisDataset21>;
export type ArmAnalysisDataset21 = AnalysisDataset<WhereClauseRef21>;
export type ArmDocumentation21 = Documentation<Description21, DocumentRef21>;
export type ArmProgrammingCode21 = ProgrammingCode<DocumentRef21>;

// Generic ARM MetaDataVersion extension
type MetaDataVersion21 = DefineMetaDataVersion21 & AnalysisResultDisplays21;

// ARM-extended DefineXml for 2.1
export type ArmDefineXml21 = Omit<DefineXml21, "odm"> & {
    odm: Omit<DefineXml21["odm"], "study"> & {
        xml_ns: string;
        study: Omit<DefineXml21["odm"]["study"], "metaDataVersion"> & {
            metaDataVersion: MetaDataVersion21;
        };
    };
};
