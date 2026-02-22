  const html = `<!DOCTYPE html>
<html lang="no">
<head>
  <meta charset="UTF-8">
  <title>${title} | EU-posten - Futureloop</title>
  <meta name="description" content="${description}">
  <meta property="og:type" content="article">
  <meta property="og:url" content="${proxyUrl}">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:image" content="${OG_IMAGE}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:site_name" content="Futureloop - EU-posten">
  <meta property="og:locale" content="nb_NO">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="${OG_IMAGE}">
  <link rel="canonical" href="${proxyUrl}">
</head>
<body>
  <p>EU-posten: <a href="${articleUrl}">${title}</a></p>
  <script>
    try { window.location.replace(${JSON.stringify(articleUrl)}); } catch(e) { window.location.href = ${JSON.stringify(articleUrl)}; }
  </script>
</body>
</html>`;
