// Define-XML Core definitions for version 2.0 and 2.1 (attributes use lowerCamelCase comparing to the XML specification)
export type ItemGroupDefClassNames =
    | "ADAM OTHER"
    | "BASIC DATA STRUCTURE"
    | "DEVICE LEVEL ANALYSIS DATASET"
    | "EVENTS"
    | "FINDINGS ABOUT"
    | "FINDINGS"
    | "INTERVENTIONS"
    | "MEDICAL DEVICE BASIC DATA STRUCTURE"
    | "MEDICAL DEVICE OCCURRENCE DATA STRUCTURE"
    | "OCCURRENCE DATA STRUCTURE"
    | "REFERENCE DATA STRUCTURE"
    | "RELATIONSHIP"
    | "SPECIAL PURPOSE"
    | "STUDY REFERENCE"
    | "SUBJECT LEVEL ANALYSIS DATASET"
    | "TRIAL DESIGN";
export type ItemGroupDefSubclassNames =
    | "NON-COMPARTMENTAL ANALYSIS"
    | "POPULATION PHARMACOKINETIC ANALYSIS"
    | "TIME-TO-EVENT"
    | "MEDICAL DEVICE TIME-TO-EVENT"
    | "ADVERSE EVENT";
export type ItemGroupDefPurpose = "Tabulation" | "Analysis";
export type PdfPageRefType = "PhysicalRef" | "NamedDestination";
export type Comparator = "LT" | "LE" | "GT" | "GE" | "EQ" | "NE" | "IN" | "NOTIN";
export type SoftHard = "Soft" | "Hard";
export type CodeListType = "text" | "float" | "integer";
export type ItemDefDataType = "text" | "float" | "integer" | "date" | "datetime";
export type StandardName =
    | "ADaM-OCCDSIG"
    | "ADaMIG"
    | "ADaMIG-MD"
    | "ADaMIG-NCA"
    | "ADaMIG-popPK"
    | "BIMO"
    | "CDISC/NCI"
    | "SDTMIG"
    | "SDTMIG-AP"
    | "SDTMIG-MD"
    | "SENDIG"
    | "SENDIG-AR"
    | "SENDIG-DART"
    | "SENDIG-GENETOX";
export type StandardType = "CT" | "IG";
export type StandardStatus = "FINAL" | "DRAFT" | "PROVISIONAL" | string;

// Common interfaces between 2.0 and 2.1
export interface Alias {
    context: string;
    name: string;
}

export interface TranslatedText {
    xml_lang?: string;
    value: string;
}

export interface Leaf {
    id: string;
    xlink_href: string;
    title: string;
}

export interface WhereClauseDef {
    oid: string;
    commentOid?: string;
    rangeChecks: RangeCheck[];
}

export interface RangeCheck {
    comparator: Comparator;
    softHard: SoftHard;
    itemOid: string;
    checkValues: string[];
}

export interface ExternalCodeList {
    dictionary: string;
    version: string;
    ref?: string;
    href?: string;
}

export interface EnumeratedItem {
    codedValue: string;
    rank?: number;
    orderNumber?: number;
    extendedValue?: true;
    alias?: Alias[];
}

export interface CodeListItem {
    codedValue: string;
    rank?: number;
    orderNumber?: number;
    extendedValue?: true;
    decode: TranslatedText[];
    alias?: Alias[];
}

export interface FormalExpression {
    context: string;
    value: string;
}

export interface GlobalVariables {
    studyName: string;
    studyDescription: string;
    protocolName: string;
}
