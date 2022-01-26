# Quick Start

1. Download/Clone this.
2. Install [Node.js](https://nodejs.org/en/)
3. Using the terminal navigate to this file directory
4. Install the dependencies `npm install`
5. Run the app `node .\app.js`
   1. The app will take **an hour** to finish, it will log each time it completes a page
   2. The app will output a console log when done: "Done"
6. The results will be outputted to `exports/`

# Warnings

Frequent use may lead to the temporary or permanent blocking of your IP address from accessing LSBC.
Accessing the export file mid-process will cause it to error and fail.
This app uses recursion so it is important that a 'recursion condition' exists, otherwise the app will need to be forceably stopped `ctrl + c`.

# Understanding the code

This app is a web scraper; It will automatically:

- visit a website;
- target specifed elements on the page;
- write the results to a file; and
- repeat until all items are found (or set limit is reached)

This app uses `request` and recursion to iterate through the result pages parsing the dom with `cheerio`.
It's not very efficient though it does the job.

## Search fails

The app writes on each result to retain results on error.
You can adjust the initial `resultRank` to pick back up from where it ended, though make sure to move or rename the written file to prevent it being overwritten
