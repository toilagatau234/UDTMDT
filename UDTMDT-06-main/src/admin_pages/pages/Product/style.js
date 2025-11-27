import { styled } from 'styled-components';
import AdminPageWrapper from '../../components/PageLayout.style';

export const ProductWrapper = styled(AdminPageWrapper)`
    padding: 20px;

    .btn-primary {
        background: #00d165;
        border: none;
        padding: 8px 20px;
        border-radius: 5px;
        color: white;
        display: flex;
        align-items: center;
        gap: 8px;
        transition: all 0.3s;
        cursor: pointer;

        &:hover {
            background: #00b95a;
            transform: translateY(-1px);
        }

        i {
            font-size: 14px;
        }
    }
`;

export const ProductHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    h2 {
        font-size: 24px;
        color: #333;
    }

    .add-button {
        background: #00d165;
        color: white;
        padding: 10px 20px;
        border-radius: 5px;
        border: none;
        cursor: pointer;
        transition: background 0.3s;

        // &:hover {
        //     background: #00b95a;
        //     transform: translateY(-1px);
        // }
    }

    
`;

export const ProductFilters = styled.div`
    display: flex;
    gap: 20px;
    margin-bottom: 20px;

    .search-box {
        flex: 1;
        input {
            width: 100%;
            padding: 10px;
            border: 1px solid #e3e6f0;
            border-radius: 5px;
        }
    }

    .filter-select {
        width: 200px;
        select {
            width: 100%;
            padding: 10px;
            border: 1px solid #e3e6f0;
            border-radius: 5px;
        }
    }
`;

export const ProductGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 16px;
`;

export const ProductCard = styled.div`
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0,0,0,0.1);
    overflow: hidden;

    .product-image {
        width: 100%;
        height: 200px;
        object-fit: cover;
    }

    .product-info {
        padding: 15px;

        h3 {
            margin: 0 0 10px;
            color: #333;
        }

        .price {
            color: #00d165;
            font-weight: bold;
            margin-bottom: 10px;
        }

        .stock {
            color: #666;
            margin-bottom: 10px;
        }
    }

    .product-actions {
        padding: 15px;
        border-top: 1px solid #e3e6f0;
        display: flex;
        justify-content: space-between;

        button {
            padding: 5px 10px;
            border: none;
            border-radius: 4px;
            cursor: pointer;

            &.edit {
                background: #00d165;
                color: white;
            }

            &.delete {
                background: #e74a3b;
                color: white;
            }
        }
    }
`;