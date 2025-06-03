// ### **Storing and Managing Search History with BCMS**

// ### 💡 Use Case: Persistent User Search History with Optional Metadata

// - **Create a `SearchHistory` collection in BCMS** with fields like:
//     - `locationName` (string)
//     - `lat` (number)
//     - `lon` (number)
//     - `timestamp` (datetime)
//     - `userID` (if authenticated user system exists)
// - On each search, send data to BCMS via API
// - On page load, fetch past locations from BCMS
// - Allow user to click on previous locations to re-fetch data
// - Allow deletion from history with a delete button per entry


