import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: null,
      loading: true, 
      error: "",
      postID:"",
      user:0
    }

  }

  componentDidMount () {
    fetch("https://jsonplaceholder.typicode.com/posts")
      .then((response) => {
        let dataPromise = response.json();  
        return dataPromise;
      })
      .then((data) => {
        this.setState({data: data, loading: false});
      })
      .catch((error) => {
        this.setState({error: error.message, loading: false});
      })
  }

  filterByUser = (user) => {
    this.setState({user:user});
  }

  filterByPost = (id) => {
    this.setState({postID:id, error:""});
    if (!(id >= 1 && id <= this.state.data.length) && id != "") {
      this.setState({error:"Invalid Post ID"});
    }
  }

  findUsers = () => {
    let users = [];
    this.state.data.forEach((info) => {
      if (!users.includes(info.userId)) {
        users.push(info.userId);
      }
    });
    return users;
  }

  render() {

    if (this.state.loading) {
      return (
        <p>Loading Content</p>
      );
    } else {

      let users = this.findUsers();

      let data = this.state.data;
      if (this.state.user != 0) {
          data = data.filter((info) => {
            return info.userId == this.state.user;
          });
      }

      if (this.state.postID != 0) {
        data = data.filter((info) => {
          return info.id == this.state.postID;
        });
      }

      let content = (<Cards data={data} />);
      if (data.length == 0 || this.state.error != "") {
        let text = "No posts with the specified filteration";
        if (this.state.error != "") {
          text = this.state.error;
        } 
        content = <p className="text-center m-5">{text}</p>;
      }

      return (
        <div>
          <Header />
          <div className="container">
            <PostFilter dataLength={this.state.data.length} 
              value={this.state.postID} 
              filterByPost={this.filterByPost}
              data={this.state.data} />
            <UserFilter userList={users} filterByUser={this.filterByUser} />
            {content}
          </div>
        </div>
      );

    }
  }
}

export default App;

class Cards extends Component {

  render() {

    let cards = this.props.data.map((info) => {
      return (
        <Card key={info.id} id={info.id} title={info.title} user={info.userId} />
      );
    });

    return (
      <div className="d-flex flex-wrap">
        {cards}
      </div>
    );

  }

}

class Card extends Component {

  render() {
    return (
      <div className="card m-3 flex-grow-1">
        <div className="card-header bg-dark text-light">
          Post #{this.props.id}
        </div>
        <div className="card-body">
          <p className="m-4">{this.props.title}</p>
          <hr />
          <p className="text-right m-0">Made by user: {this.props.user}</p>
        </div>
      </div>
    );
  }

}

class Header extends Component {

  render() {
    return(
      <div className="jumbotron jumbotron-fluid bg-dark">
        <h1 className="p-3 text-light text-center">iGem Application</h1>
      </div>
    );
  }

}

class UserFilter extends Component {

  render() {

    let userList = this.props.userList.map((user) => {
      return (
        <option key={user} value={user}>{user}</option>
      );
    });

    return (
      <div className="input-group m-2">
        <div className="input-group-prepend">
          <label className="input-group-text bg-dark text-light">User</label>
        </div>
        <select className="custom-select" value={this.props.user} onChange={(event) => this.props.filterByUser(event.target.value)}>
          <option value="0">See All</option>
          {userList}
        </select>
      </div>
    );

  } 

}

class PostFilter extends Component {

  render() {

    let style = " border-danger text-danger";
    if ((this.props.value >= 1 && this.props.value <= this.props.data.length) || this.props.value == "") {
      style = "";
    }

    return (
      <div className="input-group m-2">
        <div className="input-group-prepend">
          <span className={"input-group-text bg-dark text-light" + style}>Post ID</span>
        </div>
        <input type="text" className={"form-control" + style} placeholder={"Please type a # from 1 to " + this.props.dataLength} 
        value={this.props.value} onChange={(event) => this.props.filterByPost(event.target.value)}
        aria-label="post id input" aria-describedby="filter posts by specifying an id number" />
      </div>
    );

  }

}
