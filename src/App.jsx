import { useState } from 'react'
import './style/global.css'
import './style/App.css'

import logo_img from "./assets/logo.png"

import Header from "./components/Header"
import Funcionalidade from "./components/Funcionalidade"

import coiso1 from "./assets/coiso1.jpg"
import coiso2 from "./assets/coiso2.jpg"
import coiso3 from "./assets/coiso3.jpg"
import coiso4 from "./assets/coiso4.jpg"

function App() {

  const funcs = [
    { nome: "Inventário Digital", texto: "Catalogue cada peça do seu guarda-roupa com fotos, categorias, tecidos, cores e estampas.", img: coiso1 },
    { nome: "Criador de Look", texto: "Crie e salve looks completos combinando suas peças para diferentes ocasiões.", img: coiso2 },
    { nome: "Combinador de Tendências", texto: "Veja quais tendências já combinam com seu guarda-roupa sem comprar novos itens.", img: coiso3 },
    { nome: "Compra Consciente", texto: "Receba insights inteligentes sobre lacunas e excessos no seu guarda-roupa.", img: coiso4 }
  ]

  return (
    <>
      <Header />

      <section id="intro">
        <div className="caixa">
          <img src={logo_img} />
          <h2>DREAMCLOSET</h2>
          <p>Guarda-Roupa Digital Inteligente e Sustentável</p>
          <small>Versão 1.0.0</small>
        </div>
      </section>

      <section id="missao">
        <div className="caixa">
          <h3>🩷 Nossa Missão</h3>
          <p>O DREAMCLOSET te ajuda a fazer escolhas de moda mais conscientes, aproveitando ao máximo o seu guarda-roupa existente. Acreditamos que o look mais sustentável é aquele que você já possui.</p>
        </div>
      </section>

      <section id="funcionalidades">
        <div className="caixa">
          <h3>Funcionalidades Principais</h3>

          <div id="lista-funcionalidades">
            {funcs.map((f, i) => (
              <Funcionalidade key={i} nome={f.nome} texto={f.texto} src={f.img} />
            ))}
          </div>
        </div>
      </section>

      <section id="como-usar">
        <div className="caixa">
          <h3>Como Usar o DREAMCLOSET?</h3>

          <ol>
            <li>
              <span class="uso-nome">1. Catalogue seu Guarda-Roupa</span>
              <span class="uso-texto">Comece adicionando suas peças com fotos, categorias, tecidos, cores e estampas.</span>
            </li>
            <li>
              <span class="uso-nome">2. Crie Looks</span>
              <span class="uso-texto">Use o Criador de Look para arrastar e soltar peças em combinações de outfit.</span>
            </li>
            <li>
              <span class="uso-nome">3. Marque Favoritos</span>
              <span class="uso-texto">Marque peças e looks favoritos para construir seu perfil de estilo pessoal.</span>
            </li>
            <li>
              <span class="uso-nome">4. Compre Conscientemente</span>
              <span class="uso-texto">Consulte o Assistente de Compra Consciente antes de adquirir novos itens.</span>
            </li>
          </ol>
        </div>
      </section>

      <section id="privacidade">
        <div className="caixa">
          <h3>Privacidade e dados</h3>

          <ul>
            <li>✓ Todos os seus dados são armazenados localmente no seu dispositivo</li>
            <li>✓ Sem sincronização na nuvem ou armazenamento online</li>
            <li>✓ Sem redes sociais ou compartilhamento</li>
            <li>✓ Suas informações de guarda-roupa ficam completamente privadas</li>
          </ul>
        </div>
      </section>

      <section id="ambiental">
        <div className="caixa">
          <h3>💚 Impacto Ambiental</h3>

          <p>A indústria da moda é uma das maiores poluidoras do mundo. Ao usar o DREAMCLOSET para aproveitar ao máximo seu guarda-roupa existente, você está:</p>
          <ul>
            <li>Reduzindo o descarte de têxteis em aterros sanitários</li>
            <li>Diminuindo o consumo de água na produção de novas roupas</li>
            <li>Reduzindo as emissões de carbono da fabricação e transporte</li>
            <li>Apoiando uma economia de moda mais sustentável</li>
          </ul>
        </div>
      </section>

      <button onClick={() => alert('Infelizmente não sabemos como mudar links')}>Começar</button>
      <small id="carinho">Feito com carinho para amantes da moda consciente</small>
    </>
  )
}

export default App
