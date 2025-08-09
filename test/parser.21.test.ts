import fs from "fs";
import path from "path";
import parseDefineXml from "parser/define.21";
import { MetaDataVersion } from "interfaces/define.xml.21";

describe("Define-XML 2.0 Parser", () => {
    let xmlStringAdam: string;
    let xmlStringSdtm: string;

    beforeAll(() => {
        // Load the sample Define-XML file
        xmlStringAdam = fs.readFileSync(path.join(__dirname, "data/define.adam.21.xml"), "utf-8");
        xmlStringSdtm = fs.readFileSync(path.join(__dirname, "data/define.sdtm.21.xml"), "utf-8");
    });

    it("should parse ODM root and Study", async () => {
        const odm = await parseDefineXml(xmlStringAdam);
        expect(odm).toBeDefined();
        expect(odm.study).toBeDefined();
        expect(odm.study.studyOid).toBeTruthy();
        expect(odm.study.globalVariables).toBeDefined();
        expect(odm.study.metaDataVersion).toBeDefined();
    });

    it("should parse ItemGroupDefs and ItemDefs", async () => {
        const odm = await parseDefineXml(xmlStringAdam);
        const mdv = odm.study.metaDataVersion;
        expect(mdv.itemGroupDefs).toBeInstanceOf(Object);
        expect(Array.isArray(mdv.itemGroupDefsOrder)).toBe(true);
        expect(mdv.itemDefs).toBeInstanceOf(Object);
        expect(Array.isArray(mdv.itemDefsOrder)).toBe(true);
    });

    it("should parse CodeLists and ValueListDefs", async () => {
        const odm = await parseDefineXml(xmlStringAdam);
        const mdv = odm.study.metaDataVersion;
        expect(mdv.codeLists).toBeInstanceOf(Object);
        expect(Array.isArray(mdv.codeListsOrder)).toBe(true);
        expect(mdv.valueListDefs).toBeInstanceOf(Object);
        expect(Array.isArray(mdv.valueListDefsOrder)).toBe(true);
    });

    it("should parse Leafs and CommentDefs", async () => {
        const odm = await parseDefineXml(xmlStringAdam);
        const mdv = odm.study.metaDataVersion;
        expect(mdv.leafs).toBeInstanceOf(Object);
        expect(Array.isArray(mdv.leafsOrder)).toBe(true);
        expect(mdv.commentDefs).toBeInstanceOf(Object);
        expect(Array.isArray(mdv.commentDefsOrder)).toBe(true);
    });

    describe("SDTM Snapshots", () => {
        let mdv: MetaDataVersion;
        beforeAll(async () => {
            const odm = await parseDefineXml(xmlStringSdtm);
            mdv = odm.study.metaDataVersion;
        });

        it("should match DM itemGroupDef snapshot", () => {
            const ds = mdv.itemGroupDefs["IG.DM"];
            expect(ds).toMatchSnapshot();
        });

        it("should match LBSTNRC itemDef with multiple origins snapshot", () => {
            const variable = mdv.itemDefs["IT.LB.LBSTNRC"];
            expect(variable).toMatchSnapshot();
        });

        it("should match method MT.BMISC snapshot", () => {
            const method = mdv.methodDefs?.["MT.BMISC"];
            expect(method).toMatchSnapshot();
        });

        it("should match comment COM.DOMAIN.DM snapshot", () => {
            const comment = mdv.commentDefs?.["COM.DOMAIN.DM"];
            expect(comment).toMatchSnapshot();
        });

        it("should match code list with extended values snapshot", () => {
            const codeList = mdv.codeLists?.["CL.METHOD"];
            expect(codeList).toMatchSnapshot();
        });

        it("should match external code list snapshot", () => {
            const externalCodeList = mdv.codeLists?.["CL.ISO.COUNTRY"];
            expect(externalCodeList).toMatchSnapshot();
        });
    });

    describe("ADaM Snapshots", () => {
        let mdv: MetaDataVersion;
        beforeAll(async () => {
            const odm = await parseDefineXml(xmlStringAdam);
            mdv = odm.study.metaDataVersion;
        });

        it("should match ADSL itemGroupDef snapshot", () => {
            const ds = mdv.itemGroupDefs["IG.ADAE"];
            expect(ds).toMatchSnapshot();
        });

        it("should match ADQSADAS.AVAL itemDef snapshot", () => {
            const variable = mdv.itemDefs["IT.ADQSADAS.AVAL"];
            expect(variable).toMatchSnapshot();
        });

        it("should match ADQSADAS.TRTSDT itemDef snapshot", () => {
            const variableWithFormat = mdv.itemDefs["IT.ADQSADAS.TRTSDT"];
            expect(variableWithFormat).toMatchSnapshot();
        });

        it("should match whereClause WC.ADQSADAS.AVAL.ACITM01-ACITM14 snapshot", () => {
            const whereClause = mdv.whereClauseDefs?.["WC.ADQSADAS.AVAL.ACITM01-ACITM14"];
            expect(whereClause).toMatchSnapshot();
        });

        it("should match valueList VL.ADQSADAS.AVAL snapshot", () => {
            const valueList = mdv.valueListDefs?.["VL.ADQSADAS.AVAL"];
            expect(valueList).toMatchSnapshot();
        });

        it("should match leaf LF.ADRG snapshot", () => {
            const leaf = mdv.leafs?.["LF.ADRG"];
            expect(leaf).toMatchSnapshot();
        });
    });

    it("should throw error for invalid XML", async () => {
        await expect(parseDefineXml("<notxml>")).rejects.toThrow("XML parsing failed");
    });

    it("should throw error for missing ODM root", async () => {
        const badXml = "<root></root>";
        await expect(parseDefineXml(badXml)).rejects.toThrow("Invalid Define-XML structure: missing ODM root element");
    });
});
