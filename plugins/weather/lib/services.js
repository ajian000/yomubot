"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchWeather = void 0;
const core_1 = require("@pupbot/core");
const jsdom_1 = require("jsdom");
async function fetchWeather(cityName) {
    const id = await fetchCityId(cityName);
    if (!id) {
        return '城市不存在，请检查';
    }
    const link = `https://weather.cma.cn/web/weather/${id}.html`;
    const { data: html } = await core_1.http.get(link);
    const { document } = new jsdom_1.JSDOM(html).window;
    const cities = document
        .getElementById('breadcrumb')
        .textContent.trim()
        .replace(/\s+/g, '|')
        .split('|')
        .slice(2);
    let city = '';
    if (cities[1].startsWith(cities[0])) {
        city = cities[1];
    }
    else {
        city = cities.join('');
    }
    if (!city.includes(cityName.slice(0, 2)) || !city.includes(cityName.slice(2))) {
        return '城市不存在，请检查';
    }
    const dayiconPath = document.querySelector('.actived .dayicon img').src;
    const dayicon = `https://weather.cma.cn${dayiconPath}`;
    console.log(dayicon);
    const contents = document.getElementsByClassName('pull-left day actived')[0]
        .textContent.trim()
        .replace(/\s+/g, '|')
        .split('|')
        .filter(e => !e.startsWith('星期'));
    const [date, wea, wind, power, high, low] = contents;
    return [
        core_1.segment.image(dayicon),
        `\n〓 ${city} ${date} 天气 〓\n${wea} ${low} ~ ${high} ${wind} ${power}`
    ];
}
exports.fetchWeather = fetchWeather;
async function fetchCityId(cityName) {
    const api = 'https://weather.cma.cn/api/autocomplete';
    const { data } = await core_1.http.get(api, {
        params: {
            q: cityName,
            limit: 10
        },
        headers: {
            referer: 'https://weather.cma.cn/'
        }
    });
    if (data.code !== 0 || !data.data?.length) {
        return '';
    }
    return data.data[0].split('|')[0] || '';
}
