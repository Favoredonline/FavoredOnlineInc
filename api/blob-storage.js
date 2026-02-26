const { put, del } = require('@vercel/blob');

const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

module.exports = async function handler(req, res) {
  // Handle UPLOAD
  if (req.method === 'POST') {
    try {
      // Check for BLOB_READ_WRITE_TOKEN
      if (!process.env.BLOB_READ_WRITE_TOKEN) {
        console.error('BLOB_READ_WRITE_TOKEN is not configured');
        return res.status(500).json({ 
          error: 'Storage not configured', 
          message: 'Blob storage token is missing. Please configure BLOB_READ_WRITE_TOKEN in environment variables.' 
        });
      }

      const { filename, contentType, fileData, originalName, size } = req.body;

      if (!filename || !fileData) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Convert base64 back to buffer
      const buffer = Buffer.from(fileData, 'base64');

      // Upload to Vercel Blob
      const blob = await put(filename, buffer, {
        access: 'public',
        token: process.env.BLOB_READ_WRITE_TOKEN,
        contentType: contentType || 'image/jpeg',
      });

      // Return success response
      return res.status(200).json({
        url: blob.url,
        pathname: blob.pathname,
        contentType: blob.contentType,
        size: blob.size,
        uploadedAt: blob.uploadedAt
      });
    } catch (error) {
      console.error('Upload error:', error.message, error.stack);
      return res.status(500).json({ 
        error: 'Upload failed', 
        message: error.message,
        hint: error.message.includes('token') || error.message.includes('unauthorized') 
          ? 'Check that BLOB_READ_WRITE_TOKEN is valid and the Blob Store is connected to this project.'
          : undefined
      });
    }
  }

  // Handle DELETE
  if (req.method === 'DELETE') {
    try {
      const { url } = req.body;

      if (!url) {
        return res.status(400).json({ error: 'Missing URL' });
      }

      // Delete from Vercel Blob
      await del(url, {
        token: process.env.BLOB_READ_WRITE_TOKEN,
      });

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('Delete error:', error);
      return res.status(500).json({ 
        error: 'Delete failed', 
        message: error.message 
      });
    }
  }

  // Method not allowed
  return res.status(405).json({ error: 'Method not allowed' });
}

module.exports.config = config;
