import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://rdvyyztedvwbktnfgbdn.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const OG_IMAGE = 'https://futureloop.no/og-eu-posten.png';
const SITE_URL = 'https://futureloop.no';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const articleId = req.query.id as string;
  if (!articleId) return res.status(400).send('Missing id');

  const { data: article } = await supabase
    .from('eu_journalist_articles')
    .select('id, title, deck, content, generated_at, topic')
    .eq('id', articleId)
    .single();

  if (!article) return res.status(404).send('Article not found');

  const title = (article.title || 'EU-Posten').replace(/"/g, '&quot;').replace(/</g, '&lt;');
  const description = (article.deck || article.content || '').slice(0, 200).replace(/"/g, '&quot;').replace(/</g, '&lt;');
  const articleUrl = `${SITE_URL}/eu-posten?article=${article.id}`;

  const html = `<!DOCTYPE html>
<html lang="no">
<head>
  <meta charset="utf-8" />
  <title>${title}</title>
  <meta name="description" content="${description}" />
  <meta property="og:type" content="article" />
  <meta property="og:url" content="${articleUrl}" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:image" content="${OG_IMAGE}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:site_name" content="Futureloop" />
  <meta property="og:locale" content="nb_NO" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${description}" />
  <meta name="twitter:image" content="${OG_IMAGE}" />
  <meta http-equiv="refresh" content="0;url=${articleUrl}" />
</head>
<body>
  <p>Omdirigerer til <a href="${articleUrl}">${title}</a>...</p>
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600');
  return res.status(200).send(html);
}
