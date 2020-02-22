// @ts-check
import throttles from 'throttles';
import { request } from './node_modules/requestidlecallback';

const [toAdd, isDone] = throttles(1);

/**
 *
 * @param {*} url
 */
function executeScript(url) {
    return new Promise((resolve, reject) => {
        const head =
            document.getElementsByTagName('head')[0] ||
            document.documentElement;
        const script = document.createElement('script');

        script.type = 'text/javascript';
        script.src = url;
        script.addEventListener('load', resolve);
        script.addEventListener('error', reject);
        head.appendChild(script);
    });
}

/**
 * Prefetch array urls one by one when idle
 * @param {string[]} urls
 * @returns {Promise<void[]>}
 */
function prefetch(urls) {
    const promises = urls.map(url => {
        return toAdd(() => {
            request(() => executeScript(url).then(isDone));
        });
    });
    return Promise.all(promises);
}

export default prefetch;
