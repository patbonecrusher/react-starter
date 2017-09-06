import webpack            from 'webpack';
import HtmlWebpackPlugin  from 'html-webpack-plugin';
import path               from 'path';
import CompressionPlugin  from 'compression-webpack-plugin';
import { version }        from './package.json';

// ----------------------------------------------------------------------------
const apiPrefix       = '/ReactHello';
const outputLocation  = path.resolve(__dirname, 'public');
const srcLocation     = path.resolve(__dirname, 'src');

// ----------------------------------------------------------------------------
module.exports = (env = {}) => {

  const isProduction  = process.env.NODE_ENV === 'production';
  const isDevelopment = process.env.NODE_ENV === 'development';
  const platform      = env.platform; // 'default' by default

  // Where is the code build output resides.  This settings also includes the
  // prefix added to the route.
  // --------------------------------------------------------------------------
  const output = {
    path:       outputLocation,
    filename:   'bundle.[chunkhash].js',
    publicPath: apiPrefix
  };

  // The main entry in the frontend app.
  // --------------------------------------------------------------------------
  const entry = { build: './src/frontend/main.js' };

  // The plugins we uses.
  //  - We split the vendors code in its own bundle.
  //  - We use some global defines in the code.
  //  - And we auto generate the index.html file.
  // --------------------------------------------------------------------------
  const plugins = [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: 'vendor.[chunkhash].js',
      minChunks: function (module) {
        return module.context && module.context.indexOf('node_modules') !== -1;
      }
    }),

    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
      __DEV__       : JSON.stringify(isDevelopment),
      __PRODUCTION__: JSON.stringify(isProduction),
      __VERSION__   : JSON.stringify(version),
      __API_PREFIX__: JSON.stringify(apiPrefix)
    }),

    new webpack.ProvidePlugin({
      R: 'ramda'
    }),

    new webpack.NoEmitOnErrorsPlugin(),

    new HtmlWebpackPlugin({
      template: srcLocation + '/frontend/index.template.html'
    }),

    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new webpack.optimize.AggressiveMergingPlugin(),

    new CompressionPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: /\.js$|\.css$|\.html$/,
      threshold: 10240,
      minRatio: 0.8
    })
  ];

  // Our loaders.  How each file format should be treated.
  // --------------------------------------------------------------------------
  const module = {
    rules: [
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        exclude: [/node_modules/],
        query: {
          plugins: ['transform-runtime', 'transform-export-extensions', 'transform-class-properties'],
          presets: ['react', 'env']
        }
      },
      { test: /\.css$/, loader: 'style-loader!css-loader' },
      { test: /\.less$/, loader: 'style-loader!css-loader!less-loader'},
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loaders: [
          'url-loader?limit=50000&hash=sha512&digest=hex&size=16&name=resources/[name]-[hash].[ext]',
          'image-webpack-loader?bypassOnDebug'
        ]
      }
    ]
  };

  // This enables us to use ~style as the root path inside less include.  No
  // need to add a bunch of .. in front of it.
  // --------------------------------------------------------------------------
  const resolve = {
    extensions: ['.js', '.jsx', '.css', '.less'],
    alias: {
      style: path.resolve(__dirname, 'src/frontend/styles')
    }
  };

  return {entry, output, plugins, module, resolve};
};


