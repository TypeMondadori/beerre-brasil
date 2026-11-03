const profiles = [
  { id: 1, initials: 'CH', name: 'Chies Contabilidade', category: 'Contabilidade', city: 'Londrina', state: 'PR', mode: 'Online', tags: ['Empresas', 'Atendimento nacional'], recommendations: 38, cover: '', description: 'Contabilidade consultiva para empresas, profissionais e empreendedores. Atendimento presencial em Londrina e remoto para todo o Brasil.', hours: 'Seg–Sex, 8h às 18h' },
  { id: 2, initials: 'RB', name: 'Ramos & Braga', category: 'Advocacia', city: 'Londrina', state: 'PR', mode: 'Presencial', tags: ['Empresarial', 'Contratos'], recommendations: 26, cover: 'blue-cover', description: 'Assessoria jurídica empresarial com atendimento próximo, objetivo e responsável.', hours: 'Seg–Sex, 9h às 17h' },
  { id: 3, initials: 'CF', name: 'Casa do Fogo', category: 'Restaurantes', city: 'Londrina', state: 'PR', mode: 'Entrega', tags: ['Restaurante', 'Entrega'], recommendations: 51, cover: 'gold-cover', description: 'Cozinha brasileira, carnes na brasa e atendimento para famílias e eventos.', hours: 'Ter–Dom, 11h às 23h' },
  { id: 4, initials: 'EM', name: 'Edu Martins', category: 'Mentoria', city: 'Nacional', state: 'BR', mode: 'Online', tags: ['Mentor', 'Palestrante'], recommendations: 19, cover: '', description: 'Mentoria prática em vendas, liderança e estruturação comercial para pequenos negócios.', hours: 'Com agendamento' },
  { id: 5, initials: 'SV', name: 'Sulvale Distribuidora', category: 'Fornecedores', city: 'Maringá', state: 'PR', mode: 'Entrega', tags: ['Atacado', 'Alimentos'], recommendations: 33, cover: 'gold-cover', description: 'Distribuição regional de alimentos e produtos para restaurantes e mercados.', hours: 'Seg–Sáb, 7h às 18h' },
  { id: 6, initials: 'AS', name: 'André Soluções', category: 'Serviços', city: 'Curitiba', state: 'PR', mode: 'Domiciliar', tags: ['Elétrica', 'Manutenção'], recommendations: 42, cover: 'blue-cover', description: 'Serviços elétricos, manutenção e pequenos reparos com atendimento domiciliar.', hours: 'Seg–Sáb, 8h às 19h' }
];

const roadmap = [
  { icon: '▣', title: 'Vagas e talentos', state: 'PLANEJADO', text: 'Empresas publicam oportunidades e encontram profissionais da comunidade.', votes: 184 },
  { icon: '▦', title: 'Catálogo de produtos', state: 'PLANEJADO', text: 'Empresas apresentam seus principais produtos, serviços e condições.', votes: 156 },
  { icon: '⌁', title: 'Serviços rápidos', state: 'EM ESTUDO', text: 'Motoristas, motoboys, diaristas e profissionais disponíveis por região.', votes: 137 },
  { icon: '◇', title: 'Franquias e negócios', state: 'EM ESTUDO', text: 'Oportunidades nacionais para franquias, sócios e representantes.', votes: 91 },
  { icon: '◎', title: 'Eventos e mentorias', state: 'PLANEJADO', text: 'Encontros locais, palestras e troca de experiência entre membros.', votes: 73 },
  { icon: '%', title: 'Clube de benefícios', state: 'EM ESTUDO', text: 'Condições especiais oferecidas por membros para a própria comunidade.', votes: 119 }
];

const q = (selector, root = document) => root.querySelector(selector);
const qa = (selector, root = document) => [...root.querySelectorAll(selector)];
const profileModal = q('#profile-modal');
const messageModal = q('#message-modal');

function profileCard(profile) {
  return `<article class="profile-card">
    <div class="profile-cover ${profile.cover}"><span class="avatar">${profile.initials}</span></div>
    <div class="profile-card-body">
      <h3>${profile.name}</h3><p>${profile.category} · ${profile.city}, ${profile.state}</p>
      <div class="profile-tags">${profile.tags.map(tag => `<span>${tag}</span>`).join('')}</div>
      <div class="profile-meta"><span>✓ Membro ativo</span><span class="recommendations">♥ ${profile.recommendations} recomendam</span></div>
    </div>
    <button class="open-profile" data-profile="${profile.id}">Ver perfil completo →</button>
  </article>`;
}

function renderFeatured() { q('#featured-profiles').innerHTML = profiles.slice(0, 3).map(profileCard).join(''); }

