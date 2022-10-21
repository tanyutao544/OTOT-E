const axios = require('axios');

exports.handler = async (event) => {
    let date = new Date().toISOString();
    let parsedDate = date.split('T');
    parsedDate = parsedDate[0];
    
    const response = await axios.get("https://api.data.gov.sg/v1/environment/24-hour-weather-forecast?date="+parsedDate);
    const forecast = response.data.items;

    return {
        statusCode: 200,
        body: JSON.stringify(forecast)
    }
};
