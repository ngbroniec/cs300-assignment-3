CS300 Assignment 3: Javascript Data Toolkit

Name: Nicholas Broniec

Scenario: Book Collection

- Who uses it: Mina, a fictional library helper organizing practice books.
- Goal: Find matching books, arrange them by estimated reading time, and summarize the collection.
- Data: [Eight fictional books](data/books.json).
- Suggested operations: filter by category; search title and creator; sort by minutes; summarize total or average minutes; combine search or filter with the summary.
- Checks to start with: "robot", "Robot", and "ROBOT" all find Robot Garden; "mina" finds it through its creator; the total of all minutes is 1410; Robot Garden and Quiet Satellites tie at 240 minutes.

How to Run: node harness.js