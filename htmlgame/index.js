const cheerio = require('cheerio');
const request = require('request-promise');
const fs = require('fs')

const games = require('./games')

// 864

const BASEURL = 'https://www.htmlgames.com'

const categories = [
  // { name: 'Mahjong', link: 'https://www.htmlgames.com/Mahjong' },
  // { name: 'Solitaire', link: 'https://www.htmlgames.com/Solitaire' },
  // { name: 'Mind', link: 'https://www.htmlgames.com/Mind+games' },
  // { name: 'Hidden', link: 'https://www.htmlgames.com/Hidden+objects' },
  // { name: 'Match3', link: 'https://www.htmlgames.com/Match+3' },
  // { name: 'Action', link: 'https://www.htmlgames.com/Action' },
  { name: 'Classic', link: 'https://www.htmlgames.com/Classic+Games' },
]

const start = async () => {
  for (let index = 0; index < categories.length; index++) {
    const category = categories[index];

    const response = await request(category.link)
    console.log('category.link:', category.link)
    const $ = cheerio.load(response);

    const rawData = []

    // Get 'Page 1' from html
    const cards = $('.game.card-container')
    for (let index = 0; index < cards.length; index++) {
      const card = cards[index];
      const name = $(card).attr('title');
      const link = $(card).find('.card.back a').attr('href')
      const img = $(card).find('img.card-img-top').attr('src')

      const item = {
        image: BASEURL + img,
        link: BASEURL + link,
        name
      }
      rawData.push(item)
    }

    // Get 'Page n' from data response ajax 
    for (let index = 0; index < games[category.name.toLowerCase()].length; index++) {
      const card = games[category.name.toLowerCase()][index];
      const name = $(card).attr('title');
      const link = $(card).find('.card.back a').attr('href')
      const img = $(card).find('img.card-img-top').attr('src')

      const item = {
        image: BASEURL + img,
        link: BASEURL + link,
        name
      }

      rawData.push(item)
    }

    const dataWrite = []
    for (let index = 0; index < rawData.length; index++) {
      const draw = rawData[index];
      console.log('draw:', draw.link)
      const responseDetail = await request(draw.link)
      const $detail = cheerio.load(responseDetail);

      const embedLink = $detail('body').attr('data-gameurl')
      console.log('embedLink:', embedLink)
      const item = {
        ...draw,
        embedLink,
        category: category.name
      }
      dataWrite.push(item)
    }

    fs.writeFileSync(`./result/${category.name.toLowerCase()}.json`, JSON.stringify(dataWrite), { flag: 'w' }); // lưu dữ liệu vào file data.json
  }

}

start()
// request('https://www.htmlgames.com/Mahjong', (error, response, html) => {

//   console.log('response.statusCode: Out', response.statusCode)
//   if (!error && response.statusCode == 200) {
//     const $ = cheerio.load(html);
//     let data = []

//     // const cards = $('.card.back')

//     // for (let index = 0; index < cards.length; index++) {
//     //   const card = cards[index];
//     //   const detailLink = $(card).find('a').attr('href');
//     //   console.log('detailLink:', detailLink)
//     // }

//     const cards = $('.game.card-container')
//     for (let index = 0; index < cards.length; index++) {
//       const card = cards[index];
//       const name = $(card).attr('title');
//       const link = $(card).find('.card.back a').attr('href')
//       const img = $(card).find('img.card-img-top').attr('src')
//       console.log('img:', img)
//       console.log('link:', link)
//       console.log('name:', name)
//     }

//     // $('.card.back').each((index, el) => {
//     //   // console.log('el:', el)

//     //   console.log('detailLink:', detailLink)
//     //   // const company = $(el).find('.job__list-item-company span').text();
//     //   // const address = $(el).find('.job__list-item-info').find('.address').text();
//     //   // const salary = $(el).find('.job__list-item-info').find('.salary').text();

//     //   request(`https://www.htmlgames.com${detailLink}`, (error, response, html) => {

//     //     console.log(`https://www.htmlgames.com${detailLink}`)

//     //     console.log('response.statusCode: In', response.statusCode)
//     //     if (!error && response.statusCode == 200) {
//     //       const $ = cheerio.load(html);
//     //       let data = []


//     //       // $('.card.back').each((index, el) => {
//     //       // console.log('el:', el)
//     //       // const detailLink = $(el).find('a').attr('href');
//     //       // console.log('detailLink:', detailLink)
//     //       // const company = $(el).find('.job__list-item-company span').text();
//     //       // const address = $(el).find('.job__list-item-info').find('.address').text();
//     //       // const salary = $(el).find('.job__list-item-info').find('.salary').text();

//     //       // data.push({
//     //       //   job, company, address, salary
//     //       // }); // đẩy dữ liệu vào biến data
//     //       // });

//     //       // fs.writeFileSync('data.json', JSON.stringify(data)); // lưu dữ liệu vào file data.json
//     //     }
//     //     else {
//     //       // console.log(error);
//     //     }
//     //   });

//     //   // data.push({
//     //   //   job, company, address, salary
//     //   // }); // đẩy dữ liệu vào biến data
//     // });

//     // fs.writeFileSync('data.json', JSON.stringify(data)); // lưu dữ liệu vào file data.json
//   }
//   else {
//     console.log(error);
//   }
// });
