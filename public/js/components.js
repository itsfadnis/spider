var Row = React.createClass({
  render: function(){
    return(
      <tr>
        <td>{this.props.word}</td>
        <td>{this.props.count}</td>
      </tr>
    )
  }
})

var SearchForm = React.createClass({
  handleSubmit: function(e){
    e.preventDefault();
    var text = React.findDOMNode(this.refs.search).value.trim();
    text = text.replace(/[ ]/g, '+');
    if (!text){
      return;
    } else{
      Helper.showSpinner();
      this.props.onSubmit(text); 
    }
    React.findDOMNode(this.refs.search).value = '';
  },
  render: function(){
    return(
      <form onSubmit={this.handleSubmit}>
        <input type="text" onKeyUp={this.handleKeyPress} placeholder="Seach anything.." ref="search" />
        <input type="submit" value="Search" />
      </form>
    );
  }
});

var TagsTable = React.createClass({
  getInitialState: function(){
    return ({
      success: undefined,
      data: [],
      links: [],
      text: undefined
    });
  },
  refreshState: function(success, data, links, text){
    this.setState({
      success: success,
      data: data,
      links: links,
      text: text
    });
  },
  getTags: function(text){
    return $.get('http://localhost:8080/api/'+text);
  },
  onSubmit: function(text){
    this.refreshState(undefined, [], [], text);
    this.getTags(text).done(function(res){
      Helper.hideSpinner();
      if(!res.success){
        this.refreshState(res.success, [], [], text);
      } else {
        this.refreshState(res.success, res.data, res.links, text);
      }
    }.bind(this))
  },
  render: function(){
    var rows = this.state.data.map(function(row){
      return(
        <Row word={row.word} count={row.count}/>
      )
    });
    var tableStyle = {
      width: '20%',
      float: 'left'
    };
    var crawlLinksStyle = {
      width: '80%',
      float: 'right',
      marginTop: '21px'
    };
    return(
      <div>
        <div style={tableStyle}>
          <SearchForm onSubmit={this.onSubmit} />
          { this.state.success === false ? <DeadSpider />: null }
          { this.state.success === true ? <p>Showing tags for '{this.state.text}'</p>: null }
          { this.state.data.length > 0 ? <table><thead><tr><th>Tag</th><th>Count</th></tr></thead><tbody>{rows}</tbody></table>: null }
        </div>
        <div style={crawlLinksStyle}>
          { this.state.links.length > 0 ? <CrawlLinks links={this.state.links} /> : null }
        </div>
      </div>
    )
  }
});

var CrawlLinks = React.createClass({
  getInititalState: function(){
    return ({
      links: []
    });
  },
  render: function(){
    var links = this.props.links.map(function(link){
      return (
        <li><a href={link}>{link}</a></li>
      )
    });
    return(
      <div>
        { this.props.links.length > 0 ? <p> Links crawled:</p> : null }
        <ul>
          {links}
        </ul>
      </div>
    );
  }
});

var DeadSpider = React.createClass({
  render: function(){
    return(
      <p>Spider died. Try again.</p>
    )
  }
})

React.render(<TagsTable />, document.getElementById('content'));
