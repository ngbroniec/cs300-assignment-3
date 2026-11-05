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

const titles = (list) => list.map((record) => record.title);
const ids = (list) => list.map((record) => record.id);

//Validate
// Takes: one record
// Returns: { valid: true or false, errors: [list of strings] }
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
// Takes: one record
// Returns: a NEW record with trimmed text and the category
check("normalize trims spaces and fixes the category",
  { id: "trim-case", title: "ROBOT GARDEN", creator: "Mina Reed", category: "Science fiction", minutes: 240 },
  normalizeRecord(boundary[2]));
 
const originalRecord = JSON.stringify(boundary[2]);
normalizeRecord(boundary[2]);
check("normalize does not change the original record (NONMUTATION)",
  originalRecord,
  JSON.stringify(boundary[2]));

//Filter
// Takes: an array of records
// Returns: a NEW array of the matches
check("filter keeps only the Art books",
  ["River Sketches", "Paper Worlds"],
  titles(filterRecords(books, (book) => book.category === "Art")));
 
check("filter on an empty array gives an empty array (EDGE: empty array)",
  [],
  filterRecords(empty, (book) => book.category === "Art"));
 
//Search
// Takes: an array of records and a search word
// Returns: a NEW array of records with the specific word
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
// Takes: an array of records and a property name
// Returns: a NEW array, smallest first
check("sort by minutes, shortest first",
  ["Cloud Atlas Practice", "Trail Notes", "Small City Stories", "Paper Worlds",
   "River Sketches", "Night Orchard", "Quiet Satellites", "Robot Garden"],
  titles(sortRecords(books, "minutes")));

// Robot Garden and Quiet Satellites are both 240
check("sort tie: two 240 minute books go A to Z (EDGE: equal values)",
  ["Quiet Satellites", "Robot Garden"],
  titles(sortRecords(books, "minutes")).slice(6));

//New book copies so that tests from before can't change anything
const freshBooks = JSON.parse(readFileSync("data/books.json", "utf8"));
sortRecords(freshBooks, "minutes");
check("sort does not change the original array (NONMUTATION)",
  ["books-01", "books-02", "books-03", "books-04", "books-05", "books-06", "books-07", "books-08"],
  ids(freshBooks));

//Summarize
// Takes: array of records
// Returns: { count, totalMinutes, averageMinutes, minMinutes, maxMinutes }
check("summarize all eight books",
  { count: 8, totalMinutes: 1410, averageMinutes: 176.25, minMinutes: 90, maxMinutes: 240 },
  summarizeRecords(books));
 
check("summarize an empty array (EDGE: empty array)",
  { count: 0, totalMinutes: 0, averageMinutes: null, minMinutes: null, maxMinutes: null },
  summarizeRecords(empty));

check("summarize empty: average is null, not NaN (EDGE: empty array)",
  true,
  summarizeRecords(empty).averageMinutes === null);

check('summarize skips minutes "thirty" (EDGE: wrong type)',
  { count: 3, totalMinutes: 270, averageMinutes: 135, minMinutes: 30, maxMinutes: 240 },
  summarizeRecords(boundary));
 
//Report
// Takes: array of records and a search word
// Returns: { query, matchCount, titles, summary } (search, then sort, then summarize)
check('report for "ar": search, sort, then summarize',
  {
    query: "ar",
    matchCount: 4,
    titles: ["Trail Notes", "River Sketches", "Night Orchard", "Robot Garden"],
    summary: { count: 4, totalMinutes: 750, averageMinutes: 187.5, minMinutes: 120, maxMinutes: 240 },
  },
  buildReport(books, "ar"));
 
console.log(`\n${passed} passed, ${failed} failed`);
