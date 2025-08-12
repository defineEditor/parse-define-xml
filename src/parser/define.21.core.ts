/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Core functions to parse Define XML 2.1 and ARM
 */

import type { DocumentRef, PdfPageRef, PdfPageRefType, TranslatedText } from "interfaces/define.xml.21.d.ts";

export const parseTranslatedText = (translatedTextRaw: any): TranslatedText => {
    const text = translatedTextRaw.translatedText[0];
    const translatedText: TranslatedText = {
        value: text.value || text,
    };
    if (text["$"] && text["$"]["xml:lang"]) {
        translatedText.xml_lang = text["$"]["xml:lang"];
    }
    return translatedText;
};

const parsePdfPageRefs = (pdfPageRefsRaw: any[]): PdfPageRef[] => {
    // There are no PDF page references
    if (!pdfPageRefsRaw) return [];

    return pdfPageRefsRaw.map((ref) => {
        const result: PdfPageRef = {
            type: ref["$"]["type"] as PdfPageRefType,
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

export const parseDocumentRefs = (documentRefsRaw: any[]): DocumentRef[] => {
    if (!documentRefsRaw) return [];
    // Flatten all documentRef arrays from each object in documentRefsRaw
    const refs = documentRefsRaw.flatMap((obj) => obj.documentRef ?? [obj]);

    return refs.map((docRef) => {
        const result: DocumentRef = { leafId: docRef["$"] && docRef["$"].leafId };
        if (docRef["pDFPageRef"]) {
            result.pdfPageRefs = parsePdfPageRefs(docRef["pDFPageRef"]);
        }
        return result;
    });
};
