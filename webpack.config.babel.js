import webpack            from 'webpack';
import HtmlWebpackPlugin  from 'html-webpack-plugin';
import path               from 'path';
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

  // Source map settings.  For some reason, source-map is the one that works.
  // --------------------------------------------------------------------------
  const devtool = 'source-map';

  // Where is the code build output resides.  This settings also includes the
  // prefix added to the route.
  // --------------------------------------------------------------------------
  const output = {
    path:       outputLocation,
    filename:   'bundle.js',
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
      filename: 'vendor.js',
      minChunks: function (module) {
        return module.context && module.context.indexOf('node_modules') !== -1;
      }
    }),

    new webpack.DefinePlugin({
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
    })
  ];

  // This is to allow routing request to our back end server.
  // --------------------------------------------------------------------------
  const devServer = {
    compress: true,
    host: '0.0.0.0',
    port: 3000,
    proxy: {},
    // Required to work with react-router.
    historyApiFallback: {
      index: `/${apiPrefix}/index.html`,
      verbose: console.log.bind(console)
    }
  };

  const socketPath = `${apiPrefix}/socket.io`;
  devServer.proxy[socketPath] = {
    target: 'ws://localhost:9000',
    ws: true
  }

  const apiProxyPath = `${apiPrefix}/api`;
  console.log(apiProxyPath);
  devServer.proxy[apiProxyPath] = { target: 'http://localhost:9000' }

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
          presets: ['es2017', 'es2015', 'react', 'stage-2']
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

  return {devtool, entry, output, plugins, module, resolve, devServer};
};


