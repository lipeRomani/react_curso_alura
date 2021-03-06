import React, {Component} from "react";
import InputCustomizado from './componentes/InputCustomizado';
import SubmitCustomizado from './componentes/SubmitCustomizado';
import $ from 'jquery';
import PubSub from 'pubsub-js';
import TratadorError from "./TratadorError";

class FormAutor extends Component {
    
    constructor() {
    super();
        this.state = {nome:"", email:"", senha:""};
        this.enviaForm = this.enviaForm.bind(this);
        this.setNome = this.setNome.bind(this);
        this.setEmail = this.setEmail.bind(this);
        this.setSenha = this.setSenha.bind(this);
    }
    
    render() {
        return (
            <div className="pure-form pure-form-aligned">
                <form className="pure-form pure-form-aligned" onSubmit={this.enviaForm} method="post">
                    <InputCustomizado id="nome" type="text" name="nome" value={this.state.nome} label="Nome" onChange={this.setNome} />
                    <InputCustomizado id="email" type="email" name="email" value={this.state.email} label="E-mail" onChange={this.setEmail} />
                    <InputCustomizado id="senha" type="password" value={this.state.senha} name="senha" label="Senha" onChange={this.setSenha} />
                    <SubmitCustomizado label="Gravar" />
                </form>
            </div>
        );
    }

    enviaForm(event) {
        event.preventDefault();
    
        $.ajax({
            url:"http://localhost:8080/api/autores",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({nome: this.state.nome, email: this.state.email, senha:this.state.senha}),
            success: (resp) => {
                this.setState({nome:"", email:"", senha:"" });
                PubSub.publish('author-list-update', resp);
            },
            error: (resp) => {
                if (resp.status === 400) {
                    let err = JSON.parse(resp.responseText);
                    new TratadorError().errorPublish(err.errors);
                }
            },
            beforeSend: () => {
                PubSub.publish("limpa-error", {});
            }
        })
    }

    setNome(event){
        this.setState({nome:event.target.value});
    }

    setEmail(event){
        this.setState({email:event.target.value});
    }

    setSenha(event){
        this.setState({senha:event.target.value});
    }
}

class TableAutor extends Component {

    render() {
        return (
            <div>            
                <table className="pure-table">
                  <thead>
                    <tr>
                      <th>Nome</th>
                      <th>email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      this.props.lista.map((autor) => {
                        return(
                            <tr key={autor.id}>
                              <td>{autor.nome}</td>
                              <td>{autor.email}</td>
                            </tr>
                        );
                      })
                    }
                  </tbody>
                </table> 
              </div>
        );
    }
}

export default class AutorBox extends Component {
    
    constructor() {
        super();
        this.state = {lista : []};
    }

    componentDidMount() {
        $.ajax({
            url: "http://localhost:8080/api/autores",
            method: "get",
            success: (resp) => {
                this.setState({lista:resp});
            }
        });

        PubSub.subscribe('author-list-update', (topic, message) => {
            this.setState({lista: message});
        });
    }

    render() {
        return (
            <div>
                <div className="header">
                <h1>Cadastro de autor</h1>
                </div>
                <div className="content" id="content">
                    <FormAutor />
                    <TableAutor lista={this.state.lista}/>
                </div>
            </div>
        );
    }

}