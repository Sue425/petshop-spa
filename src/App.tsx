import React from 'react';
import './App.css';
import { ProductTable } from './ProductTable';
import { ProductDetails } from './ProductDetails';

interface IAppProps { }

interface IAppState {
  showProductTable: boolean;
  productId: number;
}

export class App extends React.Component<IAppProps, IAppState> {
  
  constructor(props: IAppProps) {
    super(props);
    this.state = { showProductTable: true, productId: 1 };

    this.showProductDetails = this.showProductDetails.bind(this);
    this.showProductList = this.showProductList.bind(this);
  }

  showProductDetails(id: number): void {
    this.setState({productId: id, showProductTable: false});
  }

  showProductList(): void {
    this.setState({showProductTable: true});
  }

  render() {
    const showProductTable = this.state.showProductTable;
    let component;
    if (showProductTable) {
      component = <ProductTable showProductDetailCallback={this.showProductDetails}/>;
    }
    else {
      component = <ProductDetails backToListCallback={this.showProductList} productId={this.state.productId}/>;
    }

    return (
      <div className="App">
        {component}
      </div>
    );
  }
  
 
}
