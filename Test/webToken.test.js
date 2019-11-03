import { assert } from 'chai';
import ftp from '../Core/ftp';

/**
 * token 받아오는 로직 테스트
 */
describe('Get Token Test', () => {
    it('ftp에서 token 값 받기', () => {
        // given
        const expect = undefined;

        // when
        let actual = undefined;
        ftp('lovelyLily', (token) => {
            actual = token;

            // then
            assert.notEqual(actual, expect);
        });
    });
});