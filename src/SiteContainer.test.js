import React from 'react';
import { shallow } from 'enzyme';
import SiteContainer from './SiteContainer';

let wrapper, data;

describe('<SiteContainer />', () => {

    beforeAll(() => {
        wrapper = shallow(<SiteContainer />)
        data = [{
            "id": 132,
            "first_name": "Macie",
            "last_name": "Emmerich",
            "email_address": "cremin.marjory@hotmail.com",
            "status": "active",
            "updated_at": "2019-07-20 22:05:47",
            "created_at": "2019-07-20 22:05:47"
        }]

        wrapper.setState({ 'data' : data });
    });

    test('should match the snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });
})
