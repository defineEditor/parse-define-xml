import { ArmDefine20, ArmDefine21 } from "interfaces/arm.10";
import { Define20 } from "interfaces/define.xml.20";
import { Define21 } from "interfaces/define.xml.21";
import parseDefineXml20 from "parser/define.20";
import parseDefineXml21 from "parser/define.21";
interface ParseDefineXml {
    (xmlString: string, ver: "2.0", hasArm?: false): Promise<Define20.DefineXml>;
    (xmlString: string, ver: "2.1", hasArm?: false): Promise<Define21.DefineXml>;
    (xmlString: string, ver: "2.0", hasArm?: true): Promise<ArmDefine20.DefineXml>;
    (xmlString: string, ver: "2.1", hasArm?: true): Promise<ArmDefine21.DefineXml>;
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
