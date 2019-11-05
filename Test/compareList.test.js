import { assert } from 'chai';
import { compareLists } from 'compare-lists';

/**
 * Compare-Lists 서드파티 라이브러리와 관련된 테스트
 */
describe('A compare-lists lib tests', () => {
    it('A left array when exist item in left array', () => {
        // given
        const left_items = ['a', 'b', 'c'];
        const right_items = ['b', 'c'];
        const expect = [];

        // when
        let actual = [];
        compareLists({
            left: left_items,
            right: right_items,
            compare: (left, right) => left.localeCompare(right),
            onMissingInLeft: (right) => actual.push(right)
        })

        // then
        assert.deepEqual(actual, expect);
    });

    it('A right array when exist item in left array', () => {
        // given
        const left_items = ['a', 'b', 'c'];
        const right_items = ['b', 'c'];
        const expect = ['a'];

        // when
        let actual = [];
        compareLists({
            left: left_items,
            right: right_items,
            compare: (left, right) => left.localeCompare(right),
            onMissingInRight: (left) => actual.push(left)
        })

        // then
        assert.deepEqual(actual, expect);
    });

    it('A left array when exist item in right array', () => {
        // given
        const left_items = ['a', 'b', 'c'];
        const right_items = ['a', 'b', 'c', 'd'];
        const expect = ['d'];

        // when
        let actual = [];
        compareLists({
            left: left_items,
            right: right_items,
            compare: (left, right) => left.localeCompare(right),
            onMissingInLeft: (right) => actual.push(right)
        })

        // then
        assert.deepEqual(actual, expect);
    });

    it('A right array when exist item in right array', () => {
        // given
        const left_items = ['a', 'b', 'c'];
        const right_items = ['a', 'b', 'c', 'd'];
        const expect = [];

        // when
        let actual = [];
        compareLists({
            left: left_items,
            right: right_items,
            compare: (left, right) => left.localeCompare(right),
            onMissingInRight: (left) => actual.push(left)
        })

        // then
        assert.deepEqual(actual, expect);
    });

    /**
     * 둘 다 같을 경우 right_items 기준 반환 값 확인
     */
    it('A exist item in right array', () => {
        // given
        const left_items = ['a', 'b', 'c', 'd'];
        const right_items = ['a', 'b', 'c', 'd'];
        const expect = [];

        // when
        let actual = [];
        compareLists({
            left: left_items,
            right: right_items,
            compare: (left, right) => left.localeCompare(right),
            onMissingInRight: (left) => actual.push(left)
        })

        // then
        assert.deepEqual(actual, expect);
    });

    /**
     * 현재 파싱형태 확인
     */
    it('실제 파싱되어 메세지 보내는 형태(eng)', () => {
        // given
        let left_items = [
            { title: 'b', url: 'b' },
            { title: 'c', url: 'c' },
            { title: 'd', url: 'd' },
            { title: 'e', url: 'e' },
            { title: 'f', url: 'f' }
        ];
        let right_items = [
            { title: 'a', url: 'a' },
            { title: 'b', url: 'b' },
            { title: 'c', url: 'c' },
            { title: 'd', url: 'd' },
            { title: 'e', url: 'e' }
        ];
        const left_expect = [
            { title: 'a', url: 'a' },
            { title: 'b', url: 'b' },
            { title: 'c', url: 'c' },
            { title: 'd', url: 'd' },
            { title: 'e', url: 'e' }
        ];
        const right_expect = [];
        const msg_expect = { title: 'a', url: 'a' };

        // when
        compareLists({
            left: left_items,
            right: right_items,
            compare: (left, right) => left.url.localeCompare(right.url),
            onMissingInLeft: (msg_actual) => {
                if (left_items.length > 0 && right_items.length > 0) {
                    // then
                    assert.deepEqual(msg_actual, msg_expect);
                }
            }
        });

        left_items = right_items;
        right_items = [];

        // then
        assert.deepEqual(left_items, left_expect);
        assert.deepEqual(right_items, right_expect);
    });

    it('실제 파싱되어 메세지 보내는 형태(kor)', () => {
        // given
        let left_items = [
            { title: '나', url: 'b' },
            { title: '다', url: 'c' },
            { title: '라', url: 'd' },
            { title: '마', url: 'e' },
            { title: '바', url: 'f' }
        ];
        let right_items = [
            { title: '가', url: 'a' },
            { title: '나', url: 'b' },
            { title: '다', url: 'c' },
            { title: '라', url: 'd' },
            { title: '마', url: 'e' }
        ];
        const left_expect = [
            { title: '가', url: 'a' },
            { title: '나', url: 'b' },
            { title: '다', url: 'c' },
            { title: '라', url: 'd' },
            { title: '마', url: 'e' }
        ];
        const right_expect = [];
        const msg_expect = { title: '가', url: 'a' };

        // when
        compareLists({
            left: left_items,
            right: right_items,
            compare: (left, right) => left.url.localeCompare(right.url),
            onMissingInLeft: (msg_actual) => {
                if (left_items.length > 0 && right_items.length > 0) {
                    // then
                    assert.deepEqual(msg_actual, msg_expect);
                }
            }
        });

        left_items = right_items;
        right_items = [];

        // then
        assert.deepEqual(left_items, left_expect);
        assert.deepEqual(right_items, right_expect);
    });

    it('실제 파싱되어 메세지 보내는 형태(real)', () => {
        // given
        let left_items = [
            { title: '[안내] 10월 불량이용자 단속 결과 안내', url: 'http://soulworker.game.onstove.com/Notice/Detail/2469' },
            { title: '[안내] 11월 캐시샵 신규 상품 안내', url: 'http://soulworker.game.onstove.com/Notice/Detail/2468' },
            { title: '[안내][내용추가] 랭킹 컨텐츠 중단 관련 사전 안내', url: 'http://soulworker.game.onstove.com/Notice/Detail/2467' },
            { title: '[안내] 할로윈 마이룸 가구 할인 판매 이벤트 및 캐시샵 신규상품 안내', url: 'http://soulworker.game.onstove.com/Notice/Detail/2466' },
            { title: '[안내/수정완료] 구글 계정 홈페이지 로그인 불가 현상 안내', url: 'http://soulworker.game.onstove.com/Notice/Detail/2465' }
        ];
        let right_items = [
            { title: '[점검] 11/6(수) 소울워커 정기점검 안내', url: 'http://soulworker.game.onstove.com/Notice/Detail/2472' },
            { title: '[안내] 10월 불량이용자 단속 결과 안내', url: 'http://soulworker.game.onstove.com/Notice/Detail/2469' },
            { title: '[안내] 11월 캐시샵 신규 상품 안내', url: 'http://soulworker.game.onstove.com/Notice/Detail/2468' },
            { title: '[안내][내용추가] 랭킹 컨텐츠 중단 관련 사전 안내', url: 'http://soulworker.game.onstove.com/Notice/Detail/2467' },
            { title: '[안내] 할로윈 마이룸 가구 할인 판매 이벤트 및 캐시샵 신규상품 안내', url: 'http://soulworker.game.onstove.com/Notice/Detail/2466' }
        ];
        const left_expect = [
            { title: '[점검] 11/6(수) 소울워커 정기점검 안내', url: 'http://soulworker.game.onstove.com/Notice/Detail/2472' },
            { title: '[안내] 10월 불량이용자 단속 결과 안내', url: 'http://soulworker.game.onstove.com/Notice/Detail/2469' },
            { title: '[안내] 11월 캐시샵 신규 상품 안내', url: 'http://soulworker.game.onstove.com/Notice/Detail/2468' },
            { title: '[안내][내용추가] 랭킹 컨텐츠 중단 관련 사전 안내', url: 'http://soulworker.game.onstove.com/Notice/Detail/2467' },
            { title: '[안내] 할로윈 마이룸 가구 할인 판매 이벤트 및 캐시샵 신규상품 안내', url: 'http://soulworker.game.onstove.com/Notice/Detail/2466' }
        ];
        const right_expect = [];
        const item_expect = { title: '[점검] 11/6(수) 소울워커 정기점검 안내', url: 'http://soulworker.game.onstove.com/Notice/Detail/2472' };

        // when
        right_items.forEach(item => {
            const res = left_items.every(n => n.title !== item.title);

            // then
            if (res) {
                assert.deepEqual(item, item_expect);
            }
        });

        left_items = right_items;
        right_items = [];

        // then
        assert.deepEqual(left_items, left_expect);
        assert.deepEqual(right_items, right_expect);
    });
});