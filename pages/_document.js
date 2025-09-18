import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          {/* Link to the manifest.json for PWA */}
          <link rel="manifest" href="/manifest.json" />
          
          {/* Optional: Set the theme color of the browser */}
          <meta name="theme-color" content="#000000" />

          {/* Optional: Other meta tags for social media sharing, etc. */}
          <meta name="description" content="A Progressive Web App built with Next.js" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
