import React, { Component } from "react";
import { Form, Button, Message, Input, Container } from "semantic-ui-react";
import Bill from "../../../etherium/bill";
import web3 from "../../../etherium/web3";
import { Link, Router } from "../../../routes";
import Layout from "../../../components/Layouts/Layouts";
export default class NewPlan extends Component {
  state = {
    value: "",
    description: "",
    recipient: "",
    loading: false,
    errorMessage: ""
  };

  static async getInitialProps (props) {
    const { address } = props.query;
    return { address };
  }

  onSubmit = async event => {
    event.preventDefault();
    const bill = Bill(this.props.address);
    const { description, value, recipient } = this.state;
    this.setState({ loading: true, errorMessage: "" });
    try {
      const accounts = await web3.eth.getAccounts();
      await bill.methods
        .createPlan(description, web3.utils.toWei(value, "ether"), recipient)
        .send({
          from: accounts[0]
        });
      Router.pushRoute(`/bills/${this.props.address}/plans`);
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }
    this.setState({ loading: false });
  };

  render () {
    return (
      <Layout title='Bills | Plans'>
        <section style={{ paddingTop: 100 }} className='section-rt'>
          <div className='container card-rt rt-border'>
            <div className="new-plan-back">
              <Link route={`/bills/${this.props.address}/plans`}>
                <div style={{ cursor: 'pointer' }} >
                  <span><img src="/static/img/chevron.svg" style={{ height: '32px' }} /></span>
                  <span>Back</span>
                </div>
              </Link>
            </div>
            <div className='row py-3'>
              <div className='col-md-7 pb-5' style={{ paddingLeft: '2rem', }}>
                <div className='rt-title'>
                  <div className='rt-title-text mb-5'>New Plan</div>
                </div>
                <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                  <Form.Field>
                    <label>Description</label>
                    <Input
                      value={this.state.description}
                      onChange={event =>
                        this.setState({ description: event.target.value })
                      }
                    />
                  </Form.Field>
                  <Form.Field>
                    <label>Value in Ether</label>
                    <Input
                      label='Ether'
                      labelPosition='right'
                      value={this.state.value}
                      onChange={event =>
                        this.setState({ value: event.target.value })
                      }
                    />
                  </Form.Field>
                  <Form.Field>
                    <label>Receiving company's address</label>
                    <Input
                      value={this.state.recipient}
                      onChange={event =>
                        this.setState({ recipient: event.target.value })
                      }
                    />
                  </Form.Field>

                  <Message
                    error
                    header='Error'
                    content={this.state.errorMessage}
                  />
                  <Button className="btn-rt primary semantic" loading={this.state.loading}>
                    Create new plan
                </Button>
                </Form>
              </div>
              <div className="col-md-5">
                <div className="d-flex justify-content-center">
                  <img className="img-fluid" src="/static/img/bill.png" style={{ height: '350px', }} />
                </div>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    );
  }
}
