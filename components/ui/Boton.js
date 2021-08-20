import styled from '@emotion/styled';

const Boton = styled.a`
    display: block;
    font-weight: 700;
    text-transform: uppercase;
    border-radius: 5px;
    padding: .8rem 2rem;
    margin: 2rem auto;
    text-align: center;
    letter-spacing: 1px;
    background-color: ${props => props.bgColor ? '#8C56BE' : 'white'};
    color: ${props => props.bgColor ? 'white' : '#000'};

    &:last-of-type {
        margin-right: 0;
    }

    &:hover {
        cursor: pointer;
    }
`;

export default Boton;