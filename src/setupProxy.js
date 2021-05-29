const VHKL_ASSETS_URL = process?.env?.VHKL_ASSETS_URL ?? 'https://de.vehikill.io/assets';

const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(
        '/assets',
        createProxyMiddleware({
            target: VHKL_ASSETS_URL,
            changeOrigin: true,
            autoRewrite: true,
            protocolRewrite: 'http',
            pathRewrite: {
                ['^/assets'] : ''
            }
        })
    );
};
