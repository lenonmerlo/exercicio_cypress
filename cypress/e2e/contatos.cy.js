describe('Agenda de Contatos - Testes Funcionais', () => {
    const contato = {
        nome: 'João Silva',
        telefone: '123456789',
        email: 'joao.silva@example.com'
    };

    const contatoAtualizado = {
        nome: 'João Silva Atualizado',
        telefone: '987654321',
        email: 'joao.silva@update.com'
    };

    beforeEach(() => {
        cy.intercept('GET', '**/api/contatos').as('getContatos');
        cy.visit('https://agenda-contatos-react.vercel.app/');
        cy.wait('@getContatos');
    });

    it('Deve adicionar um novo contato', () => {
        cy.get('input[placeholder="Nome"]').type(contato.nome);
        cy.get('input[placeholder="Telefone"]').type(contato.telefone);
        cy.get('input[placeholder="E-mail"]').type(contato.email);
        cy.get('button.adicionar').click();

        // Verifica se o novo contato foi adicionado corretamente
        cy.contains(contato.nome).should('exist');
        cy.contains(contato.telefone).should('exist');
        cy.contains(contato.email).should('exist');
    });

    it('Deve editar um contato existente', () => {
        // Certifica-se de que o contato original existe antes de editar
        cy.contains(contato.nome)
          .should('exist') // Verifica se o contato existe
          .parent() // Vai para o contêiner pai do elemento
          .find('button.edit') // Encontra o botão de editar dentro do contêiner
          .click(); // Clica no botão de editar

        // Atualiza os campos do contato
        cy.get('input[placeholder="Nome"]').clear().type(contatoAtualizado.nome);
        cy.get('input[placeholder="Telefone"]').clear().type(contatoAtualizado.telefone);
        cy.get('input[placeholder="E-mail"]').clear().type(contatoAtualizado.email);
        cy.get('button.adicionar').click(); // Confirma a edição

        // Verifica se os dados foram atualizados
        cy.contains(contatoAtualizado.nome).should('exist');
        cy.contains(contatoAtualizado.telefone).should('exist');
        cy.contains(contatoAtualizado.email).should('exist');
    });

    it('Deve remover um contato', () => {
        // Certifica-se de que o contato atualizado existe antes de remover
        cy.contains(contatoAtualizado.nome)
          .should('exist') // Verifica se o contato atualizado existe
          .parent() // Vai para o contêiner pai do contato
          .find('button.delete') // Encontra o botão de deletar dentro do contêiner
          .click(); // Clica no botão de deletar

        // Confirmar a remoção se necessário
        cy.on('window:confirm', () => true); // Aceita a confirmação de deleção

        // Verifica se o contato foi removido
        cy.contains(contatoAtualizado.nome).should('not.exist');
    });
});
