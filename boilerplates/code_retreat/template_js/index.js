import _ from 'lodash';
import { assert } from 'chai'; // assert reference: http://chaijs.com/api/assert/

describe( 'Numbers', () => {
	describe( 'Sample', () => {
		it( '2 should be larger than 1', () => {
			assert( 2 > 1 );
		} );

		it( '1 should equal 1', () => {
			assert.equal( 1, 1 );
		} );

		it( 'those two arrays should be equal', () => {
			assert.deepEqual( [1, 2, 3], [1, 2, 3] );
		} );
	} );
} );
