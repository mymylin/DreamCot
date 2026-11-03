Faça uma atualização completa na interface do site existente, preservando a identidade visual, a estrutura de conteúdo e as funcionalidades que já estão implementadas. O objetivo é melhorar principalmente a navegação, as configurações do usuário, a acessibilidade e o gerenciamento do perfil. Não remova funcionalidades existentes sem necessidade.

1. Modificar o painel principal

Reestruture o painel/dashboard principal para que ele fique mais organizado, intuitivo e responsivo.

* Adicione todas as novas opções descritas neste prompt ao painel.
* Evite deixar todas as opções permanentemente visíveis na tela.
* Utilize um menu lateral retrátil (hambúrguer) para agrupar as principais opções de navegação.
* O menu deve poder ser aberto e fechado pelo usuário.
* Em telas maiores, o menu pode funcionar como uma sidebar recolhível.
* Em celulares, deve funcionar como um menu lateral sobreposto ao conteúdo.
* Ao fechar o menu, o conteúdo principal deve ocupar novamente toda a largura disponível.
* Utilize ícones claros e textos descritivos para cada opção.
* Mantenha uma hierarquia visual consistente entre títulos, subtítulos, botões, cards e menus.

2. Criar uma aba de "Configurações"

Adicione uma seção específica chamada "Configurações" dentro do menu retrátil.

Essa página deve ser organizada em categorias, evitando colocar todas as configurações em uma única lista desorganizada.

2.1 Modo escuro

Adicione uma opção chamada "Modo escuro".

* Deve existir um switch/toggle para ativar e desativar o modo escuro.
* Ao ativar, toda a interface deve mudar de forma consistente para o tema escuro.
* A alteração deve afetar background, cards, menus, textos, bordas, inputs, botões e demais componentes.
* Evite simplesmente inverter as cores; utilize uma paleta escura planejada e que mantenha boa legibilidade.
* A preferência do usuário deve ser persistida para que o modo escolhido continue ativo quando ele retornar ao site.

2.2 Modo de acessibilidade para daltonismo

Adicione uma configuração chamada "Modo de acessibilidade para daltonismo".

* Disponibilize uma opção para ativar/desativar esse modo.
* Adapte as cores utilizadas na interface para melhorar a diferenciação entre elementos para pessoas com diferentes tipos de daltonismo.
* Não utilize somente cores para comunicar estados importantes.
* Sempre que possível, combine cor com ícones, textos, padrões ou outros indicadores visuais.
* Garanta contraste adequado entre texto e fundo.
* A preferência deve ser salva para permanecer ativa entre sessões.

2.3 Tamanho da fonte

Adicione uma configuração chamada "Tamanho da fonte".

O usuário deve conseguir aumentar ou diminuir o tamanho dos textos da interface.

Pode ser implementado com:

* botão A- para diminuir;
* botão A para tamanho padrão;
* botão A+ para aumentar.

Ou através de um controle deslizante, desde que seja intuitivo.

Requisitos:

* A alteração deve ser aplicada de forma consistente em toda a interface.
* Não deve quebrar o layout quando a fonte estiver maior.
* Elementos importantes não podem ficar cortados ou sobrepostos.
* A configuração deve ser persistida.

3. Configurações de perfil

Dentro da página de configurações, crie uma seção chamada "Perfil".

Nessa seção, permita ao usuário visualizar e editar suas informações pessoais.

Deve incluir:

Foto de perfil

* Exibir a foto atual do usuário.
* Permitir alterar a foto.
* Disponibilizar uma ação clara como "Alterar foto".
* Mostrar preview da nova imagem antes da confirmação, se possível.
* Validar formato e tamanho do arquivo enviado.

Nome de usuário

* Exibir o nome de usuário atual.
* Permitir edição.
* Validar o novo nome antes de salvar.
* Informar claramente ao usuário se a alteração foi realizada com sucesso ou se existe algum problema.

Senha

Adicione uma opção para alteração de senha.

Ao clicar nessa opção, abrir um formulário contendo:

* senha atual;
* nova senha;
* confirmação da nova senha;
* botão "Alterar senha".

A senha nunca deve ser exibida em texto aberto.

4. Alteração de e-mail

Adicione também uma opção para alterar o e-mail da conta.

O fluxo deve ser seguro:

* exibir o e-mail atual;
* permitir inserir o novo e-mail;
* solicitar confirmação quando necessário;
* validar o formato do e-mail;
* informar claramente o resultado da alteração.

Caso o sistema possua verificação de e-mail, utilize o fluxo de confirmação existente em vez de criar um mecanismo paralelo.

5. Sair da conta

Dentro das configurações/perfil, adicione uma opção chamada "Sair da conta".

Essa ação deve:

* ser visualmente identificável;
* solicitar confirmação antes de encerrar a sessão, evitando cliques acidentais;
* encerrar corretamente a sessão/autenticação;
* limpar informações temporárias relacionadas à sessão;
* redirecionar o usuário para a página de login após o logout.

Depois de sair, o usuário não deve conseguir acessar páginas protegidas utilizando o botão "voltar" do navegador.

6. Experiência do usuário

Todas as novas funcionalidades devem seguir o mesmo padrão visual do site existente.

Priorize:

* simplicidade;
* acessibilidade;
* responsividade;
* boa hierarquia visual;
* feedback visual após ações;
* mensagens de erro claras;
* estados de carregamento;
* confirmações para ações importantes;
* navegação intuitiva.

Nenhuma alteração deve deixar a interface confusa ou visualmente poluída.

7. Responsividade

Certifique-se de que todas as alterações funcionem corretamente em:

* desktop;
* notebook;
* tablet;
* celular.

O menu retrátil deve ser especialmente bem adaptado para dispositivos móveis.

As configurações devem continuar fáceis de utilizar mesmo com a fonte aumentada e com o modo escuro ou modo de acessibilidade ativado.

8. Persistência das configurações

As preferências do usuário devem ser persistidas corretamente, incluindo:

* modo escuro;
* modo de acessibilidade para daltonismo;
* tamanho da fonte;
* demais preferências de interface.

Ao sair e entrar novamente na conta, essas preferências devem permanecer conforme o comportamento definido pelo sistema.

9. Importante

Não faça apenas alterações visuais. Implemente as funcionalidades de forma funcional e integrada ao sistema existente.

Antes de modificar o código, analise a arquitetura atual do projeto, identifique como autenticação, perfil, configurações e navegação já estão implementados e reutilize os componentes, APIs, estilos e padrões existentes sempre que possível.

Não duplique funcionalidades existentes.

Não altere ou remova dados do usuário sem confirmação.

Ao final, verifique todos os fluxos:

1. Abrir e fechar o menu retrátil.
2. Acessar Configurações.
3. Ativar/desativar modo escuro.
4. Ativar/desativar acessibilidade para daltonismo.
5. Aumentar e diminuir fonte.
6. Alterar foto de perfil.
7. Alterar nome de usuário.
8. Alterar senha.
9. Alterar e-mail.
10. Sair da conta.
11. Ser redirecionado para a página de login.
12. Testar todos os recursos em desktop e mobile.

Resultado esperado: um painel mais organizado, com menu retrátil, uma área de configurações completa, recursos de acessibilidade e gerenciamento de perfil, mantendo a identidade visual e a arquitetura do site existente.