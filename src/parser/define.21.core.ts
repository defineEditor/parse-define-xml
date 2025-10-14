/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Core functions to parse Define XML 2.1 and ARM
 */

import type { Define21 } from "../interfaces/define.xml.21";

const parsePdfPageRefs = (pdfPageRefsRaw: any[]): Define21.PdfPageRef[] => {
    // There are no PDF page references
    if (!pdfPageRefsRaw) return [];

    return pdfPageRefsRaw.map((ref) => {
        const result: Define21.PdfPageRef = {
            type: ref["$"]["type"] as Define21.PdfPageRefType,
            pageRefs: ref["$"]["pageRefs"],
        };
        if (ref["$"]["firstPage"]) {
            result.firstPage = Number(ref["$"]["firstPage"]);
        }
        if (ref["$"]["lastPage"]) {
            result.lastPage = Number(ref["$"]["lastPage"]);
        }
        if (ref["$"]["title"]) {
            result.title = ref["$"]["title"];
        }

        return result;
    });
};

export const parseDocumentRefs = (documentRefsRaw: any[]): Define21.DocumentRef[] => {
    if (!documentRefsRaw) return [];
    // Flatten all documentRef arrays from each object in documentRefsRaw
    const refs = documentRefsRaw.flatMap((obj) => obj.documentRef ?? [obj]);

    return refs.map((docRef) => {
        const result: Define21.DocumentRef = { leafId: docRef["$"] && docRef["$"].leafId };
        if (docRef["pDFPageRef"]) {
            result.pdfPageRefs = parsePdfPageRefs(docRef["pDFPageRef"]);
        }
        return result;
    });
};
