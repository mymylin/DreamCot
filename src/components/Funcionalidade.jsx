function Funcionalidade({nome,texto,src}){
    return(
        <div className="funcionalidade">
            <img src={src}/>
            <h4>{nome}</h4>
            <p>{texto}</p>
        </div>
    )
}

export default Funcionalidade