import { readFileSync } from "node:fs";
import {
  validateRecord,
  normalizeRecord,
  filterRecords,
  searchRecords,
  sortRecords,
  summarizeRecords,
  buildReport,
} from "./toolkit.js";
 
const books = JSON.parse(readFileSync("data/books.json", "utf8"));
const boundary = JSON.parse(readFileSync("data/boundary-records.json", "utf8"));
const empty = JSON.parse(readFileSync("data/empty.json", "utf8"));
 
let passed = 0;
let failed = 0;
 
function check(name, expected, actual) {
  const result =
    JSON.stringify(actual) === JSON.stringify(expected) ? "PASS" : "FAIL";
  if (result === "PASS") {
    passed = passed + 1;
  } else {
    failed = failed + 1;
  }
  console.log(
    `${result}  ${name}  expected: ${JSON.stringify(expected)}  actual: ${JSON.stringify(actual)}`
  );
}

//Validate
check("validate accepts a good record",
  { valid: true, errors: [] },
  validateRecord(books[0]));
 
check("validate reports a missing title (EDGE: missing property)",
  { valid: false, errors: ["title is required"] },
  validateRecord(boundary[0]));
 
check('validate reports minutes "thirty" (EDGE: wrong type)',
  { valid: false, errors: ["minutes must be a number"] },
  validateRecord(boundary[1]));

//Normalize
check("normalize trims spaces and fixes the category",
  { id: "trim-case", title: "ROBOT GARDEN", creator: "Mina Reed", category: "Science fiction", minutes: 240 },
  normalizeRecord(boundary[2]));
 
const originalRecord = JSON.stringify(boundary[2]);
normalizeRecord(boundary[2]);
check("normalize does not change the original record (NONMUTATION)",
  originalRecord,
  JSON.stringify(boundary[2]));

//Filter
check("filter keeps only the Art books",
  ["River Sketches", "Paper Worlds"],
  titles(filterRecords(books, (book) => book.category === "Art")));
 
check("filter on an empty array gives an empty array (EDGE: empty array)",
  [],
  filterRecords(empty, (book) => book.category === "Art"));
 
//Search
check('search ignores capital letters: "robot", "Robot", "ROBOT" (EDGE: capitalization)',
  [["Robot Garden"], ["Robot Garden"], ["Robot Garden"]],
  [
    titles(searchRecords(books, "robot")),
    titles(searchRecords(books, "Robot")),
    titles(searchRecords(books, "ROBOT")),
  ]);
 
check('search looks at the creator: "mina" finds Robot Garden',
  ["Robot Garden"],
  titles(searchRecords(books, "mina")));
 
//Sort
check("sort by minutes, shortest first",
  ["Cloud Atlas Practice", "Trail Notes", "Small City Stories", "Paper Worlds",
   "River Sketches", "Night Orchard", "Quiet Satellites", "Robot Garden"],
  titles(sortRecords(books, "minutes")));
