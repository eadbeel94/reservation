const { join }= require('path');
const { readFileSync }= require('fs');
const prod= process.env.NODE_ENV === 'production';

const TerserPlugin = require("terser-webpack-plugin");
const HtmlWebpackPlugin= require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

const orgPath= './src/views/';
const desPath= '../backend/dist/public/';
const outFiles= [{},[]];
const inpFiles= [
  ['main','01-main','/index.html'],
  ['notfound','05-notfound','/404.html'],
  ['notauth','06-notauth','/511.html'],
  ['master','11-master','/views/master/index.html'],
  ['manage','12-manage','/views/manage/index.html'],
  ['scan','13-scan','/views/scan/index.html'],
  ['client','22-client','/views/client/index.html'],
  ['create','23-create','/views/create/index.html'],
  ['meeting','24-meeting','/views/meeting/index.html'],
  ['history','25-history','/views/history/index.html'],
]
outFiles[0]['common']= './src/js/common.js';

inpFiles.forEach( r =>{  
  outFiles[0][`${r[0]}`]= orgPath + r[1] + '/app.js';
  outFiles[1].push( new HtmlWebpackPlugin({
    template: join( __dirname, orgPath, r[1], 'index.html' ),
    filename: join( __dirname, desPath, r[2] ),
    chunks: ['common',`${r[0]}`],
    templateParameters: {
      htmlWebpackPlugin: {
        tags: {
          title: "Reservations",
          icon: `<link rel="icon" href="/img/favicon.ico">`,
          header: readFileSync( join( __dirname, './src/template/header.html' ) ),
          footer: readFileSync( join( __dirname, './src/template/footer.html' ) ),
          tmodal: readFileSync( join( __dirname, './src/template/t_modal.html' ) ),
        },
      }
    },
    minify: prod ? {
      collapseWhitespace: true, removeComments: true, removeRedundantAttributes: true,
      removeScriptTypeAttributes: true, removeStyleLinkTypeAttributes: true, useShortDoctype: true
    } : {},
  }) );
});

module.exports= {
  entry: outFiles[0],
  mode: prod ? 'production' : 'development',
  output: {
    path: join(__dirname, desPath ),
    filename: 'js/[name].bundle.js',
    publicPath: '/'
  },
  devServer: {
    contentBase: join(__dirname, 'www') //, hot: false, inline: false,
  },
  module : {
    rules: [
      {
        test: /\.(sass|css|scss)$/,
        use: [prod ? MiniCssExtractPlugin.loader : 'style-loader','css-loader']
      },{
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [{loader: 'file-loader', options:{ outputPath: 'fonts/', name: '[name].[ext]' }}],
      },{
        test: /\.(png|svg|jpg|jpeg|gif|ico)$/i,
        use: [{loader: 'file-loader', options:{ outputPath: 'img/', name: '[name].[ext]' }}],
      },
    ]
  },
  plugins: prod ? [ new MiniCssExtractPlugin({ filename: 'css/[name].bundle.css' }) ].concat(outFiles[1]) : outFiles[1],
  optimization: prod ? {
    minimize: true,
    minimizer: [
      new TerserPlugin(),
      new CssMinimizerPlugin({
        minimizerOptions: {
          preset: [
            'default',
            {
              discardComments: { removeAll: true },
            },
          ],
        },
      }),
    ]
  } : {},
  devtool: 'source-map'
};