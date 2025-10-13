/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Parse ARM 1.0 to TypeScript interfaces
 */

import type { ArmDefine20, ArmDefine21 } from "../interfaces/arm.10";
import type { AnalysisDatasetCore, AnalysisDatasetsCore } from "../interfaces/arm.10";
import { parseTranslatedText } from "./define.core";
import { parseDocumentRefs as parseDocumentRefs20 } from "./define.20.core";
import { parseDocumentRefs as parseDocumentRefs21 } from "./define.21.core";

interface ParseAnalysisResultDisplays {
    (analysisResultDisplayRaw: any, defineVer: "2.0"): ArmDefine20.AnalysisResultDisplays["analysisResultDisplays"];
    (analysisResultDisplayRaw: any, defineVer: "2.1"): ArmDefine21.AnalysisResultDisplays["analysisResultDisplays"];
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
        resultDisplays: Record<string, ArmDefine20.ResultDisplay>;
        resultDisplayOrder: string[];
    };
    (resultDisplaysRaw: any[], defineVer: "2.1"): {
        resultDisplays: Record<string, ArmDefine21.ResultDisplay>;
        resultDisplayOrder: string[];
    };
}

const parseResultDisplay: ParseResultDisplays = (resultDisplaysRaw: any[], defineVer: "2.0" | "2.1"): any => {
    if (defineVer === "2.0") {
        const resultDisplays: Record<string, ArmDefine20.ResultDisplay> = {};
        const resultDisplayOrder: string[] = [];
        resultDisplaysRaw.forEach((resultDisplayRaw) => {
            const { analysisResults, analysisResultOrder } = parseAnalysisResults(
                resultDisplayRaw["analysisResult"],
                defineVer
            );
            const resultDisplay: ArmDefine20.ResultDisplay = {
                oid: resultDisplayRaw["$"]["oid"],
                name: resultDisplayRaw["$"]["name"],
                description: resultDisplayRaw["description"].map(parseTranslatedText),
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
        const resultDisplays: Record<string, ArmDefine21.ResultDisplay> = {};
        const resultDisplayOrder: string[] = [];
        resultDisplaysRaw.forEach((resultDisplayRaw) => {
            const { analysisResults, analysisResultOrder } = parseAnalysisResults(
                resultDisplayRaw["analysisResult"],
                defineVer
            );
            const resultDisplay: ArmDefine21.ResultDisplay = {
                oid: resultDisplayRaw["$"]["oid"],
                name: resultDisplayRaw["$"]["name"],
                description: resultDisplayRaw["description"].map(parseTranslatedText),
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
        analysisResults: Record<string, ArmDefine20.AnalysisResult>;
        analysisResultOrder: string[];
    };
    (analysisResultRaw: any, defineVer: "2.1"): {
        analysisResults: Record<string, ArmDefine21.AnalysisResult>;
        analysisResultOrder: string[];
    };
}

const parseAnalysisResults: ParseAnalysisResults = (analysisResultRaw: any[], defineVer) => {
    const analysisResults: Record<string, ArmDefine20.AnalysisResult | ArmDefine21.AnalysisResult> = {};
    const analysisResultOrder: string[] = [];
    analysisResultRaw.forEach((arRaw) => {
        const analysisResult = parseAnalysisResult(arRaw, defineVer);
        analysisResults[analysisResult.oid] = analysisResult;
        analysisResultOrder.push(analysisResult.oid);
    });
    return { analysisResults, analysisResultOrder };
};

const parseAnalysisResult = (
    analysisResultRaw: any,
    defineVer: "2.0" | "2.1"
): ArmDefine20.AnalysisResult | ArmDefine21.AnalysisResult => {
    const commonAttributes = {
        oid: analysisResultRaw["$"]["oid"],
        parameterOid: analysisResultRaw["$"]["parameterOid"],
        analysisReason: analysisResultRaw["$"]["analysisReason"],
        analysisPurpose: analysisResultRaw["$"]["analysisPurpose"],
        description: analysisResultRaw["description"].map(parseTranslatedText),
        analysisDatasets: parseAnalysisDatasets(analysisResultRaw["analysisDatasets"]),
    };
    // Remove parameterOid if not present as it is optional
    if (!analysisResultRaw.parameterOid) {
        delete commonAttributes.parameterOid;
    }
    if (defineVer === "2.0") {
        const analysisResult: ArmDefine20.AnalysisResult = {
            ...commonAttributes,
        };
        if (analysisResultRaw["documentation"]) {
            analysisResult.documentation = parseDocumentation(analysisResultRaw["documentation"], defineVer);
        }
        if (analysisResultRaw["programmingCode"]) {
            const programmingCode: ArmDefine20.ProgrammingCode = {};
            if (analysisResultRaw["programmingCode"][0] && analysisResultRaw["programmingCode"][0]["$"]) {
                if (analysisResultRaw["programmingCode"][0]["$"]["context"]) {
                    programmingCode.context = analysisResultRaw["programmingCode"][0]["$"]["context"];
                }
                if (analysisResultRaw["programmingCode"][0]["code"]) {
                    programmingCode.code = analysisResultRaw["programmingCode"][0]["code"];
                }
            }
            if (analysisResultRaw["programmingCode"][0]["documentRef"]) {
                programmingCode.documents = parseDocumentRefs20(analysisResultRaw["programmingCode"][0]["documentRef"]);
            }
            analysisResult.programmingCode = programmingCode;
        }
        return analysisResult;
    } else if (defineVer === "2.1") {
        const analysisResult: ArmDefine21.AnalysisResult = {
            ...commonAttributes,
        };
        if (analysisResultRaw["documentation"]) {
            analysisResult.documentation = parseDocumentation(analysisResultRaw["documentation"], defineVer);
        }
        if (analysisResultRaw["programmingCode"]) {
            const programmingCode: ArmDefine21.ProgrammingCode = {};
            if (analysisResultRaw["programmingCode"][0] && analysisResultRaw["programmingCode"][0]["$"]) {
                if (analysisResultRaw["programmingCode"][0]["$"]["context"]) {
                    programmingCode.context = analysisResultRaw["programmingCode"][0]["$"]["context"];
                }
                if (analysisResultRaw["programmingCode"][0]["code"]) {
                    programmingCode.code = analysisResultRaw["programmingCode"][0]["code"];
                }
            }
            if (analysisResultRaw["programmingCode"][0]["documentRef"]) {
                programmingCode.documents = parseDocumentRefs21(analysisResultRaw["programmingCode"][0]["documentRef"]);
            }
            analysisResult.programmingCode = programmingCode;
        }
        return analysisResult;
    }
    throw new Error(`Unsupported defineVer: ${defineVer}`);
};

const parseAnalysisDatasets = (analysisDatasetsRaw: any): AnalysisDatasetsCore => {
    const analysisDatasets: Record<string, AnalysisDatasetCore> = {};
    const analysisDatasetsOrder: string[] = [];
    analysisDatasetsRaw[0].analysisDataset.forEach((analysisDatasetRaw: any) => {
        const analysisDataset = parseAnalysisDataset(analysisDatasetRaw);
        analysisDatasets[analysisDataset.itemGroupOid] = analysisDataset;
        analysisDatasetsOrder.push(analysisDataset.itemGroupOid);
    });
    const result: AnalysisDatasetsCore = {
        analysisDatasets,
        analysisDatasetsOrder,
    };
    if (analysisDatasetsRaw[0]["$"]?.commentOid) {
        result.commentOid = analysisDatasetsRaw[0]["$"]["commentOid"];
    }
    return result;
};

const parseAnalysisDataset = (analysisDatasetRaw: any): AnalysisDatasetCore => {
    const analysisDataset: AnalysisDatasetCore = {
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
    (documentationRaw: any[], defineVer: "2.0"): ArmDefine20.Documentation;
    (documentationRaw: any[], defineVer: "2.1"): ArmDefine21.Documentation;
}

const parseDocumentation: ParseDocumentation = (
    documentationRaw,
    defineVer
): ArmDefine20.Documentation | ArmDefine21.Documentation => {
    if (defineVer === "2.0") {
        const documentation: ArmDefine20.Documentation = {
            description: documentationRaw[0]["description"].map(parseTranslatedText),
        };
        if (documentationRaw[0]["documentRef"]) {
            documentation.documents = parseDocumentRefs20(documentationRaw[0]["documentRef"]);
        }
        return documentation;
    }
    if (defineVer === "2.1") {
        const documentation: ArmDefine21.Documentation = {
            description: documentationRaw[0]["description"].map(parseTranslatedText),
        };
        if (documentationRaw[0]["documentRef"]) {
            documentation.documents = parseDocumentRefs21(documentationRaw[0]["documentRef"]);
        }
        return documentation;
    }
    throw new Error(`Unsupported defineVer: ${defineVer}`);
};
