import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import { BriefProduct } from './Product';
import { TextField } from '@material-ui/core';
import './ProductRow.css';

interface IProductRowProps {
    product: BriefProduct;
    snackbarCallback: any;
    showProductDetailCallback: any;
}

interface IProductRowState {
    amountError: boolean;
    amount: number;
}

export class ProductRow extends React.Component<IProductRowProps, IProductRowState> {

    constructor(props: any) {
        super(props);
        this.state = { amountError: false, amount: 0 };

        this.handleAmountChange = this.handleAmountChange.bind(this);
        this.handleOrder = this.handleOrder.bind(this);
        this.handleDetails = this.handleDetails.bind(this);
    }

    handleAmountChange(event: any): void {
        this.setState({ amount: event.target.value });
        if (event.target.value < 0) {
            this.setState({ amountError: true });
        }
        else {
            this.setState({ amountError: false });
        }
    }

    handleOrder(): void {
        if (this.state.amount <= 0) {
            this.props.snackbarCallback();
            return;
        }
        const url = "http://localhost:8080/api/orders";
        const requestBody = {
            id: 0,
            totalPrice: 0,
            amount: this.state.amount,
            createdAt: '',
            products: [
                this.props.product
            ]
        };
        fetch(url, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(requestBody)
        }).then((response) => {
           if (response.status === 200) {
               alert('Order placed successfully.');
           }
        },
        (error) => {
            console.log(error);
        });
    }

    handleDetails(): void {
        this.props.showProductDetailCallback(this.props.product.id);
    }

    render() {
        return (
            <TableRow>
                <TableCell className="first-and-last-col">{this.props.product.name}</TableCell>
                <TableCell className="other-cols">
                    <Button variant="outlined" color="primary" size="small" onClick={this.handleDetails}>Show details</Button>
                </TableCell>
                <TableCell className="other-cols">{this.props.product.price} &euro;</TableCell>
                <TableCell className="first-and-last-col">
                    <TextField id="product-amount" size="small" label="Amount" type="number" error={this.state.amountError}
                        className="amount-field" placeholder="0" onChange={this.handleAmountChange} InputLabelProps={{ shrink: true }} />
                    <Button variant="contained" color="primary" size="small" onClick={this.handleOrder}>Order product</Button>
                </TableCell>
            </TableRow>
        );
    }
}