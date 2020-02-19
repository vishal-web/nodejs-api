const NodeGeocoder =  require('node-geocoder');

const options = {
  provider: process.env.GEOCODER_PROVIDER,
  httpAdapter: 'http',
  apiKey: process.env.GEOCODER_MAPQUEST_API_KEY,
  formatter: null,
}

if (process.env.GEOCODER_PROVIDER === 'openstreetmap') {
  delete options.apiKey;
  delete options.httpAdapter;
  delete options.formatter;
  
  options.email = process.env.GEOCODER_EMAIL;
}


const geocoder = NodeGeocoder(options);

module.exports = geocoder;