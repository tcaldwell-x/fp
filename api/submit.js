const fetch = require('node-fetch');

module.exports = async (req, res) => {

  console.log('Received request')

  res.setHeader('Access-Control-Allow-Origin', '*'); // Allow from any origin; restrict if needed
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    console.log('Received request options')

    res.status(200).end();
    return;
  }

  if (req.method === 'POST') {
    console.log('Received request post')
    try {
      const params = new URLSearchParams();
      for (const [key, value] of Object.entries(req.body)) {
        if (Array.isArray(value)) {
          value.forEach(v => params.append(key, v));
        } else {
          params.append(key, value);
        }
      }

      const googleResponse = await fetch('https://docs.google.com/forms/d/e/1FAIpQLScKyKFUB6R1vUu8QghPhPXcJUl75JkDWSGNXL2nw4gyftClRg/formResponse', {
        method: 'POST',
        body: params,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });

      if (googleResponse.ok) {
        res.status(200).json({ message: 'Application submitted successfully!' });
      } else {
        res.status(500).json({ error: 'Submission failed on Google side.' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Server error during submission.' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};
