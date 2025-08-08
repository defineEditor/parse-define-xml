// Define-XML Core interfaces for version 2.0 and 2.1 (attributes use lowerCamelCase comparing to the XML specification)

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
/*
NON-COMPARTMENTAL ANALYSIS
*/
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
