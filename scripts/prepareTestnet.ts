import fs from "fs";
import path from "path";

function replacePrefixInFile(destFilename: string) {
  const data = fs.readFileSync(destFilename, { encoding: "utf8" });
  if (!data.toLowerCase().includes("fakealtro")) {
    let result = data.replace(/Altr/g, "FakeAltro");
    result = result.replace(/altr-/g, "fake-altro-");
    fs.writeFileSync(destFilename, result, { encoding: "utf8" });
  }
}

function walk(dir: string) {
  let results: string[] = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file: string) {
    file = dir + "/" + file;
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      /* Recurse into a subdirectory */
      results = results.concat(walk(file));
    } else {
      /* Is a file */
      results.push(file);
    }
  });
  return results;
}

async function main(): Promise<any> {
  const folderToCheck = ["abis", "src", "tests"];
  console.log("Prepare folder for testnet...");
  for (const folder of folderToCheck) {
    walk(path.resolve(folder)).forEach((destFilename: string) => {
      let skip = false;
      if (destFilename.toLowerCase().includes("altro")) {
        skip = true;
      }
      if (!skip) {
        replacePrefixInFile(destFilename);
        if (destFilename.includes("Altr")) {
          fs.renameSync(
            destFilename,
            destFilename.replace(/Altr/g, "FakeAltro")
          );
        } else {
          fs.renameSync(
            destFilename,
            destFilename.replace(/altr-/g, "fake-altro-")
          );
        }
      }
    });
  }
  replacePrefixInFile(path.resolve("schema.graphql"));
  replacePrefixInFile(path.resolve("networks.json"));
  replacePrefixInFile(path.resolve("subgraph.template.yaml"));
  console.log("Folder ready for testnet!");
}
main()
  .then(() => process.exit(0))
  .catch((e: Error) => {
    console.error(e);
    process.exitCode = 1;
  });
