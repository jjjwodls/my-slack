import path from "path";
// import from '@pmm';
import webpack from 'webpack';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'

const isDeveloment = process.env.NODE_ENV !== 'production';
const config: webpack.Configuration = {
  name : 'sleact',
  mode : isDeveloment ? 'development' : 'production',
  devtool : isDeveloment ? 'hidden-source-map' : 'inline-source-map',
  resolve : {
    extensions : ['.js', '.jsx', '.ts', '.tsx', '.json'], //babel이 처리할 확장자
    alias : { // 
      '@hooks' : path.resolve(__dirname, 'hooks'), // webpack에서 설정 babel에서 체크하기 위해
      '@components' : path.resolve(__dirname, 'components'),
      '@layouts' : path.resolve(__dirname, 'layouts'),
      '@pages' : path.resolve(__dirname, 'pages'),
      '@utils' : path.resolve(__dirname, 'utils'),
      '@typings' : path.resolve(__dirname, 'typings'),
    },
  },
  entry : {
    app : './client'
  },
  module : {
    rules : [
      {
        test : /\.tsx?$/,
        loader : 'babel-loader',
        options : {
          presets : [
            [
              '@babel/preset-env',
              {
                targets : {browsers : ['last 2 chrome versions']},
                debug : isDeveloment
              },
            ],
            '@babel/preset-react',
            '@babel/preset-typescript',
          ], //모든 소스코드를 ie에서까지 돌아 갈 수 있도록 만들어준다. babel이
         
        },
        exclude : path.join(__dirname,'node_modules'),
      },
      {
        test : /\.css?$/,
        use: ['style-loader', 'css-loader'], //css 파일을 js로 변환시켜준다. 
      }
    ]
  },
  plugins : [
    new ForkTsCheckerWebpackPlugin({
      async : false
    }),
    //process.env.NODE_ENV를 접근 가능하도록 해줌.
    new webpack.EnvironmentPlugin({NODE_ENV: isDeveloment ? 'development' : 'production'}), 
  ],
  output :{
    path : path.join(__dirname,'dist'),
    filename :'[name].js', //entry 에 설정된 값들을 주루룩 만들어줌.
    publicPath : '/dist/',
  },
  // devServer : {
  //   historyApiFallback : true,

  // },
};

export default config; //요거 빼먹어서 build 안된거 찾음...