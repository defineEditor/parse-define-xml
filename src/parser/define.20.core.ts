/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Core functions to parse Define XML 2.0 and ARM
 */

import { Define20 } from "interfaces/define.xml.20";

const parsePdfPageRefs = (pdfPageRefsRaw: any[]): Define20.PdfPageRef[] => {
    // There are no PDF page references
    if (!pdfPageRefsRaw) return [];

    return pdfPageRefsRaw.map((ref) => {
        const result: Define20.PdfPageRef = {
            type: ref["$"]["type"] as Define20.PdfPageRefType,
            pageRefs: ref["$"]["pageRefs"],
        };
        if (ref["$"]["firstPage"]) {
            result.firstPage = Number(ref["$"]["firstPage"]);
        }
        if (ref["$"]["lastPage"]) {
            result.lastPage = Number(ref["$"]["lastPage"]);
        }

        return result;
    });
};

export const parseDocumentRefs = (documentRefsRaw: any[]): Define20.DocumentRef[] => {
    if (!documentRefsRaw) return [];
    // Flatten all documentRef arrays from each object in documentRefsRaw
    const refs = documentRefsRaw.flatMap((obj) => obj.documentRef ?? [obj]);

    return refs.map((docRef) => {
        const result: Define20.DocumentRef = { leafId: docRef["$"] && docRef["$"].leafId };
        if (docRef["pDFPageRef"]) {
            result.pdfPageRefs = parsePdfPageRefs(docRef["pDFPageRef"]);
        }
        return result;
    });
};
