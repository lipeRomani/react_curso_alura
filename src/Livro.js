import React, {Component} from 'react';
import $ from 'jquery';
import InputCustomizado from './componentes/InputCustomizado';
import SubmitCustomizado from './componentes/SubmitCustomizado';
import SelectCustomizado from './componentes/SelectCustomizado';


class FormLivro extends Component {
    
    constructor() {
        super();
        this.state = {titulo:"", preco:0.0, autorId:"", listaAutor : []};
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();
        const livro = {
            titulo : this.state.titulo,
            preco  : parseFloat(this.state.preco),
            autorId: this.state.autorId 
        }
        console.log(livro);
        $.ajax({
            method : "post",
            url:"http://localhost:8080/api/livros",
            contentType: "application/json",
            data : JSON.stringify(livro),
            success: (resp) => {
                this.props.handleRefresh(resp);
            }, 
            error: (resp) => {
                console.log(resp)
            }
        });
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        
        this.setState({
            [name] : value
        })
    }

    componentDidMount() 
    {
        $.ajax({
            method: "get",
            url: "http://localhost:8080/api/autores",
            success: (resp) => {
                this.setState({listaAutor:resp})
            },
            error: (resp) => {
                console.log(resp);
            }
        })
    }
    
    render() {
        return (
            <div className="pure-form pure-form-aligned">
                <form className="pure-form pure-form-aligned" onSubmit={this.handleSubmit} method="post">
                    <InputCustomizado id="titulo" type="text" name="titulo" value={this.state.titulo} label="Titulo" onChange={this.handleInputChange} />
                    <InputCustomizado id="preco" type="number" name="preco" value={this.state.preco} label="Preço" onChange={this.handleInputChange} />
                    <SelectCustomizado 
                        id="autorId" 
                        name="autorId"
                        value={this.state.autor}
                        label="Autor"
                        onChange={this.handleInputChange}
                        emptyText="Selecione um autor"
                        lista={this.state.listaAutor}
                        valueField="id"
                        labelField="nome"
                    />
                    <SubmitCustomizado label="Gravar" />
                </form>
            </div>
        );
    }
}


class TabelaLivro extends Component {
    render() {
        return (
            <table className="pure-table">
                <thead>
                    <tr>
                        <th>Titulo</th>
                        <th>Preço</th>
                        <th>Autor</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        this.props.lista.map(livro => {
                            return (
                                <tr key={livro.id}>
                                    <td>{livro.titulo}</td>
                                    <td>{livro.preco}</td>
                                    <td>{livro.autor.nome}</td>
                                </tr>
                            );
                        })
                    }
                </tbody>
            </table>
        );
    }
}

export default class LivroBox extends Component {
    constructor() {
        super();
        this.state = {lista:[]}
        this.handleRefresh = this.handleRefresh.bind(this);
    }

    componentDidMount() {
        $.ajax({
            method: 'get',
            url: "http://localhost:8080/api/livros",
            success: (resp) => {
                this.setState({lista: resp});
            },
            error: (resp) => {
                console.log(resp);
            }
        });
    }

    handleRefresh(novaLista) {
        this.setState({lista : novaLista});
    }
    
    render() {
        return (
            <div>
                <div className="header">
                    <h1>Cadastro de Livro</h1>
                </div>
                <div className="content" id="content">
                    <FormLivro handleRefresh={this.handleRefresh}/>
                    <hr />
                    <TabelaLivro lista={this.state.lista} />
                </div>
            </div>
        );
    }
} 