"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.plugin = void 0;
const core_1 = require("@pupbot/core");
const services_1 = require("./services");
const { version } = require('../package.json');
const plugin = new core_1.PupPlugin('天气', version);
exports.plugin = plugin;
const cmd = /^\s*([^\s]{2,10})天气\s*$/;
plugin.onMounted(() => {
    plugin.onMatch([/^\s*天气\s*$/, /^\s*\/?weather\s*$/], e => {
        e.reply('<城市名>天气', true);
    });
    plugin.onMatch(cmd, async (e) => {
        const city = cmd.exec(e.raw_message)[1]?.trim() ?? '';
        const info = await (0, services_1.fetchWeather)(city);
        return e.reply(info, typeof info === 'string');
    });
});
