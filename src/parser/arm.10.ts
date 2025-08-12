/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Parse ARM 1.0 to TypeScript interfaces
 */

import {
    AnalysisDataset,
    AnalysisDatasets,
    AnalysisResultDisplays20,
    ResultDisplay20,
    AnalysisResult20,
    Documentation20,
    ProgrammingCode20,
    ResultDisplay21,
    AnalysisResult21,
    AnalysisResultDisplays21,
    Documentation21,
    ProgrammingCode21,
} from "interfaces/arm.10";
import {
    parseTranslatedText as parseTranslatedText20,
    parseDocumentRefs as parseDocumentRefs20,
} from "parser/define.20.core";
import {
    parseTranslatedText as parseTranslatedText21,
    parseDocumentRefs as parseDocumentRefs21,
} from "parser/define.21.core";

interface ParseAnalysisResultDisplays {
    (analysisResultDisplayRaw: any, defineVer: "2.0"): AnalysisResultDisplays20["analysisResultDisplays"];
    (analysisResultDisplayRaw: any, defineVer: "2.1"): AnalysisResultDisplays21["analysisResultDisplays"];
}

export const parseAnalysisResultDisplays: ParseAnalysisResultDisplays = (analysisResultDisplayRaw, defineVer) => {
    if (defineVer === "2.0") {
        return parseResultDisplay(analysisResultDisplayRaw[0].resultDisplay, "2.0");
    }
    if (defineVer === "2.1") {
        return parseResultDisplay(analysisResultDisplayRaw[0].resultDisplay, "2.1");
    }
    throw new Error(`Unsupported defineVer: ${defineVer}`);
};

interface ParseResultDisplays {
    (resultDisplaysRaw: any[], defineVer: "2.0"): {
        resultDisplays: Record<string, ResultDisplay20>;
        resultDisplayOrder: string[];
    };
    (resultDisplaysRaw: any[], defineVer: "2.1"): {
        resultDisplays: Record<string, ResultDisplay21>;
        resultDisplayOrder: string[];
    };
}

const parseResultDisplay: ParseResultDisplays = (resultDisplaysRaw: any[], defineVer: "2.0" | "2.1"): any => {
    if (defineVer === "2.0") {
        const resultDisplays: Record<string, ResultDisplay20> = {};
        const resultDisplayOrder: string[] = [];
        resultDisplaysRaw.forEach((resultDisplayRaw) => {
            const { analysisResults, analysisResultOrder } = parseAnalysisResults(
                resultDisplayRaw["analysisResult"],
                defineVer
            );
            const resultDisplay: ResultDisplay20 = {
                oid: resultDisplayRaw["$"]["oid"],
                name: resultDisplayRaw["$"]["name"],
                description: resultDisplayRaw["description"].map(parseTranslatedText20),
                analysisResults,
                analysisResultOrder,
            };
            if (resultDisplayRaw["documentRef"]) {
                resultDisplay.documents = parseDocumentRefs20(resultDisplayRaw["documentRef"]);
            }
            resultDisplays[resultDisplay.oid] = resultDisplay;
            resultDisplayOrder.push(resultDisplay.oid);
        });
        return { resultDisplays, resultDisplayOrder };
    } else if (defineVer === "2.1") {
        const resultDisplays: Record<string, ResultDisplay21> = {};
        const resultDisplayOrder: string[] = [];
        resultDisplaysRaw.forEach((resultDisplayRaw) => {
            const { analysisResults, analysisResultOrder } = parseAnalysisResults(
                resultDisplayRaw["analysisResult"],
                defineVer
            );
            const resultDisplay: ResultDisplay21 = {
                oid: resultDisplayRaw["$"]["oid"],
                name: resultDisplayRaw["$"]["name"],
                description: resultDisplayRaw["description"].map(parseTranslatedText21),
                analysisResults,
                analysisResultOrder,
            };
            if (resultDisplayRaw["documentRef"]) {
                resultDisplay.documents = parseDocumentRefs21(resultDisplayRaw["documentRef"]);
            }
            resultDisplays[resultDisplay.oid] = resultDisplay;
            resultDisplayOrder.push(resultDisplay.oid);
        });
        return { resultDisplays, resultDisplayOrder };
    }
};

interface ParseAnalysisResults {
    (analysisResultRaw: any, defineVer: "2.0"): {
        analysisResults: Record<string, AnalysisResult20>;
        analysisResultOrder: string[];
    };
    (analysisResultRaw: any, defineVer: "2.1"): {
        analysisResults: Record<string, AnalysisResult21>;
        analysisResultOrder: string[];
    };
}

const parseAnalysisResults: ParseAnalysisResults = (analysisResultRaw: any[], defineVer) => {
    const analysisResults: Record<string, AnalysisResult20 | AnalysisResult21> = {};
    const analysisResultOrder: string[] = [];
    analysisResultRaw.forEach((arRaw) => {
        const analysisResult = parseAnalysisResult(arRaw, defineVer);
        analysisResults[analysisResult.oid] = analysisResult;
        analysisResultOrder.push(analysisResult.oid);
    });
    return { analysisResults, analysisResultOrder };
};

