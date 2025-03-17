/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

// export default {
// 	async fetch(request, env, ctx) {
// 		return new Response('Hello World!');
// 	},
// };

export default {
  async fetch(request, env, ctx) {
    // Get the path from the request URL
    const url = new URL(request.url);
    let path = url.pathname;

    // Serve the index.html file by default if the path is "/"
    if (path === "/") {
      path = "/index.html";  // Serve the index.html file
    }

    try {
      // Fetch the file from the static assets (the "site" folder)
      const file = await env.SITE_BUCKET.get(`site${path}`);  // Prepend "site" to the path

      if (!file) {
        return new Response('File not found', { status: 404 });
      }

      // Return the file with the correct content type
      return new Response(file, {
        headers: {
          'Content-Type': getContentType(path),
        },
      });
    } catch (error) {
      return new Response('Error fetching file', { status: 500 });
    }
  },
};

// Helper function to determine the content type based on file extension
function getContentType(path) {
  const ext = path.split('.').pop();
  switch (ext) {
    case 'html':
      return 'text/html; charset=UTF-8';
    case 'css':
      return 'text/css; charset=UTF-8';
    case 'js':
      return 'application/javascript; charset=UTF-8';
    case 'png':
      return 'image/png';
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'gif':
      return 'image/gif';
    case 'svg':
      return 'image/svg+xml';
    case 'woff':
    case 'woff2':
      return 'application/font-woff';
    default:
      return 'application/octet-stream';
  }
}

