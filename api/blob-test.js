const { put } = require('@vercel/blob');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  // GET request - just test the token and connection
  if (req.method === 'GET') {
    const tokenExists = !!process.env.BLOB_READ_WRITE_TOKEN;
    const tokenLength = process.env.BLOB_READ_WRITE_TOKEN ? process.env.BLOB_READ_WRITE_TOKEN.length : 0;
    const tokenPrefix = process.env.BLOB_READ_WRITE_TOKEN ? process.env.BLOB_READ_WRITE_TOKEN.substring(0, 10) + '...' : 'N/A';
    
    // Try a tiny test upload
    let uploadTest = 'not attempted';
    try {
      const testBuffer = Buffer.from('test', 'utf-8');
      const blob = await put('_test/ping.txt', testBuffer, {
        access: 'public',
        token: process.env.BLOB_READ_WRITE_TOKEN,
        contentType: 'text/plain',
      });
      uploadTest = `success - ${blob.url}`;
    } catch (error) {
      uploadTest = `failed - ${error.message}`;
    }

    return res.status(200).json({
      tokenExists,
      tokenLength,
      tokenPrefix,
      uploadTest,
      nodeVersion: process.version,
      timestamp: new Date().toISOString()
    });
  }

  return res.status(405).json({ error: 'Use GET to test' });
};
