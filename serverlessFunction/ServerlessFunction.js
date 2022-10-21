const axios = require('axios');

exports.handler = async (event) => {
  let date = new Date().toISOString();
  let parsedDate = date.split('T');
  parsedDate = parsedDate[0];

  const response = await axios.get(
    'https://api.data.gov.sg/v1/environment/24-hour-weather-forecast?date=' +
      parsedDate
  );
  const latest = response.data.items.length;
  const forecast = response.data.items[latest - 1].periods;
  const westRegion = forecast.map((period) => {
    return { time: period.time.start, forecast: period.regions.west };
  });

  return {
    statusCode: 200,
    body: JSON.stringify(westRegion),
  };
};
