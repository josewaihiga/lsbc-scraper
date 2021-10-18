// Dependencies
const request = require('request')
const cheerio = require('cheerio')
const fs      = require('fs')
const moment  = require('moment')

// File path
const date        = moment().format('YYYY-MM-DD')
const writeStream = fs.createWriteStream(`exports/${date}_lsbc-lawyers.csv`)


// Target URL
const URL = "https://lsbc.vic.gov.au/register-of-lawyers?query=&type=lawyer&lawyer=&lookup=&action=0&area=0&language=&accreditation=0&start_rank="
    let resultRank = 1;

// Optional Limit
let resultLimit = 26000



// Contact object
const contact = {
    rank: 0,
    name: "",
    type: "",
    employer: "",
    address: "",
    areas: "",
    specialisation: ""
}

const contactKeys = Object.keys(contact).join(',')

//  Write headers
writeStream.write(contactKeys+'\n')



function recursion(url){


    request(url, (error, response, html) => {
        if(!error && response.statusCode == 200){
            
            const $ = cheerio.load(html)

            const searchResults = $('.search-content-wrapper')

                if (searchResults && resultRank < resultLimit){

                    // Populate each contact object
                    $('.search-content').each((i, el) => {

                        contact.rank = resultRank + i
                        contact.name = $(el)
                            .find('.card-header h3')
                            .text()

                        contact.type = $(el)
                            .find('.tooltip-holder span')
                            .text()
                            .replace(/\s\s+|\r?\n|\r/g,'')
                            .replace(/,/g,';')
                            .slice(6,-14)

                        contact.address = $(el)
                            .find('address')
                            .text()                            
                            .replace(/,/g,';')
                        
                        contact.areas = $(el)
                            .find('.search-holder .text-holder:last-child li:nth-child(1)')
                            .text()
                            .replace(/,/g,';')
                            .slice(19)
                        
                        contact.specialisation = $(el)
                            .find('.search-holder .text-holder:last-child li:nth-child(2)')
                            .text()
                            .replace(/\s\s+|\r?\n|\r/g,'')
                            .replace(/,/g,';')
                            .slice(34)
                        

                        // the contact.employer is a little trickier
                        const employed = $(el)
                        .find('.search-holder .text-holder:first-child .list-unstyled li:nth-child(2)').text()

                        if (employed){
                            contact.employer = $(el)
                            .find(`.search-holder .text-holder:first-child ul li:nth-child(1)`)
                            .text()
                            .replace(/\s\s+|\r?\n|\r/g,'')
                            .slice(15)
                        } else {
                            contact.employer = ""
                        }


                    // Write contact to file
                    const contactValues = Object.values(contact).join(",")
    
                    writeStream.write(contactValues+'\n')
                    // console.table(contact)

                    })
                

                    console.log(`Page ${(resultRank-1)/10} scraped`)

                    // Next page
                    resultRank = resultRank + 10
                    recursion(URL+resultRank)


                // Ends on completion
                } else { 
                    console.log(`Done: Searched through ${(resultRank-1)/10} pages returning ${contact.rank} contacts`)
                }

        // Ends on error
        } else if (error){
            console.log(error)
        }
    })
}

// Let's kick things off
recursion(URL+resultRank)