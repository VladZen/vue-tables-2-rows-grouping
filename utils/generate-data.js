'use strict';

/***
  * dreamjs - fake data generator - https://github.com/adleroliveira/dreamjs
  * jsonfile - module for writing json data to file - https://www.npmjs.com/package/jsonfile
***/
const dream = require('dreamjs');
const jsonfile = require('jsonfile');

/***
  * path - output for generated file
  * amount - number of generated objects
  * phraseLength - number of words for phrase property
  * images - array of all available images
***/

const config = {
  path: './src/table_module/fake_data.json',
  amount: 30,
  images: ['cat', 'dog', 'fox', 'koala', 'lion', 'owl', 'penguin', 'pig', 'raccoon', 'sheep'],
  categories: ['Quizes', 'Tests', 'Cloaked'],
  statuses: ['aсtive', 'archived'],
  favorite: [true, false]
};

dream.customType('category', function (helper) {
  return helper.oneOf(config.categories);
});

dream.customType('status', function (helper) {
  return helper.oneOf(config.statuses);
});

dream.customType('favor', function (helper) {
  return helper.oneOf(config.favorite);
});

dream.customType('incrementalId', function(helper){
    return helper.previousItem ? helper.previousItem.id+1 : 0;
});

dream.customType('obj-value-money', function(helper){
    let value = Math.floor((Math.random() * 200) + 1);
    return Number(value.toFixed(2));
});

dream.customType('obj-value-percent', function(helper){
    let value = (Math.random() * 100) + 1;
    return Number(value.toFixed(2));
});

dream.customType('obj-value-raw', function(helper){
    let value = Math.floor((Math.random() * 500) + 1);
    return value;
});

dream.customType('users-arr', function(helper){
    let number = Math.floor((Math.random() * 4) + 1);
    let arr = [];
    for(let i = 0; i < number; i++)
      arr.push({
        avatar_tag: helper.oneOf(config.images),
        email: helper.chance.email()
      });
    return arr;
});

dream.customType('symbol', function(helper){
    function generateRandomString() {
      let length = 5;
      let text = "";
      let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      for(let i = 0; i < length; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
      return text;
    }
    return generateRandomString()
});

dream.schema('campaign', {
  id: 'incrementalId',
  category_name: 'category',
  cost: 'obj-value-money',
  CPV: 'obj-value-money',
  EPV: 'obj-value-money',
  profit: 'obj-value-money',
  revenue: 'obj-value-money',
  CR: 'obj-value-percent',
  CTR: 'obj-value-percent',
  CV: 'obj-value-percent',
  clicks: 'obj-value-raw',
  visits: 'obj-value-raw',
  status: 'status',
  symbol: 'symbol',
  is_favorite: 'favor',
  users: 'users-arr'
});

dream.useSchema('campaign')
  .generateRnd(config.amount)
  .output((err, result) => {
    jsonfile.writeFile(config.path, result, function(err) {
      console.log(err ? err : `Data was generated and placed to ${config.path}`);
    });
  });
