document.addEventListener("DOMContentLoaded", () => {
    let perfilSelecionado = "paciente"; 

    // Elementos da Interface (DOM)
    const authContainer = document.getElementById('authContainer');
    const btnFecharAuth = document.getElementById('btnFecharAuth');
    const btnEntrarNav = document.getElementById('btnEntrarNav');
    const userBadge = document.getElementById('userBadge');
    const btnSair = document.getElementById('btnSair');
    const lblNomeUsuario = document.getElementById('lblNomeUsuario');
    const linkVacinas = document.getElementById('linkVacinas');
    const btnNotificacoes = document.getElementById('btnNotificacoes');
    const numNotificacoes = document.getElementById('numNotificacoes');

    const btnPerfilPaciente = document.getElementById('btnPerfilPaciente');
    const btnPerfilMedico = document.getElementById('btnPerfilMedico');
    const boxLogin = document.getElementById('boxLogin');
    const boxCadastro = document.getElementById('boxCadastro');
    const linkIrParaCadastro = document.getElementById('linkIrParaCadastro');
    const linkIrParaLogin = document.getElementById('linkIrParaLogin');
    const formLogin = document.getElementById('formLogin');
    const formCadastro = document.getElementById('formCadastro');

    // Inicialização do Banco de Dados Simulado (LocalStorage)
    function inicializarBanco() {
        if (!localStorage.getItem('banco_usuarios')) {
            localStorage.setItem('banco_usuarios', JSON.stringify([
                { id: "u1", nome: "Paciente Teste", email: "paciente@teste.com", telefone: "11999999999", senha: "123" }
            ]));
        }
        if (!localStorage.getItem('banco_medicos')) {
            localStorage.setItem('banco_medicos', JSON.stringify([
                { id: "m1", nome: "Dr. Carlos Eduardo", crm: "123456-SP", especialidade: "Cardiopediatria", email: "medico@teste.com", senha: "123" },
                { id: "m2", nome: "Dra. Mariana Costa", crm: "78910-SP", especialidade: "Nutrição Infantil", email: "mariana@teste.com", senha: "123" }
            ]));
        }
        if (!localStorage.getItem('banco_agendamentos')) {
            localStorage.setItem('banco_agendamentos', JSON.stringify([]));
        }
        if (!localStorage.getItem('banco_notificacoes')) {
            localStorage.setItem('banco_notificacoes', JSON.stringify([]));
        }
    }
    inicializarBanco();

    // Controle de Abertura/Fechamento do Modal de Autenticação
    if(btnEntrarNav) btnEntrarNav.addEventListener('click', () => authContainer.classList.remove('hidden'));
    if(btnFecharAuth) btnFecharAuth.addEventListener('click', () => authContainer.classList.add('hidden'));

    // Alternância de Abas dentro do Modal: Perfil Paciente
    if(btnPerfilPaciente) {
        btnPerfilPaciente.addEventListener('click', () => {
            perfilSelecionado = "paciente";
            btnPerfilPaciente.classList.add('active');
            btnPerfilMedico.classList.remove('active');
            document.getElementById('lblPerfilLogin').textContent = "Paciente";
            document.getElementById('lblPerfilCadastro').textContent = "Paciente";
            document.getElementById('wrapperCampoDinamico').innerHTML = `<input type="tel" id="cadTelefone" placeholder="WhatsApp / Telefone com DDD" required>`;
        });
    }

    // Alternância de Abas dentro do Modal: Perfil Médico
    if(btnPerfilMedico) {
        btnPerfilMedico.addEventListener('click', () => {
            perfilSelecionado = "medico";
            btnPerfilMedico.classList.add('active');
            btnPerfilPaciente.classList.remove('active');
            document.getElementById('lblPerfilLogin').textContent = "Médico";
            document.getElementById('lblPerfilCadastro').textContent = "Médico";
            document.getElementById('wrapperCampoDinamico').innerHTML = `
                <input type="text" id="cadCRM" placeholder="CRM (Ex: 123456-SP)" required>
                <select id="cadEspecialidade" style="width:100%; padding:12px; border-radius:25px; border:1px solid #E1D5F2; margin-top:5px;" required>
                    <option value="Cardiopediatria">Cardiopediatria</option>
                    <option value="Nutrição Infantil">Nutrição Infantil</option>
                    <option value="Neuropediatria">Neuropediatria</option>
                    <option value="Ortopedia Infantil">Ortopedia Infantil</option>
                    <option value="Pneumopediatria">Pneumopediatria</option>
                </select>`;
        });
    }

    // Troca entre Telas internas: Login para Cadastro e vice-versa
    linkIrParaCadastro.addEventListener('click', (e) => { e.preventDefault(); boxLogin.classList.add('hidden'); boxCadastro.classList.remove('hidden'); });
    linkIrParaLogin.addEventListener('click', (e) => { e.preventDefault(); boxCadastro.classList.add('hidden'); boxLogin.classList.remove('hidden'); });

    // Processamento do Formulário de LOGIN
    formLogin.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value.trim().toLowerCase();
        const senha = document.getElementById('loginSenha').value;

        const chaveBanco = perfilSelecionado === 'paciente' ? 'banco_usuarios' : 'banco_medicos';
        let db = JSON.parse(localStorage.getItem(chaveBanco)) || [];
        let user = db.find(u => u.email.toLowerCase() === email && u.senha === senha);

        if(user) {
            // Salva os dados na sessão temporária do navegador
            sessionStorage.setItem('sessao_ativa', JSON.stringify({ 
                id: user.id || user.email, 
                nome: user.nome, 
                perfil: perfilSelecionado 
            }));
            
            authContainer.classList.add('hidden');
            
            Swal.fire({ icon: 'success', title: `Bem-vindo, ${user.nome}!`, showConfirmButton: false, timer: 1500 })
                .then(() => {
                    // REDIRECIONAMENTO INTELIGENTE CONFORME PERFIL
                    if(perfilSelecionado === "medico") {
                        window.location.href = "painel-medico.html"; // Vai para a área clínica
                    } else {
                        window.location.reload(); // Paciente atualiza a home logado
                    }
                });
        } else {
            Swal.fire({ icon: 'error', title: 'Erro de Acesso', text: 'E-mail ou senha incorretos!' });
        }
    });

    // Processamento do Formulário de CADASTRO
    formCadastro.addEventListener('submit', (e) => {
        e.preventDefault();
        const nome = document.getElementById('cadNome').value.trim();
        const email = document.getElementById('cadEmail').value.trim();
        const senha = document.getElementById('cadSenha').value;
        const chaveDb = perfilSelecionado === 'paciente' ? 'banco_usuarios' : 'banco_medicos';
        let db = JSON.parse(localStorage.getItem(chaveDb)) || [];

        if(db.some(x => x.email.toLowerCase() === email.toLowerCase())) {
            Swal.fire({ icon: 'warning', title: 'Atenção', text: 'Este e-mail já está cadastrado no sistema.' });
            return;
        }

        let novoUser = { 
            id: 'id_' + Date.now(), 
            nome: perfilSelecionado === 'medico' ? 'Dr(a). ' + nome : nome, 
            email, 
            senha 
        };

        // Captura os dados extras dependendo do tipo de conta
        if(perfilSelecionado === 'paciente') {
            novoUser.telefone = document.getElementById('cadTelefone').value;
        } else {
            novoUser.crm = document.getElementById('cadCRM').value;
            novoUser.especialidade = document.getElementById('cadEspecialidade').value;
        }

        db.push(novoUser);
        localStorage.setItem(chaveDb, JSON.stringify(db));
        
        Swal.fire({ icon: 'success', title: 'Conta criada!', text: 'Faça o login para validar seu acesso.' });
        
        // Atualiza imediatamente a listagem da Home caso o cadastro aconteça por ela
        carregarMedicosNaHome();
        
        linkIrParaLogin.click();
    });

    // Validador de Sessão Ativa ao Carregar a Home do Site
    function verificarSessao() {
        const sessao = JSON.parse(sessionStorage.getItem('sessao_ativa'));
        if(sessao) {
            if(btnEntrarNav) btnEntrarNav.classList.add('hidden');
            if(userBadge) userBadge.classList.remove('hidden');
            if(btnSair) btnSair.classList.remove('hidden');
            if(lblNomeUsuario) lblNomeUsuario.textContent = sessao.nome;

            // Se for paciente, ganha direito a aba de vacinas
            if(sessao.perfil === 'paciente' && linkVacinas) {
                linkVacinas.classList.remove('hidden');
            }
            atualizarNotificacoes(sessao);
        }
    }
    verificarSessao();

    // Ação do Botão Sair da Navbar
    if(btnSair) {
        btnSair.addEventListener('click', () => {
            sessionStorage.removeItem('sessao_ativa');
            window.location.href = 'index.html';
        });
    }

    // SISTEMA DE NOTIFICAÇÕES DINÂMICAS (Controle do Sininho)
    function atualizarNotificacoes(sessao) {
        if(!numNotificacoes) return;
        let todasNotif = JSON.parse(localStorage.getItem('banco_notificacoes')) || [];
        let minhasNotif = todasNotif.filter(n => n.destino_id === sessao.id);

        if(minhasNotif.length > 0) {
            numNotificacoes.textContent = minhasNotif.length;
            numNotificacoes.classList.remove('hidden');
        } else {
            numNotificacoes.classList.add('hidden');
        }
    }

    if(btnNotificacoes) {
        btnNotificacoes.addEventListener('click', () => {
            const sessao = JSON.parse(sessionStorage.getItem('sessao_ativa'));
            if(!sessao) {
                Swal.fire({ text: 'Faça login para checar sua central de notificações.', icon: 'info' });
                return;
            }

            let todasNotif = JSON.parse(localStorage.getItem('banco_notificacoes')) || [];
            let minhasNotif = todasNotif.filter(n => n.destino_id === sessao.id);

            if(minhasNotif.length === 0) {
                Swal.fire({ title: 'Notificações', text: 'Você não possui avisos ou alertas pendentes.', icon: 'info' });
                return;
            }

            let htmlLista = minhasNotif.map(n => `<div style="text-align:left; margin-bottom:12px; padding:12px; background:#F4EEFF; border-radius:12px; border-left:4px solid var(--primary-purple); font-size:0.9rem;">${n.texto}</div>`).join('');
            
            Swal.fire({
                title: 'Suas Notificações',
                html: `<div style="max-height: 300px; overflow-y: auto;">${htmlLista}</div>`,
                confirmButtonText: '<i class="fa-solid fa-eye-slash"></i> Limpar e Marcar como Lidas',
                confirmButtonColor: 'var(--primary-purple)'
            }).then(() => {
                // Remove as notificações visualizadas limpando a lista local
                let restantes = todasNotif.filter(n => n.destino_id !== sessao.id);
                localStorage.setItem('banco_notificacoes', JSON.stringify(restantes));
                atualizarNotificacoes(sessao);
            });
        });
    }

    // CARTEIRA DE VACINAÇÃO DIGITAL INTEGRADA
    if(linkVacinas) {
        linkVacinas.addEventListener('click', (e) => {
            e.preventDefault();
            const sessao = JSON.parse(sessionStorage.getItem('sessao_ativa'));
            let chaveVacina = `vacinas_${sessao.id}`;
            let vacinasSalvas = JSON.parse(localStorage.getItem(chaveVacina)) || { bcg: false, hepB: false, tetra: false };

            Swal.fire({
                title: 'Carteira Digital de Vacinação',
                html: `
                    <div style="text-align: left; font-size: 0.95rem; padding: 5px;">
                        <p style="margin-bottom:15px; color:#7d6b99;">Marque as imunizações já realizadas para a criança:</p>
                        <label style="display:flex; align-items:center; gap:10px; margin: 12px 0; cursor:pointer;"><input type="checkbox" id="v_bcg" ${vacinasSalvas.bcg ? 'checked' : ''} style="transform:scale(1.2);"> <span><strong>BCG</strong> (Dose única contra Tuberculose)</span></label>
                        <label style="display:flex; align-items:center; gap:10px; margin: 12px 0; cursor:pointer;"><input type="checkbox" id="v_hepB" ${vacinasSalvas.hepB ? 'checked' : ''} style="transform:scale(1.2);"> <span><strong>Hepatite B</strong> (Esquema de proteção inicial)</span></label>
                        <label style="display:flex; align-items:center; gap:10px; margin: 12px 0; cursor:pointer;"><input type="checkbox" id="v_tetra" ${vacinasSalvas.tetra ? 'checked' : ''} style="transform:scale(1.2);"> <span><strong>Pentavalente / Tetravalente</strong> (Garante imunidade múltipla)</span></label>
                    </div>
                `,
                showCancelButton: true,
                confirmButtonText: '<i class="fa-solid fa-floppy-disk"></i> Salvar Carteira',
                cancelButtonText: 'Fechar',
                confirmButtonColor: '#107C41'
            }).then((result) => {
                if(result.isConfirmed) {
                    let dadosAtualizados = {
                        bcg: document.getElementById('v_bcg').checked,
                        hepB: document.getElementById('v_hepB').checked,
                        tetra: document.getElementById('v_tetra').checked
                    };
                    localStorage.setItem(chaveVacina, JSON.stringify(dadosAtualizados));
                    Swal.fire({ icon: 'success', title: 'Modificações salvas com sucesso!', text: 'Histórico de vacinas atualizado.' });
                }
            });
        });
    }

    // Interceptador e Protetor de Rotas Privadas (Bloqueia deslogados)
    const interceptarRota = (e, urlAlvo) => {
        e.preventDefault();
        const sessao = JSON.parse(sessionStorage.getItem('sessao_ativa'));
        
        if(sessao) {
            // Se for médico tentando ir pro agendamento.html, bloqueia e manda pro painel dele
            if(sessao.perfil === 'medico' && urlAlvo === 'agendamento.html') {
                window.location.href = 'painel-medico.html';
            } else {
                window.location.href = urlAlvo;
            }
        } else {
            authContainer.classList.remove('hidden');
            Swal.fire({ text: 'Você precisa acessar sua conta para utilizar o portal de agendamentos.', icon: 'warning' });
        }
    };

    // Vínculos nos botões do site para acionar a barreira de login
    if(document.getElementById('linkMeusAgendamentos')) {
        document.getElementById('linkMeusAgendamentos').addEventListener('click', (e) => interceptarRota(e, 'meus-agendamentos.html'));
    }
    if(document.getElementById('heroBtnAgendar')) {
        document.getElementById('heroBtnAgendar').addEventListener('click', (e) => interceptarRota(e, 'agendamento.html'));
    }
    if(document.getElementById('footerBtnAgendar')) {
        document.getElementById('footerBtnAgendar').addEventListener('click', (e) => interceptarRota(e, 'agendamento.html'));
    }

    // ==========================================
    // RENDERIZAÇÃO DINÂMICA DE MÉDICOS NA HOME
    // ==========================================
    function carregarMedicosNaHome() {
        const container = document.getElementById('containerMedicosHome');
        if (!container) return; // Só executa se estiver na index.html

        // Lê a lista de médicos atualizada do LocalStorage
        const medicos = JSON.parse(localStorage.getItem('banco_medicos')) || [];
        container.innerHTML = ''; 

        medicos.forEach(medico => {
            // Gera uma inicial baseada no nome para criar o avatar estilizado automaticamente
            const inicial = medico.nome.replace('Dr(a). ', '').replace('Dr. ', '').replace('Dra. ', '').charAt(0).toUpperCase();
            
            const card = document.createElement('div');
            card.className = 'doctor-card';
            card.style.cssText = 'background: white; border: 1px solid #EFE9F8; border-radius: 20px; padding: 25px; width: 260px; box-shadow: 0 6px 18px rgba(74,48,109,0.02); text-align: center;';

            card.innerHTML = `
                <img src="https://placehold.co/120x120/EFE9F8/6c5a85?text=${inicial}" style="border-radius: 50%; margin-bottom: 15px; width: 120px; height: 120px; object-fit: cover;" alt="${medico.nome}">
                <h3 style="color: var(--dark-purple); font-size: 1.2rem; margin: 0;">${medico.nome}</h3>
                <p style="color: var(--primary-purple); font-size: 0.9rem; font-weight: 500; margin-top: 6px; margin-bottom: 4px;">${medico.especialidade}</p>
                <span style="font-size: 0.75rem; color: #998cb0; display: block;">${medico.crm || 'CRM Cadastrado'}</span>
            `;
            container.appendChild(card);
        });
    }

    // Renderiza a lista na primeira abertura da página
    carregarMedicosNaHome();
});