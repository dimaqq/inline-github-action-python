// Node16 can do most ES2020 and ES2021
// Watch out for tagged template literals though, as GH/yaml uses same syntax
const fsp = require("fs").promises;

const slug = (name) =>
  name
    .replaceAll(/[^a-zA-Z0-9._-]/g, "-")
    .replace(/^[.-]*/, "")
    .substring(0, 128);

(async () => {
  event = JSON.parse(await fsp.readFile(process.env.GITHUB_EVENT_PATH));
  let tag;
  if (event.pull_request?.head.repo.fork) {
    tag = "random-fork";
  } else if ((ref = event.pull_request?.head.ref)) {
    tag = slug(ref);
  } else if (event.ref?.startsWith("refs/heads/")) {
    tag = slug(event.ref.substring(11));
  } else if (
    event.ref?.startsWith("refs/tags/") &&
    event.base_ref?.startsWith("refs/heads/release/")
  ) {
    tag = slug(event.ref.substring(10));
  } else if (event.ref?.startsWith("refs/tags/test-")) {
    tag = slug(event.ref.substring(10));
  }

  if (!tag) throw new Error(`Don't know how to tag: ${event}`);

  console.log("::set-output name=tag::" + tag);
})();
