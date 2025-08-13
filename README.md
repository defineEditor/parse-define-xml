# parse-define-xml

A TypeScript library for parsing CDISC Define-XML 2.0 and 2.1 files, with support for ARM (Analysis Results Metadata) extensions.

## Usage

### Importing the parser
```ts
import parseDefineXml from "parse-define-xml";
```

### Parsing a Define-XML file
The main function is `parseDefineXml`. It supports both Define-XML 2.0 and 2.1, and can optionally parse ARM extensions.

#### Function signature
```ts
parseDefineXml(xmlString: string, defineVer: "2.0", hasArm?: false): Promise<Define20.DefineXml>
parseDefineXml(xmlString: string, defineVer: "2.1", hasArm?: false): Promise<Define21.DefineXml>
parseDefineXml(xmlString: string, defineVer: "2.0", hasArm?: true): Promise<ArmDefine20.DefineXml>
parseDefineXml(xmlString: string, defineVer: "2.1", hasArm?: true): Promise<ArmDefine21.DefineXml>
```

- `xmlString`: The XML content as a string.
- `defineVer`: The Define-XML version ("2.0" or "2.1").
- `hasArm`: Set to `true` to parse ARM extensions (optional, default is `false`).

#### Example
```ts
import parseDefineXml from "parse-define-xml";
import { Define21 } from "parse-define-xml";

const xmlString = "..."; // Load your Define-XML file as a string
const define = await parseDefineXml(xmlString, "2.1");
// define is typed as Define21.DefineXml
```

## Exported Interfaces

The package exports four main interface namespaces for type safety:

- **Define20**: Types for standard Define-XML 2.0 files (no ARM).
- **Define21**: Types for standard Define-XML 2.1 files (no ARM).
- **ArmDefine20**: Types for Define-XML 2.0 files with ARM extensions.
- **ArmDefine21**: Types for Define-XML 2.1 files with ARM extensions.

Each namespace contains a `DefineXml` interface representing the root structure of the parsed file, as well as all related types for items, groups, code lists, etc.

## TypeScript Example
```ts
import parseDefineXml, { Define21, ArmDefine21 } from "parse-define-xml";

// Parse standard Define-XML 2.1
const define: Define21.DefineXml = await parseDefineXml(xmlString, "2.1");

// Parse Define-XML 2.1 with ARM
const defineArm: ArmDefine21.DefineXml = await parseDefineXml(xmlString, "2.1", true);
```

## License
MIT
