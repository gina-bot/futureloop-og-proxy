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
  var type = req.query.type || 'eu';
  if (!id) return res.status(400).send('Missing id');

  try {
    var supabase = createClient(
      'https://rdvyyztedvwbktnfgbdn.supabase.co',
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    var table = type === 'futureloop' ? 'futureloop_articles' : 'eu_journalist_articles';
    var siteName = type === 'futureloop' ? 'Futureloop Posten' : 'EU-posten';
    var articlePath = type === 'futureloop'
      ? '/news?tab=futureloop-posten&article='
      : '/eu-posten?article=';

    var result = await supabase
      .from(table)
      .select('id, title, deck, content, generated_at, topic')
      .eq('id', id)
      .single();

    var article = result.data;
    if (!article) return res.redirect(302, SITE_URL + (type === 'futureloop' ? '/news' : '/eu-posten'));

    var title = (article.title || siteName)
      .replace(/^#+\s*/, '')
      .replace(/^\*\*|\*\*$/g, '')
      .replace(/^Tittel:\s*/i, '')
      .trim();

    var desc = (article.deck || article.content || '')
      .replace(/[#*_]/g, '')
      .substring(0, 200)
      .trim();

    var url = SITE_URL + articlePath + article.id;

    var h = '';
    h += '<!DOCTYPE html>\n';
    h += '<html lang="no">\n';
    h += '<head>\n';
    h += '<meta charset="UTF-8">\n';
    h += '<title>' + escHtml(title) + ' | ' + escHtml(siteName) + ' - Futureloop</title>\n';
    h += '<meta name="description" content="' + escAttr(desc) + '">\n';
    h += '<meta property="og:type" content="article">\n';
    h += '<meta property="og:url" content="' + escAttr(url) + '">\n';
    h += '<meta property="og:title" content="' + escAttr(title) + '">\n';
    h += '<meta property="og:description" content="' + escAttr(desc) + '">\n';
    h += '<meta property="og:site_name" content="Futureloop - ' + escHtml(siteName) + '">\n';
    h += '<meta property="og:locale" content="nb_NO">\n';
    h += '<meta name="twitter:card" content="summary">\n';
    h += '<meta name="twitter:title" content="' + escAttr(title) + '">\n';
    h += '<meta name="twitter:description" content="' + escAttr(desc) + '">\n';
    h += '<link rel="canonical" href="' + escAttr(url) + '">\n';
    h += '</head>\n';
    h += '<body>\n';
    h += '<p>' + escHtml(siteName) + ': <a href="' + escAttr(url) + '">' + escHtml(title) + '</a></p>\n';
    h += '<script>window.location.replace(' + JSON.stringify(url) + ');</script>\n';
    h += '</body>\n';
    h += '</html>';

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    return res.status(200).send(h);
  } catch (err) {
    console.error('Share error:', err);
    return res.redirect(302, SITE_URL);
  }
};
