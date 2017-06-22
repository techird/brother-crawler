const http = require('http');
const cheerio = require('cheerio');

const load = url => new Promise((resolve, reject) => http.get(url, response => {
    let html = '';
    response.on('data', data => html += data);
    response.on('end', () => resolve(html));
    response.on('error', reject);
}));

const findLinks = html => {
    const $ = cheerio.load(html);
    return $('[href^="ed2k://"]').map((index, element) => ({
        name: $(element).text(),
        href: $(element).attr('href'),
    })).toArray();
};

const withQuality = quality => link => link.name.indexOf(quality) > -1;

const run = async () => {
    try {
        const url = 'http://cn163.net/archives/23645/';
        const quality = '1024';

        console.log(`Fetching from ${url}...`);
        const html = await load(url);

        console.log('Finding links...');
        const links = findLinks(html);
        const linksWithQuality = links.filter(withQuality(quality));
        console.log(`${links.length} links found, ${linksWithQuality.length} links with quality ${quality}:`);

        const resultHrefs = linksWithQuality.map(link => link.href);
        console.log(resultHrefs);
        console.log('Done.');

    } catch (error) {
        console.error('Error occured: ', error);
    }
};

run();