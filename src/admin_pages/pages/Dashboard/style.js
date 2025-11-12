import { styled } from 'styled-components';
import AdminPageWrapper from '../../components/PageLayout.style';

export const DashboardWrapper = styled(AdminPageWrapper)`
    padding: 20px;
`;

export const DashboardCards = styled.div`
    margin-bottom: 30px;
`;

export const WelcomeCard = styled.div`
    background: #fff;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0,0,0,0.1);
    margin-bottom: 20px;

    h3 {
        margin: 0;
        font-size: 24px;
        color: #333;
    }

    p {
        margin: 5px 0 0;
        color: #666;
    }
`;

export const StatCard = styled.div`
    background: #fff;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0,0,0,0.1);
    margin-bottom: 20px;

    .dash-widget-header {
        display: flex;
        align-items: center;
        margin-bottom: 15px;
    }

    .dash-widget-icon {
        width: 50px;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        font-size: 24px;
        margin-right: 15px;

        &.text-primary {
            background: rgba(0, 209, 101, 0.08);
            color: #00d165;
        }
        
        &.text-success {
            background: rgba(28, 200, 138, 0.1);
            color: #1cc88a;
        }
        
        &.text-danger {
            background: rgba(231, 74, 59, 0.1);
            color: #e74a3b;
        }
        
        &.text-warning {
            background: rgba(246, 194, 62, 0.1);
            color: #f6c23e;
        }
    }

    .dash-count {
        h3 {
            margin: 0;
            font-size: 24px;
            font-weight: bold;
        }
    }

    .dash-widget-info {
        h6 {
            margin: 0;
            color: #666;
        }
    }
`;

export const ChartSection = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
    margin-bottom: 30px;
`;

export const ChartCard = styled.div`
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0,0,0,0.1);
    overflow: hidden;

    .card-header {
        padding: 15px 20px;
        border-bottom: 1px solid #e3e6f0;

        h4 {
            margin: 0;
            color: #333;
        }
    }

    .card-body {
        padding: 20px;
    }
`;

export const OrdersTable = styled.div`
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0,0,0,0.1);
    overflow: hidden;

    .card-header {
        padding: 15px 20px;
        border-bottom: 1px solid #e3e6f0;

        h4 {
            margin: 0;
            color: #333;
        }
    }

    .card-body {
        padding: 0;
    }
`;

export const TableResponsive = styled.div`
    overflow-x: auto;

    table {
        width: 100%;
        border-collapse: collapse;

        th, td {
            padding: 12px 15px;
            text-align: left;
            border-bottom: 1px solid #e3e6f0;
        }

        th {
            background: #f1f3f6;
            color: #334155;
            font-weight: bold;
        }

        tbody tr:hover {
            background: #f8f9fc;
        }

        .btn-primary {
            background: #00d165;
            color: white;
            padding: 5px 10px;
            border-radius: 4px;
            text-decoration: none;
            font-size: 12px;
            
            &:hover {
                background: #00b95a;
            }
        }
    }
`;