const parseAnalysisResult = (analysisResultRaw: any, defineVer: "2.0" | "2.1"): AnalysisResult20 | AnalysisResult21 => {
    const commonAttributes = {
        oid: analysisResultRaw["$"]["oid"],
        parameterOid: analysisResultRaw["$"]["parameterOid"],
        analysisReason: analysisResultRaw["$"]["analysisReason"],
        analysisPurpose: analysisResultRaw["$"]["analysisPurpose"],
        description: analysisResultRaw["description"].map(parseTranslatedText20),
        analysisDatasets: parseAnalysisDatasets(analysisResultRaw["analysisDatasets"]),
    };
    // Remove parameterOid if not present as it is optional
    if (!analysisResultRaw.parameterOid) {
        delete commonAttributes.parameterOid;
    }
    if (defineVer === "2.0") {
        const analysisResult: AnalysisResult20 = {
            ...commonAttributes,
        };
        if (analysisResultRaw["documentation"]) {
            analysisResult.documentation = parseDocumentation(analysisResultRaw["documentation"], defineVer);
        }
        if (analysisResultRaw["programmingCode"]) {
            const programmingCode: ProgrammingCode20 = {};
            if (analysisResultRaw["programmingCode"]["$"]) {
                if (analysisResultRaw["programmingCode"]["$"]["context"]) {
                    programmingCode.context = analysisResultRaw["programmingCode"]["$"]["context"];
                }
                if (analysisResultRaw["programmingCode"]["$"]["code"]) {
                    programmingCode.code = analysisResultRaw["programmingCode"]["$"]["code"];
                }
            }
            if (analysisResultRaw["programmingCode"]["documentRef"]) {
                programmingCode.documents = parseDocumentRefs20(analysisResultRaw["programmingCode"]["documentRef"]);
            }
            analysisResult.programmingCode = programmingCode;
        }
        return analysisResult;
    } else if (defineVer === "2.1") {
        const analysisResult: AnalysisResult21 = {
            ...commonAttributes,
        };
        if (analysisResultRaw["documentation"]) {
            analysisResult.documentation = parseDocumentation(analysisResultRaw["documentation"], defineVer);
        }
        if (analysisResultRaw["programmingCode"]) {
            const programmingCode: ProgrammingCode21 = {};
            if (analysisResultRaw["programmingCode"]["$"]) {
                if (analysisResultRaw["programmingCode"]["$"]["context"]) {
                    programmingCode.context = analysisResultRaw["programmingCode"]["$"]["context"];
                }
                if (analysisResultRaw["programmingCode"]["$"]["code"]) {
                    programmingCode.code = analysisResultRaw["programmingCode"]["$"]["code"];
                }
            }
            if (analysisResultRaw["programmingCode"]["documentRef"]) {
                programmingCode.documents = parseDocumentRefs21(analysisResultRaw["programmingCode"]["documentRef"]);
            }
            analysisResult.programmingCode = programmingCode;
        }
        return analysisResult;
    }
    throw new Error(`Unsupported defineVer: ${defineVer}`);
};

const parseAnalysisDatasets = (analysisDatasetsRaw: any): AnalysisDatasets => {
    const analysisDatasets: Record<string, AnalysisDataset> = {};
    const analysisDatasetsOrder: string[] = [];
    analysisDatasetsRaw[0].analysisDataset.forEach((analysisDatasetRaw: any) => {
        const analysisDataset = parseAnalysisDataset(analysisDatasetRaw);
        analysisDatasets[analysisDataset.itemGroupOid] = analysisDataset;
        analysisDatasetsOrder.push(analysisDataset.itemGroupOid);
    });
    const result: AnalysisDatasets = {
        analysisDatasets,
        analysisDatasetsOrder,
    };
    if (analysisDatasetsRaw[0]["$"]?.commentOid) {
        result.commentOid = analysisDatasetsRaw[0]["$"]["commentOid"];
    }
    return result;
};

const parseAnalysisDataset = (analysisDatasetRaw: any): AnalysisDataset => {
    const analysisDataset: AnalysisDataset = {
        itemGroupOid: analysisDatasetRaw["$"]["itemGroupOid"],
    };
    if (analysisDatasetRaw["whereClauseRef"]) {
        analysisDataset.whereClauseRefs = analysisDatasetRaw["whereClauseRef"].map(
            (ref: any) => ref["$"]["whereClauseOid"]
        );
    }
    if (analysisDatasetRaw["analysisVariable"]) {
        analysisDataset.analysisVariables = analysisDatasetRaw["analysisVariable"].map(
            (analysisVariable: any) => analysisVariable["$"]["itemOid"]
        );
    }
    return analysisDataset;
};

interface ParseDocumentation {
    (documentationRaw: any[], defineVer: "2.0"): Documentation20;
    (documentationRaw: any[], defineVer: "2.1"): Documentation21;
}

const parseDocumentation: ParseDocumentation = (documentationRaw, defineVer): Documentation20 | Documentation21 => {
    if (defineVer === "2.0") {
        const documentation: Documentation20 = {
            description: documentationRaw[0]["description"].map(parseTranslatedText20),
        };
        if (documentationRaw[0]["documentRef"]) {
            documentation.documents = parseDocumentRefs20(documentationRaw[0]["documentRef"]);
        }
        return documentation;
    }
    if (defineVer === "2.1") {
        const documentation: Documentation21 = {
            description: documentationRaw[0]["description"].map(parseTranslatedText21),
        };
        if (documentationRaw[0]["documentRef"]) {
            documentation.documents = documentationRaw[0]["documentRef"].map(parseDocumentRefs21);
        }
        return documentation;
    }
    throw new Error(`Unsupported defineVer: ${defineVer}`);
};
