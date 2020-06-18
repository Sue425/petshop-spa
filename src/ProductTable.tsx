import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableContainer from '@material-ui/core/TableContainer';
import TablePagination from '@material-ui/core/TablePagination';
import './ProductTable.css';
import { Paper, Snackbar, SnackbarContent } from '@material-ui/core';
import { BriefProduct } from './Product';
import { ProductRow } from './ProductRow';


interface IProductTableProps {
    showProductDetailCallback: any;
}

interface IProductTableState {
    snackBarOpen: boolean;
    productList: BriefProduct[];
    totalCount: number;
    actualPageIndex: number;
}


export class ProductTable extends React.Component<IProductTableProps, IProductTableState> {

    constructor(props: IProductTableProps) {
        super(props);
        this.state = { snackBarOpen: false, productList: [], totalCount: 0, actualPageIndex: 0 };

        this.handleSnackbarClose = this.handleSnackbarClose.bind(this);
        this.handleBadAmount = this.handleBadAmount.bind(this);
        this.handlePageChange = this.handlePageChange.bind(this);
        this.getDataFromApi = this.getDataFromApi.bind(this);
    }

    componentDidMount(): void {
        this.setState({actualPageIndex: 0});
        setTimeout(this.getDataFromApi, 200);
    }

    handleBadAmount(): void {
        this.setState({ snackBarOpen: true });
    }

    handleSnackbarClose(): void {
        this.setState({ snackBarOpen: false });
    }

    handlePageChange(event: any, page: number): void {
        this.setState({actualPageIndex: page});
        setTimeout(this.getDataFromApi, 200);
    }

    getDataFromApi(): void {
        const query = '?size=' + 10 + '&page=' + this.state.actualPageIndex;
        const baseUrl = "http://localhost:8080/api/products";
        fetch(baseUrl + query)
        .then((response) => {
            response.json().then((data) => {
                this.setState({productList: data.content, totalCount: data.totalElements});
            })
        },
        (error) => {
            console.log(error);
        });
    }

    render() {
        const products = this.state.productList;

        return (
            <div>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead className="table-header">
                            <TableRow>
                                <TableCell className="first-and-last-col">Product name</TableCell>
                                <TableCell className="other-cols middle-aligned-cols">Product details</TableCell>
                                <TableCell className="other-cols middle-aligned-cols">Price</TableCell>
                                <TableCell className="first-and-last-col middle-aligned-cols">Buy product</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {products.map((product: BriefProduct) => (
                                <ProductRow product={product} key={product.id} snackbarCallback={this.handleBadAmount}
                                    showProductDetailCallback={this.props.showProductDetailCallback}/>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPage={10}
                    rowsPerPageOptions={[10]}
                    count={this.state.totalCount}
                    component="div"
                    onChangePage={(event, page) => this.handlePageChange(event, page)}
                    page={this.state.actualPageIndex} />
                <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'right' }} open={this.state.snackBarOpen} autoHideDuration={4000}
                    onClose={this.handleSnackbarClose}>
                    <SnackbarContent message="You cannot order zero or negative amount of a product"></SnackbarContent>
                </Snackbar>
            </div>
        );
    }

}