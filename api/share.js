const { createClient } = require('@supabase/supabase-js');

const SITE_URL = 'https://futureloop.no';

function esc(str) {
  return (str || '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
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

    const title = esc(article.title || 'EU-Posten');
    const desc = esc((article.deck || article.content || '').slice(0, 200));
    const articleUrl = SITE_URL + '/eu-posten?article=' + article.id;

    const html = '<!DOCTYPE html>'
      + '<html lang="no">'
      + '<head>'
      + '<meta charset="UTF-8">'
      + '<title>' + title + ' | EU-posten - Futureloop</title>'
      + '<meta name="description" content="' + desc + '">'
      + '<meta property="og:type" content="article">'
      + '<meta property="og:url" content="' + articleUrl + '">'
      + '<meta property="og:title" content="' + title + '">'
      + '<meta property="og:description" content="' + desc + '">'
      + '<meta property="og:site_name" content="Futureloop - EU-posten">'
      + '<meta property="og:locale" content="nb_NO">'
      + '<meta name="twitter:card" content="summary">'
      + '<meta name="twitter:title" content="' + title + '">'
      + '<meta name="twitter:description" content="' + desc + '">'
      + '<link rel="canonical" href="' + articleUrl + '">'
      + '</head>'
      + '<body>'
      + '<p>EU-posten: <a href="' + articleUrl + '">' + title + '</a></p>'
      + '</body>'
      + '</html>';

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    return res.status(200).send(html);
  } catch (e) {
    console.error('Share error:', e);
    return res.redirect(302, SITE_URL + '/eu-posten');
  }
};
