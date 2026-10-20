import Document, { Html, Head, Main, NextScript } from 'next/document';

export default class WebAppDocument extends Document {
  appVersion = process.env.APP_VERSION;

  render() {
    return (
      <Html lang="vi">
        <Head>
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link
            href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500;1,700&display=swap"
            rel="stylesheet"
          />
          <meta app-version={this.appVersion} />
          <meta name="description" content="QOrder - Gọi món bằng QR cho nhà hàng" />
          <meta name="theme-color" content="#2563eb" />
          <link rel="manifest" href="/manifest.json" />
          <link rel="icon" href="/icons/icon-192.png" />
          <link rel="apple-touch-icon" href="/icons/icon-192.png" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="default" />
          <meta name="apple-mobile-web-app-title" content="QOrder" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
