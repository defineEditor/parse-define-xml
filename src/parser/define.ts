import { ArmDefineXml20, ArmDefineXml21 } from "interfaces/arm.10";
import { DefineXml as DefineXml20 } from "interfaces/define.xml.20";
import { DefineXml as DefineXml21 } from "interfaces/define.xml.21";
import parseDefineXml20 from "parser/define.20";
import parseDefineXml21 from "parser/define.21";
interface ParseDefineXml {
    (xmlString: string, ver: "2.0", hasArm?: false): Promise<DefineXml20>;
    (xmlString: string, ver: "2.1", hasArm?: false): Promise<DefineXml21>;
    (xmlString: string, ver: "2.0", hasArm?: true): Promise<ArmDefineXml20>;
    (xmlString: string, ver: "2.1", hasArm?: true): Promise<ArmDefineXml21>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const parseDefineXml: ParseDefineXml = async (xmlString, ver, hasArm = false): Promise<any> => {
    if (ver === "2.0" && hasArm === false) {
        return parseDefineXml20(xmlString);
    }
    if (ver === "2.1" && hasArm === false) {
        return parseDefineXml21(xmlString);
    }
    if (ver === "2.0" && hasArm === true) {
        return parseDefineXml20(xmlString, true);
    }
    if (ver === "2.1" && hasArm === true) {
        return parseDefineXml21(xmlString, true);
    }
    throw new Error("Unsupported Define-XML version or ARM flag");
};

export default parseDefineXml;
