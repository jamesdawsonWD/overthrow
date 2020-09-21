import Vue from 'vue';
import BN from 'bignumber.js';
Vue.filter('decimalsPrecision', function (
    value: BN | number | string,
    precision: number
) {
    if (!value) {
        return '';
    }
    return new BN(value).div(10 ** precision);
});

Vue.filter('toFixed', function (value: BN | number | string, fixed: number) {
    if (!value) {
        return '';
    }
    return new BN(value).toFixed(fixed);
});

Vue.filter('removeHyphens', function (value: string) {
    if (!value) {
        return '';
    }
    return value.replace(/-/g, ' ');
});