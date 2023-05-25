import fs from "fs";
import path from "path";

function replacePrefixInFile(destFilename: string) {
  const data = fs.readFileSync(destFilename, { encoding: "utf8" });
  let result = data.replace(/FakeAltro/g, "Altr");
  result = result.replace(/fake-altro/g, "altr");

  fs.writeFileSync(destFilename, result, { encoding: "utf8" });
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
  console.log("Prepare folder for production...");
  for (const folder of folderToCheck) {
    walk(path.resolve(folder)).forEach((destFilename: string) => {
      replacePrefixInFile(destFilename);
      if (destFilename.includes("FakeAltro")) {
        fs.renameSync(destFilename, destFilename.replace(/FakeAltro/g, "Altr"));
      } else {
        fs.renameSync(
          destFilename,
          destFilename.replace(/fake-altro/g, "altr")
        );
      }
    });
  }
  replacePrefixInFile(path.resolve("schema.graphql"));
  replacePrefixInFile(path.resolve("networks.json"));
  replacePrefixInFile(path.resolve("subgraph.template.yaml"));
  console.log("Folder ready for production!");
}
main()
  .then(() => process.exit(0))
  .catch((e: Error) => {
    console.error(e);
    process.exitCode = 1;
  });
