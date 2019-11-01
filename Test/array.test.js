import { assert } from 'chai';

/**
 * 객체 참조 또는 복사 관련 테스트
 */
describe('Simple Array Test', () => {
    it('객체 얕은 복사', () => {
        // given
        let items = ['a', 'b', 'c'];
        const expect = ['a', 'b', 'c'];

        // when
        let actual = items;
        items = ['c'];

        // then
        assert.deepEqual(actual, expect);
    });

    it('객체 깊은 복사', () => {
        // given
        let items = ['a', 'b', 'c'];
        const expect = ['a', 'b', 'c'];

        // when
        let actual = JSON.parse(JSON.stringify(items));
        items = ['c'];

        // then
        assert.deepEqual(actual, expect);
    });
});