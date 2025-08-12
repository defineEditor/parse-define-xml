import fs from "fs";
import path from "path";
import parseDefineXml from "parser/define.20";
import { MetaDataVersion20 } from "interfaces/arm.10";

describe("ARM 1.0 for Define-XML 2.0 Parser", () => {
    let xmlStringAdam: string;

    beforeAll(() => {
        // Load the sample Define-XML file
        xmlStringAdam = fs.readFileSync(path.join(__dirname, "data/define.adam.20.arm.xml"), "utf-8");
    });

    it("should have analysisResultDisplays", async () => {
        const defineXml = await parseDefineXml(xmlStringAdam, true);
        expect(defineXml.odm).toBeDefined();
        expect(defineXml.odm.study).toBeDefined();
        expect(defineXml.odm.study.studyOid).toBeTruthy();
        expect(defineXml.odm.study.globalVariables).toBeDefined();
        expect(defineXml.odm.study.metaDataVersion).toBeDefined();
        expect(defineXml.odm.study.metaDataVersion.analysisResultDisplays).toBeDefined();
    });

    describe("ARM Snapshots", () => {
        let mdv: MetaDataVersion20;
        beforeAll(async () => {
            const defineXml = await parseDefineXml(xmlStringAdam, true);
            mdv = defineXml.odm.study.metaDataVersion;
        });

        it("should match result display snapshot", () => {
            const rd = mdv.analysisResultDisplays.resultDisplays["RD.Table_14-5.02"];
            expect(rd).toMatchSnapshot();
        });
    });
});
