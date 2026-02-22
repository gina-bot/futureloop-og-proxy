const { createClient } = require('@supabase/supabase-js');

const SITE_URL = 'https://futureloop.no';

function escAttr(str) {
  return (str || '').replace(/&/g, '&amp;').replace(/"/g, '&quot;');
}

function escHtml(str) {
  return (str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

module.exports = async (req, res) => {
  var id = req.query.id;
  if (!id) return res.status(400).send('Missing id');

  try {
    var supabase = createClient(
      'https://rdvyyztedvwbktnfgbdn.supabase.co',
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    var result = await supabase
      .from('eu_journalist_articles')
      .select('id, title, deck, content, generated_at, topic')
      .eq('id', id)
      .single();

    var article = result.data;
    if (!article) return res.redirect(302, SITE_URL + '/eu-posten');

    var title = (article.title || 'EU-Posten')
      .replace(/^#+\s*/, '')
      .replace(/^\*\*|\*\*$/g, '')
      .replace(/^Tittel:\s*/i, '')
      .trim();

    var desc = (article.deck || article.content || '')
      .replace(/[#*_]/g, '')
      .substring(0, 200)
      .trim();

    var url = SITE_URL + '/eu-posten?article=' + article.id;

    var h = '<!DOCTYPE html>\n';
    h += '<html lang="no">\n';
    h += '<head>\n';
    h += '<meta charset="UTF-8">\n';
    h += '<title>' + escHtml(title) + ' | EU-posten - Futureloop</title>\n';
    h += '<meta name="description" content="' + escAttr(desc) + '">\n';
    h += '<meta property="og:type" content="article">\n';
    h += '<meta property="og:url" content="' + escAttr(url) + '">\n';
    h += '<meta property="og:title" content="' + escAttr(title) + '">\n';
    h += '<meta property="og:description" content="' + escAttr(desc) + '">\n';
    h += '<meta property="og:site_name" content="Futureloop - EU-posten">\n';
    h += '<meta property="og:locale" content="nb_NO">\n';
    h += '<meta name="twitter:card" content="summary">\n';
    h += '<meta name="twitter:title" content="' + escAttr(title) + '">\n';
    h += '<meta name="twitter:description" content="' + escAttr(desc) + '">\n';
    h += '<link rel="canonical" href="' + escAttr(url) + '">\n';
    h += '</head>\n';
    h += '<body>\n';
    h += '<p>' + escHtml(title) + '</p>\n';
    h += '</body>\n';
    h += '</html>';

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    return res.status(200).send(h);
  } catch (e) {
    console.error('Share error:', e);
    return res.redirect(302, SITE_URL + '/eu-posten');
  }
};
