import alt from '../alt';

// Flux
import Actions from '../actions/actions';

// 3rd party libraries
//import store from 'react-native-simple-store';

class AltStore {
  constructor() {
    this.bindListeners({
      handleGetProfile: Actions.GET_PROFILE,
      handleSetProfile: Actions.SET_PROFILE
    });

    this.state = {
      profile: {name: 'Josh', gender: 'Male', pic_source: {uri: 'https://lh3.googleusercontent.com/NDgdC_lMXy6ALHSTFr1gw3ugZ1g7hxetDjiXF7kNbfFzZZ0Fcb4N7lWxYA8LWFVMN88C7LC_=w1920-h1200-no'}}
    };
  }

  handleGetProfile() {
    //this.setState({profile: {name: 'Hayley Greenfield', gender: 'Female'}});

  }
  
  handleSetProfile(prof) {
    this.setState({profile: {name: prof.name, gender: prof.gender, pic_source: prof.pic_source}});

  }
  
  handleUpdateStocks() {
    let symbols = this.state.watchlist.map((item) => item.symbol.toUpperCase());

    let that = this;
    finance.getStock({stock: symbols}, 'quotes')
      .then(function(response) {
        return response.json();
      }).then(function(json) {
        var quotes = json.query.results.quote;
        quotes = Array.isArray(quotes) ? quotes : [quotes];

        var watchlistResult = {};
        quotes.forEach((quote) => {
          watchlistResult[quote.symbol] = quote;
        });
        store.save('watchlistResult', watchlistResult);
        that.setState({watchlistResult: watchlistResult});
      }).catch((error) => {
        console.log('Request failed', error);
        store.get('watchlistResult').then((watchlistResult) => {
          that.setState({watchlistResult: watchlistResult});
        });
      });
  }

  handleAddStock(symbol) {
    console.log('handleAddStock', symbol);
    let watchlist = this.state.watchlist;
    let addedStock = {symbol: symbol.toUpperCase(), share: 100};
    watchlist.push(addedStock);
    this.setState({watchlist: watchlist});
    store.save('watchlist', watchlist);
    this.handleUpdateStocks();

    if (watchlist.length === 1) {
      this.setState({selectedStock: addedStock});
    }
  }

  handleDeleteStock(symbol) {
    console.log('handleDeleteStock', symbol);
    let watchlist = UtilFuncs.removeObjectfromArray(this.state.watchlist, 'symbol', symbol);
    this.setState({watchlist: watchlist});
    store.save('watchlist', watchlist);

    if (watchlist.length === 0) {
      this.setState({selectedStock: {}});
    }
  }

  handleSelectStock(stock) {
    console.log('handleSelectStock', stock);
    this.setState({selectedStock: stock});
  }

  handleSelectProperty(property) {
    console.log('handleSelectProperty', property);
    this.setState({selectedProperty: property});
  }
}

module.exports = alt.createStore(AltStore, 'AltStore');