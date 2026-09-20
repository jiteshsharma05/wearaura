const fs = require('fs');
const content = fs.readFileSync('lib/supabase_wearaura_email_templates.html', 'utf8');

function htmlDecode(s) {
    return s
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&amp;/g, '&')
        .replace(/&#x27;/g, "'");
}

const blocks = [...content.matchAll(/<div class="code-block">([\s\S]*?)<\/div>/g)];
blocks.forEach((m, i) => {
    const decoded = htmlDecode(m[1].trim());
    const filename = 'lib/template_' + (i + 1) + '_extracted.html';
    fs.writeFileSync(filename, decoded);
    console.log('Template ' + (i + 1) + ' -> ' + filename + ' (' + decoded.length + ' chars)');
    console.log('Preview:', decoded.substring(0, 100));
    console.log('---');
});
console.log('Done. ' + blocks.length + ' templates extracted.');
