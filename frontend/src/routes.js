import React from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'
import {HomePage} from './pages/HomePage'
import {ProductsPostingPage} from './pages/products/PostingPage'
import {ProductsShipmentPage} from './pages/products/ShipmentPage'
import {ProductsFundsPage} from './pages/products/FundsPage'
import {ProductsOperationPage} from './pages/products/OperationsPage'
import {CatalogProductsPage} from './pages/catalogs/CatalogProductsPage'
import {CatalogCategoriesPage} from './pages/catalogs/CatalogCategoriesPage'
import {CatalogMeasuresPage} from './pages/catalogs/CatalogMeasuresPage'
import {CatalogContractorsPage} from './pages/catalogs/CatalogContractorsPage'

export const useRoutes = isAuthenticated => {
    if (isAuthenticated){
        return (
            <Switch>
				<Route path="/catalogs" exact> <Redirect to="/catalogs/products"/> </Route>
				<Route path="/catalogs/products" exact> <CatalogProductsPage /> </Route>
				<Route path="/catalogs/categories" exact> <CatalogCategoriesPage /> </Route>				
				<Route path="/catalogs/measures" exact> <CatalogMeasuresPage /> </Route>
				<Route path="/catalogs/contractors" exact> <CatalogContractorsPage /> </Route>
                <Route path="/products/posting" exact> <ProductsPostingPage /> </Route>
				<Route path="/products/shipment" exact> <ProductsShipmentPage /> </Route>
				<Route path="/products/operations" exact> <ProductsOperationPage /> </Route>
				<Route path="/products/funds" exact> <ProductsFundsPage /> </Route>
                <Redirect to="/products/posting" />
            </Switch>
        )
    }
    return (
        <Switch>
            <Route path="/" exact>
                <HomePage />
            </Route>
            <Redirect to="/" />
        </Switch>
    )
}
