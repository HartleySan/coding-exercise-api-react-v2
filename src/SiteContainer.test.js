import React from 'react';
import { shallow } from 'enzyme';
import SiteContainer from './SiteContainer';

let wrapper;

describe('<SiteContainer />', () => {
    beforeAll(() => {
        wrapper = shallow(<SiteContainer />);
    });

    test('should match the snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });
});