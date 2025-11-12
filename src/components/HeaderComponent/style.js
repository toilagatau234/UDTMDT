import { Row } from 'antd'
import { Input } from 'antd'
import styled from 'styled-components'

export const WrapperHeader = styled(Row)`
    padding: 10px 120px;
    background-color: #326e51;
    align-items: center;
    
    @media (max-width: 768px) {
        padding: 10px 20px;
    }
`

export const WrapperTextHeader = styled.span`
    font-size: 18px;
    color: #fff;
    font-weight: bold;
    text-align: left;
    cursor: pointer;
`

export const WrapperHeaderAccount = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    color: #fff;
    font-size: 12px;
    cursor: pointer;
    
    &:hover {
        opacity: 0.8;
    }
`

export const WrapperTextHeaderSmall = styled.span`
    font-size: 12px;
    color: #fff;
    white-space: nowrap;
`

export const ButtonSearch = styled(Input.Search)`
    width: 100%;
    
    .ant-input-search-button {
        background-color: #326e51 !important;
        border-color: #326e51 !important;
        
        &:hover {
            background-color: #2a5d44 !important;
            border-color: #2a5d44 !important;
        }
    }
    
    .ant-btn-primary {
        background-color: #326e51 !important;
        border-color: #326e51 !important;
        
        &:hover {
            background-color: #2a5d44 !important;
            border-color: #2a5d44 !important;
        }
    }
`