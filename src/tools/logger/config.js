module.exports = {
    appenders: {
        out: { type: 'console' },
        access: { 'type': 'dateFile', 'filename': 'logs/access.log',
            'pattern': '-yyyy-MM-dd.log', 'alwaysIncludePattern': true },
        error: { 'type': 'dateFile', 'filename': 'logs/error',
            'pattern': '-yyyy-MM-dd.log', 'alwaysIncludePattern': true },
        default: { 'type': 'dateFile', 'filename': 'logs/default',
            'pattern': '-yyyy-MM-dd.log', 'alwaysIncludePattern': true },
    },
    categories: {
        default: { appenders: ['out', 'default'], level: 'info' },
        access: { appenders: ['access', 'out'], level: 'info' },
        error: { appenders: ['error'], level: 'error' },
    },
};
