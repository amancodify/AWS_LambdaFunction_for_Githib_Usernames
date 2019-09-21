const axios = require('axios');
const pageSize = 100;
exports.handler = async (event, context) => {
    var t2 = JSON.parse(event['body']);
    var count = await getTotalusercount(t2.country,t2.dateFrom,t2.dateTo);
    const totalIteration = await Math.ceil(count / pageSize);
    const usernameArray = await getUserlogins(t2.country,t2.dateFrom,t2.dateTo, totalIteration);
    
    const response = {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*", // Required for CORS support to work
            "Access-Control-Allow-Credentials": true // Required for cookies, authorization headers with HTTPS
        },
        body: JSON.stringify(usernameArray)
    };
    return response;
};


async function getTotalusercount(country, dateFrom, dateTo, timeFrom = "00:00:00", timeTo = "00:00:00") {
    const url = `https://api.github.com/search/users?q=location:'${country}'+created:${dateFrom}T${timeFrom}Z..${dateTo}T${timeTo}Z`;
    var maincount = [];
    await axios.get(url)
        .then(res => {
            maincount.push(res.data.total_count);
        })
        .catch(err => {
            return maincount = [];
        });
    return maincount[0];
}



async function getUserlogins(country, dateFrom, dateTo, iterations, timeFrom = "00:00:00", timeTo = "00:00:00") {
    var gitusernames = [];
    for (let i = 1; i <= iterations; i++) {
        const url = `https://api.github.com/search/users?q=location:'${country}'+created:${dateFrom}T${timeFrom}Z..${dateTo}T${timeTo}Z&per_page=100&page=${i}&order=asc`;
        await axios.get(url)
            .then(res => {
                res.data.items.map(item => {
                    gitusernames.push(item['login']);
                });
            })
            .catch(err => {
                return gitusernames = [];
            });
    }
    return gitusernames;
}