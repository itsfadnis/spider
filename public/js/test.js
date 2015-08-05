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
      $('th').hide();
      $('tbody').hide();
      $('#spinner').removeClass('hidden');
      this.props.onSubmit(text); 
    }
    React.findDOMNode(this.refs.search).value = '';
  },
  render: function(){
    return(
      <form onSubmit={this.handleSubmit}>
        <input type="text" placeholder="Seach anything.." ref="search" />
        <input type="submit" value="Search" />
      </form>
    );
  }
});

var TagsTable = React.createClass({
  getInitialState: function(){
    return ({
      data: []
    });
  },
  getTags: function(text){
    return $.get('http://localhost:8080/api/'+text);
  },
  onSubmit: function(text){
    this.getTags(text).done(function(res){
      $('th').show();
      $('tbody').show();
      $('#spinner').addClass('hidden');
      this.setState({data: res});
    }.bind(this))
  },
  render: function(){
    var rows = this.state.data.map(function(row){
      return(
        <Row word={row.word} count={row.count}/>
      )
    });
    return(
      <div>
        <SearchForm onSubmit={this.onSubmit} />
        <table>
          <thead>
            <tr>
              <th>Tag</th>
              <th>Count</th>
            </tr>
          </thead>
          <tbody>
            {rows}
          </tbody>
        </table>
      </div>
    )
  }
});

React.render(<TagsTable />, document.getElementById('content'));
$('th').hide();
