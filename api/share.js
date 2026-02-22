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

    var 
