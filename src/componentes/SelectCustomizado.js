import React, {Component} from 'react';
import PubSub from 'pubsub-js';

export default class SelectCustomizado extends Component 
{

    constructor()
    {
        super();
        this.state = {msgError:""}
    }

    componentDidMount()
    {
        PubSub.subscribe('form-error', (topic, msg) => {
            if(msg.field === this.props.name) {
                this.setState({msgError: msg.defaultMessage});
            }
        });

        PubSub.subscribe("limpa-error", (topic, msg) => {
            this.setState({msgError:""});
        })
    }

    componentWillUnmount () {
        this.setState({"msgError" : ""});
    }

    render()
    {
        return (
            <div className="pure-control-group">
                <label htmlFor={this.props.id}>{this.props.label}</label>
                <select name={this.props.name} id={this.props.id} value={this.props.value} onChange={this.props.onChange}>
                    <option value="">{this.props.emptyText}</option>
                    {
                        this.props.lista.map((obj) => {
                            return (
                                <option key={obj[this.props.valueField]} value={obj[this.props.valueField]}>{obj[this.props.labelField]}</option>        
                            );
                        })
                    }
                </select>
                <span className="error"> {this.state.msgError}</span>                  
            </div>
        );
    }
}