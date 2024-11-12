// webpack.config.js
const path = require('path');

module.exports = {
    // Входной файл, например, main.js
    entry: './src/js/main.js',

    // Настройки выходного файла
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
    },

    // Модули и загрузчики
    module: {
        rules: [
            {
                test: /\.css$/,          // Подключение CSS-файлов
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.scss$/,         // Подключение SCSS-файлов
                use: ['style-loader', 'css-loader', 'sass-loader'],
            },
            {
                test: /\.js$/,           // Применение Babel к JS-файлам
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                    },
                },
            },
        ],
    },

    // Режим сборки: development или production
    mode: 'development',
};