import { styled } from 'styled-components';
import AdminPageWrapper from '../../components/PageLayout.style';

export const CouponWrapper = styled(AdminPageWrapper)`
    padding: 20px;
    background: #f8f9fc;
`;

export const CouponHeader = styled.div`
    margin-bottom: 24px;
    background: #fff;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);

    .header-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .page-title {
        margin: 0;
        color: #333;
        font-size: 24px;
        font-weight: 500;
    }

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

export const CouponFilters = styled.div`
    margin-bottom: 24px;

    .search-input {
        width: 100%;
        max-width: 320px;
        padding: 10px 15px;
        border: 1px solid #e3e6f0;
        border-radius: 5px;
        transition: all 0.3s;

            &:focus {
            outline: none;
            border-color: #00d165;
            box-shadow: 0 0 0 0.2rem rgba(0,209,101,0.12);
        }
    }
`;

export const CouponTable = styled.div`
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
    overflow: hidden;
`;

export const TableResponsive = styled.div`
    overflow-x: auto;
    min-height: 200px;

    table {
        width: 100%;
        border-collapse: collapse;

        th, td {
            padding: 12px 16px;
            text-align: left;
            border-bottom: 1px solid #e3e6f0;
            vertical-align: middle;
        }

        th {
            background: #f8f9fc;
            color: #00d165;
            font-weight: 600;
            white-space: nowrap;
        }

        tbody tr {
            transition: background 0.2s;

            &:hover { background: #f8f9fc; }
        }

    .discount { font-weight: 600; color: #00d165; }
        .status-cell { vertical-align: middle; }
    }
`;

export const LoadingWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 140px;

    .spinner-border { color: #00d165; }
`;

export const NoDataMessage = styled.div`
    text-align: center;
    padding: 30px;
    color: #666;
    font-style: italic;
`;

export const ActionButtons = styled.div`
    display: flex;
    gap: 8px;

    button { cursor: pointer; }
`;

export const ModalContent = styled.div`
    .form-group {
        margin-bottom: 1rem;

        label {
            display: block;
            margin-bottom: 0.5rem;
            color: #333;
            font-weight: 500;
        }

        input, select {
            width: 100%;
            padding: 0.5rem 0.75rem;
            border: 1px solid #e3e6f0;
            border-radius: 4px;
            transition: all 0.2s;

                &:focus {
                outline: none;
                border-color: #00d165;
                box-shadow: 0 0 0 0.15rem rgba(0,209,101,0.12);
            }
        }

        .small-help {
            font-size: 0.85rem;
            color: #6c757d;
            margin-top: 0.25rem;
        }
    }

    .btn-primary {
        background-color: #00d165;
        border-color: #00d165;

        &:hover {
            background-color: #00b95a;
            border-color: #00b95a;
        }
    }
`;