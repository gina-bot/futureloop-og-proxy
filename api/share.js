const { createClient } = require('@supabase/supabase-js');

const OG_IMAGE = 'https://futureloop.no/og-eu-posten.png';
const SITE_URL = 'https://futureloop.no';

function esc(str) {
  return (str || '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

module.exports = async (req, res) => {
  const id = req.query.id;
  if (!id) return res.status(400).send('Missing id');

  try {
    const supabase = createClient(
      'https://rdvyyztedvwbktnfgbdn.supabase.co',
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { data: article } = await supabase
      .from('eu_journalist_articles')
      .select('id, title, deck, content, generated_at, topic')
      .eq('id', id)
      .single();

    if (!article) return res.redirect(302, SITE_URL + '/eu-posten');

    var title = esc(article.title || 'EU-Posten');
    var desc = esc((article.deck || article.content || '').slice(0, 200));
    var articleUrl = SITE_URL + '/eu-posten?article=' + article.id;
    var proxyUrl = 'https://futureloop-og-proxy.vercel.app/api/share?id=' + article.id;

    var html = '<!DOCTYPE html><html lang="no"><head>'
      + '<meta charset="UTF-8">'
      + '<title>' + title + ' | EU-posten - Futureloop</title>'
      + '<meta name="description" content="' + desc + '">'
      + '<meta property="og:type" content="article">'
      + '<meta property="og:url" content="' + proxyUrl + '">'
      + '<meta property="og:title" content="' + title + '">'
      + '<meta property="og:description" content="' + desc + '">'
      + '<meta property="og:image" content="' + OG_IMAGE + '">'
      + '<meta property="og:image:width" content="1200">'
      + '<meta property="og:image:height" content="630">'
      + '<meta property="og:image:type" content="image/png">'
      + '<meta property="og:site_name" content="Futureloop - EU-posten">'
      + '<meta property="og:locale" content="nb_NO">'
      + '<meta name="twitter:card" content="summary_large_image">'
      + '<meta name="twitter:title" content="' + title + '">'
      + '<meta name="twitter:description" content="' + desc + '">'
      + '<meta name="twitter:image" content="' + OG_IMAGE + '">'
      + '<link rel="canonical" href="' + proxyUrl + '">'
      + '</head><body>'
      + '<p>EU-posten: <a href="' + articleUrl + '">' + title + '</a></p>'
      + '<script>try{window.location.replace("' + articleUrl + '")}catch(e){window.location.href="' + articleUrl + '"}</script>'
      + '</body></html>';

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    return res.status(200).send(html);
  } catch (e) {
    return res.redirect(302, SITE_URL + '/eu-posten');
  }
};
