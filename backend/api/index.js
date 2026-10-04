// Vercel function entry. The real handler lives in src/vercel.ts and is
// compiled to dist/ by `npm run build`, which Vercel runs before bundling
// this function, so it is type-checked with the rest of the project.
module.exports = require("../dist/vercel").default;
