import React from 'react';
import { shallow } from 'enzyme';
import Modal from '../Modal';

let wrapper;

describe('<Modal />', () => {
    beforeAll(() => {
        wrapper = shallow(<Modal />);

        wrapper.setState({
            msg: null,
            callback: null
        });
    });

    test('should match the snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });
});