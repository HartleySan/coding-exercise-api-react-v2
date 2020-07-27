import React from 'react';
import { shallow } from 'enzyme';
import FlashMsg from '../FlashMsg';

let wrapper;

describe('<FlashMsg />', () => {
    beforeAll(() => {
        wrapper = shallow(<FlashMsg />);

        wrapper.setState({
            type: null,
            msg: null
        });
    });

    test('should match the snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });
});