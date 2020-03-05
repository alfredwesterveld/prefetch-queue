// @ts-check
import throttles from 'throttles';
import { request } from './node_modules/requestidlecallback';

const [toAdd, isDone] = throttles(1);

/**
 * @param {*} url
 */
function get(url) {
    if ('fetch' in window) {
        return fetch(url, {
            mode: 'no-cors'
        });
    }
}

/**
 * Prefetch array urls one by one when idle
 * @param {string[]} urls
 * @returns {Promise<void[]>}
 */
function prefetch(urls) {
    const promises = urls.map(url => {
        return toAdd(() => {
            request(() => get(url).then(isDone));
        });
    });
    return Promise.all(promises);
}

export default prefetch;
