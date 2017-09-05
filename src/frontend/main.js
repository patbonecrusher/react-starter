import './styles/index.less';
import WebApp from './webapp';

const rootElement = document.getElementById('root');

(new WebApp()).start(rootElement);

console.log('hello');

