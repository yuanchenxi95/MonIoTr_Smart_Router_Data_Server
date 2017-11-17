module.exports = {
    "env": {
        "es6": true,
        "node": true
    },
    "extends": ["eslint:recommended", "google"],
    "parserOptions": {
        "sourceType": "module",
        "ecmaVersion": 2017
    },
    "rules": {
        "object-curly-spacing": [
            2,
            "always"
        ],
        "indent": [
            "error",
            4
        ],
        "quotes": [
            "error",
            "single"
        ],
        "no-invalid-this": 0,
        "require-jsdoc": ["error", {
            "require": {
                "FunctionDeclaration": false,
                "MethodDefinition": false,
                "ClassDeclaration": false,
                "ArrowFunctionExpression": false,
                "FunctionExpression": false
            }
        }],
        "max-len": [
            "error",
            120
        ],
        "new-cap": 0
    }
};