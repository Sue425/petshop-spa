import React from 'react';
import { DetailedProduct, AnimalCategory } from './Product';
import { Card, CardHeader, CardContent, Button, TextField, Snackbar, SnackbarContent } from '@material-ui/core';
import './ProductDetails.css';

interface IProductDetailsProps {
    backToListCallback: any;
    productId: number;
}

interface IProductDetailsState {
    amount: number;
    amountError: boolean;
    product: DetailedProduct;
    snackbarOpen: boolean;
}

export class ProductDetails extends React.Component<IProductDetailsProps, IProductDetailsState> {

    constructor(props: IProductDetailsProps) {
        super(props);
        this.state = {
            amount: 0,
            amountError: false,
            product: {
                id: 1,
                name: '',
                description: '',
                price: 1,
                animalCategories: [{id: 1, name: ''}]
            },
            snackbarOpen: false
        };

        this.handleOrder = this.handleOrder.bind(this);
        this.handleAmountChange = this.handleAmountChange.bind(this);
        this.handleBack = this.handleBack.bind(this);
        this.handleSnackbarClose = this.handleSnackbarClose.bind(this);
    }

    componentDidMount(): void {
        const url = "http://localhost:8080/api/products/" + this.props.productId;
        fetch(url).then((response) => {
            response.json().then((data) => {
                this.setState({product: data})
            })
        },
        (error) => {
            console.log(error);
        });
    }

    handleOrder(): void {
        if (this.state.amount <= 0) {
            this.setState({snackbarOpen: true});
            return;
        }
        const url = "http://localhost:8080/api/orders";
        const requestBody = {
            id: 0,
            totalPrice: 0,
            amount: this.state.amount,
            createdAt: '',
            products: [
                this.state.product
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

    handleAmountChange(event: any): void {
        this.setState({ amount: event.target.value });
        if (event.target.value < 0) {
            this.setState({ amountError: true });
        }
        else {
            this.setState({ amountError: false });
        }
    }

    handleSnackbarClose(): void {
        this.setState({snackbarOpen: false});
    }

    handleBack(): void {
        this.props.backToListCallback();
    }

    render() {
        return (
            <div className="details-container">
                <Card>
                    <CardHeader title={this.state.product.name}>
                    </CardHeader>
                    <CardContent>
                        <div>
                            <div className="product-info-container">
                                <strong>for animals:</strong>
                                <ul>
                                    {this.state.product.animalCategories.map((category: AnimalCategory) => (
                                        <li key={category.id}>{category.name}</li>
                                    ))}
                                </ul>
                            </div>
                            <div className="order-product-container">
                                <p className="price-text"><strong>Unit price: {this.state.product.price} &euro;</strong></p>
                                <TextField size="small" label="Amount" type="number" error={this.state.amountError}
                                    className="amount-field" placeholder="0" onChange={this.handleAmountChange} InputLabelProps={{ shrink: true }} />
                                <Button size="small" color="primary" variant="contained" onClick={this.handleOrder}>Order Product</Button>
                            </div>
                        </div>
                        <p className="product-description">{this.state.product.description}</p>
                    </CardContent>
                </Card>
                <div className="back-button-container">
                    <Button size="small" variant="outlined" color="primary" onClick={this.handleBack}>Back to product list</Button>
                </div>
                <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'right' }} open={this.state.snackbarOpen} autoHideDuration={4000}
                    onClose={this.handleSnackbarClose}>
                    <SnackbarContent message="You cannot order zero or negative amount of a product"></SnackbarContent>
                </Snackbar>
            </div>
        );
    }
}