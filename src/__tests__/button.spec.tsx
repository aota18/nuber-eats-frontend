import { render } from '@testing-library/react';
import { debug } from 'console';
import { Button } from '../components/button';

describe("<Button />", () => {
    it('should render OK with props', () => {

        const {getByText, debug} =  render (
            <Button canClick={true} loading={false} actionText={"test"}/>
        )

        
        getByText("test");
        debug();


        
    });


    it('should display loading', () => {
        const {getByText, debug, container} =  render (
            <Button canClick={true} loading={true} actionText={"test"}/>
        );

        getByText('Loading ...');

    })
})