function renderResults() {
  const term = q('#explore-search').value.toLowerCase().trim();
  const city = q('#city-filter').value;
  const mode = q('#mode-filter').value;
  const filtered = profiles.filter(p => {
    const haystack = [p.name, p.category, p.city, ...p.tags].join(' ').toLowerCase();
    return (!term || haystack.includes(term)) && (!city || p.city === city) && (!mode || p.mode === mode);
  });
  q('#result-count').textContent = `${filtered.length} ${filtered.length === 1 ? 'resultado' : 'resultados'}`;
  q('#results-grid').innerHTML = filtered.length ? filtered.map(profileCard).join('') : `<div class="panel"><h3>Nenhum perfil encontrado</h3><p class="muted">Tente outra categoria ou indique um profissional para a Bê Erre.</p><button class="primary" data-nav="indicar">Fazer uma indicação</button></div>`;
}

function navigate(view, query = '') {
  qa('.view').forEach(el => el.classList.toggle('active', el.id === `view-${view}`));
  qa('[data-nav]').forEach(el => el.classList.toggle('active', el.dataset.nav === view));
  if (view === 'explorar') {
    if (query) q('#explore-search').value = query;
    renderResults();
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function openProfile(id) {
  const p = profiles.find(item => item.id === Number(id));
  if (!p) return;
  q('#modal-content').innerHTML = `<div class="modal-profile-cover"></div><div class="modal-profile-main">
    <span class="avatar">${p.initials}</span><h2>${p.name}</h2><div class="subtitle">${p.category} · ${p.city}, ${p.state}</div>
    <div class="verified-line"><span>✓ Membro ativo</span><span>✓ Identidade verificada</span><span>V Fundador 2026</span></div>
    <p class="modal-description">${p.description}</p>
    <div class="modal-info"><div><strong>ATENDIMENTO</strong><span>${p.mode}</span></div><div><strong>HORÁRIO</strong><span>${p.hours}</span></div><div><strong>RECOMENDAÇÕES</strong><span>${p.recommendations} membros</span></div><div><strong>ABRANGÊNCIA</strong><span>${p.tags[1] || p.city}</span></div></div>
    <div class="modal-actions"><button class="primary" data-contact="${p.name}">Conversar pelo WhatsApp</button><button class="secondary" data-recommend="${p.name}">Eu recomendo</button></div>
  </div>`;
  profileModal.showModal();
}

function showMessage(title, copy) {
  q('#message-title').textContent = title;
  q('#message-copy').textContent = copy;
  messageModal.showModal();
}

function renderRoadmap() {
  q('#roadmap-grid').innerHTML = roadmap.map((item, index) => `<article class="roadmap-card"><span class="roadmap-icon">${item.icon}</span><span class="state">${item.state}</span><h3>${item.title}</h3><p>${item.text}</p><button class="vote-button" data-vote="${index}">Tenho interesse · <span>${item.votes}</span></button></article>`).join('');
}

document.addEventListener('click', event => {
  const nav = event.target.closest('[data-nav]');
  if (nav) { event.preventDefault(); navigate(nav.dataset.nav, nav.dataset.query || ''); }
  const queryButton = event.target.closest('[data-query]');
  if (queryButton) navigate('explorar', queryButton.dataset.query);
  const profileButton = event.target.closest('[data-profile]');
  if (profileButton) openProfile(profileButton.dataset.profile);
  const close = event.target.closest('[data-close]');
  if (close) close.closest('dialog').close();
  const contact = event.target.closest('[data-contact]');
  if (contact) { profileModal.close(); showMessage('Contato demonstrativo', `Na versão publicada, este botão abrirá o WhatsApp de ${contact.dataset.contact} e registrará a origem do contato.`); }
  const recommend = event.target.closest('[data-recommend]');
  if (recommend) { profileModal.close(); showMessage('Recomendação registrada', `Você recomendou ${recommend.dataset.recommend} neste protótipo.`); }
  const vote = event.target.closest('[data-vote]');
  if (vote && !vote.classList.contains('voted')) { const i = Number(vote.dataset.vote); roadmap[i].votes++; vote.classList.add('voted'); vote.innerHTML = `Interesse registrado · <span>${roadmap[i].votes}</span>`; }
});

q('#home-search-button').addEventListener('click', () => navigate('explorar', q('#home-search').value));
q('#home-search').addEventListener('keydown', event => { if (event.key === 'Enter') navigate('explorar', event.target.value); });
['#explore-search', '#city-filter', '#mode-filter'].forEach(selector => q(selector).addEventListener('input', renderResults));
q('#referral-form').addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(event.target);
  q('#referral-count').textContent = '2';
  q('#referral-progress').style.width = '66%';
  event.target.reset();
  showMessage('Indicação enviada!', `${data.get('name')} foi adicionado à sua lista de indicações. A publicação dependerá da aceitação do convidado.`);
});
q('#founder-button').addEventListener('click', () => showMessage('Pré-cadastro demonstrativo', 'Na versão pública, este botão abrirá o pré-cadastro gratuito de 30 dias. Cadastros válidos alimentarão a meta comunitária de 1.000, 2.000, 4.000 e assim por diante.'));
q('#verify-my-seal').addEventListener('click', () => showMessage('Selo Bê Erre ativo', 'BERRE-2026-0001 · Membro Fundador · Cadastro demonstrativo válido neste protótipo.'));

renderFeatured();
renderResults();
renderRoadmap();
