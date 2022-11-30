const cheerio = require('cheerio');
const request = require('request-promise');
const fs = require('fs')

const games = require('./games')

const BASEURL = 'https://zodigames.com/'

const categories = [
  // { name: 'Action', link: 'https://zodigames.com/action/page/' },
  { name: 'Arcade', link: 'https://zodigames.com/arcade/page/' },
  { name: 'Shooting', link: 'https://zodigames.com/shooting/page/' },
  { name: 'IO', link: 'https://zodigames.com/io/page/' },
  { name: 'DressUp', link: 'https://zodigames.com/dress-up/page' },
  { name: 'Adventure', link: 'https://zodigames.com/adventure/page' },
  { name: 'Driving', link: 'https://zodigames.com/driving/page' },
  { name: 'Education', link: 'https://zodigames.com/education/page' },
]

const pageLength = 100

const start = async () => {
  for (let index = 0; index < categories.length; index++) {
    const category = categories[index];

    const rawData = []
    const dataWrite = []
    try {

      for (let index = 0; index < pageLength; index++) {
        console.log(`${category.name}: page ${index}`)
        const response = await request(category.link + index)
        const $ = cheerio.load(response);
        const cards = $('.dynamic-content-template')

        const notExistPage = $('h1.entry-title')
        if (notExistPage && notExistPage.text().includes('Oops')) {
          console.log(`${category.name}: page ${index} not exits`)
          break
        }

        for (let index = 0; index < cards.length; index++) {
          const card = cards[index];
          const link = $(card).find('a.gb-container-link').attr('href');
          const rawImage = $(card).find('div.gb-has-dynamic-bg').attr('style')
          const image = rawImage.replace('--background-url:url(', '').replace(')', '')
          const name = $(card).find('h2.gb-headline').text()

          const item = {
            image,
            link,
            name
          }

          rawData.push(item)
        }

        const dataWrite = []
        for (let index = 0; index < rawData.length; index++) {
          const draw = rawData[index];
          console.log('Fetching: ', draw.name)
          const responseDetail = await request(draw.link)
          const $detail = cheerio.load(responseDetail);
          const gameDiv = $detail('.thegame')
          const rawEmbedLink = gameDiv.find('iframe#playframe').attr('data-lazy-src')
          const embedLink = rawEmbedLink.split('?')[0]

          const item = {
            ...draw,
            embedLink,
            category: category.name
          }
          dataWrite.push(item)
          // console.log('item:', item)
        }

      }

      fs.writeFileSync(`./result/${category.name.toLowerCase()}.json`, JSON.stringify(dataWrite), { flag: 'w' }); // lưu dữ liệu vào file data.json
    } catch (error) {
      console.log('error:', error)
      fs.writeFileSync(`./result/${category.name.toLowerCase()}.json`, JSON.stringify(dataWrite), { flag: 'w' }); // lưu dữ liệu vào file data.json
    }


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
