import fs from "fs";
import path from "path";
import parseDefineXml from "parser/define";
import { MetaDataVersion20, MetaDataVersion21 } from "interfaces/arm.10";

describe("ARM 1.0 for Define-XML 2.0 Parser", () => {
    let xmlStringAdam20: string;
    let xmlStringAdam21: string;

    beforeAll(() => {
        // Load the sample Define-XML file
        xmlStringAdam20 = fs.readFileSync(path.join(__dirname, "data/define.adam.20.arm.xml"), "utf-8");
        xmlStringAdam21 = fs.readFileSync(path.join(__dirname, "data/define.adam.21.arm.xml"), "utf-8");
    });

    it("should have analysisResultDisplays for Define-XML 2.0", async () => {
        const defineXml = await parseDefineXml(xmlStringAdam20, "2.0", true);
        expect(defineXml.odm).toBeDefined();
        expect(defineXml.odm.study).toBeDefined();
        expect(defineXml.odm.study.studyOid).toBeTruthy();
        expect(defineXml.odm.study.globalVariables).toBeDefined();
        expect(defineXml.odm.study.metaDataVersion).toBeDefined();
        expect(defineXml.odm.study.metaDataVersion.analysisResultDisplays).toBeDefined();
    });

    describe("ARM Snapshots for Define-XML 2.0", () => {
        let mdv: MetaDataVersion20;
        beforeAll(async () => {
            const defineXml = await parseDefineXml(xmlStringAdam20, "2.0", true);
            mdv = defineXml.odm.study.metaDataVersion;
        });

        it("should match result display snapshot", () => {
            const rd = mdv.analysisResultDisplays.resultDisplays["RD.Table_14-5.02"];
            expect(rd).toMatchSnapshot();
        });
    });

    describe("ARM Snapshots for Define-XML 2.1", () => {
        let mdv: MetaDataVersion21;
        beforeAll(async () => {
            const defineXml = await parseDefineXml(xmlStringAdam21, "2.1", true);
            mdv = defineXml.odm.study.metaDataVersion;
        });

        it("should match result display snapshot", () => {
            const rd = mdv.analysisResultDisplays.resultDisplays["RD.Table14.3.01"];
            expect(rd).toMatchSnapshot();
        });
    });
});
