import React from 'react';
import { handleResponse } from '../../helpers';
import { API_URL } from '../../config';
import Loading from '../common/Loading';
import Table from './Table';
import Pagination from './Pagination';
import './Table.css';

class List extends React.Component{
    constructor(){
        super();

        this.state = {
            loading: false,
            currencies: [],
            error: null,
            totalPages: 0,
            page: 1,
        }
        this.handlePaginationClick=this.handlePaginationClick.bind(this);
    }

    componentDidMount(){
       
        this.fetchCurrencies();
    }

    fetchCurrencies (){

        this.setState({ loading:true })

        const { page } = this.state;

        fetch(`${API_URL}/cryptocurrencies?page=${page}&perPage=20`)
            .then(handleResponse)
            .then((data) => {

            //console.log(data); it was used to check the total pages//
           
            const { currencies, totalPages} = data;
            
            this.setState({ 
                 /*
                currencies: currencies/.data/, 
                totalPages: totalPages/.data/, in ES6 it is shortened like below.
                */
                currencies,
                totalPages,  
                loading:false
                })
            })
            .catch((error) => {
              this.setState({ 
                  error: error.errorMessage, 
                  loading:false})
            });
    }

 

    handlePaginationClick(direction){
        let nextPage = this.state.page;

        /* 
           if(direction == next){
            nextPage++;    
        }else{
            nextPage--; it is the same as below.
        }
        */ 
        nextPage = direction === 'next' ? nextPage + 1 : nextPage -1 ; 
        
        this.setState({page : nextPage }, () => {
            /*console.log(this.state.page); to check the page number. */
            this.fetchCurrencies();
            
        })
        
        
    }

    render(){

        const { loading, currencies, error, page, totalPages} = this.state;

        // render only loading component, if loading state şs set to true
        if(loading){
            return<div className="loading-container"><Loading/></div>
        }

        // render only error message, if error ocuured while fetching data
        if(error){
            return <div className="error">{error}</div>
        }

        return (
            <div>
                <Table 
                    currencies={currencies}
                />
                <Pagination
                    page={page}
                    totalPages={totalPages}
                    handlePaginationClick={this.handlePaginationClick}
                />
            </div>
        );

    
    }
}

export default List;