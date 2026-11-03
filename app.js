const profiles = [
  { id: 1, initials: 'EC', name: 'Empresa Contábil', category: 'Contabilidade', city: 'Cidade exemplo', state: 'BR', mode: 'Online', tags: ['Perfil de exemplo', 'Atendimento nacional'], cover: '', description: 'Exemplo visual de como uma empresa poderá apresentar seus serviços. Nenhum vínculo, recomendação ou validação real está sendo informado.', hours: 'Informado pelo cadastrado' },
  { id: 2, initials: 'EP', name: 'Escritório Profissional', category: 'Advocacia', city: 'Cidade exemplo', state: 'BR', mode: 'Presencial', tags: ['Perfil de exemplo', 'Atendimento local'], cover: 'blue-cover', description: 'Exemplo visual de perfil profissional. Os perfis públicos reais dependerão de cadastro e autorização.', hours: 'Informado pelo cadastrado' },
  { id: 3, initials: 'CE', name: 'Comércio Exemplo', category: 'Restaurantes', city: 'Cidade exemplo', state: 'BR', mode: 'Entrega', tags: ['Perfil de exemplo', 'Estabelecimento'], cover: 'gold-cover', description: 'Exemplo visual de estabelecimento. Avaliações e recomendações só aparecerão quando forem reais.', hours: 'Informado pelo cadastrado' }
];

const roadmap = [
  { icon: '▣', title: 'Vagas e talentos', state: 'PLANEJADO', text: 'Empresas publicam oportunidades e encontram profissionais da comunidade.' },
  { icon: '▦', title: 'Catálogo de produtos', state: 'PLANEJADO', text: 'Empresas apresentam seus principais produtos, serviços e condições.' },
  { icon: '⌁', title: 'Serviços rápidos', state: 'EM ESTUDO', text: 'Motoristas, motoboys, diaristas e profissionais disponíveis por região.' },
  { icon: '◇', title: 'Franquias e negócios', state: 'EM ESTUDO', text: 'Oportunidades nacionais para franquias, sócios e representantes.' },
  { icon: '◎', title: 'Eventos e mentorias', state: 'PLANEJADO', text: 'Encontros locais, palestras e troca de experiência entre membros.' },
  { icon: '%', title: 'Clube de benefícios', state: 'EM ESTUDO', text: 'Condições especiais oferecidas por membros para a própria comunidade.' }
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
      <div class="profile-meta"><span>Exemplo visual</span><span class="recommendations">Sem dados simulados</span></div>
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
  q('#result-count').textContent = 'Perfis demonstrativos';
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
    <div class="verified-line"><span>Exemplo visual</span><span>Sem validação real</span></div>
    <p class="modal-description">${p.description}</p>
    <div class="modal-info"><div><strong>ATENDIMENTO</strong><span>${p.mode}</span></div><div><strong>HORÁRIO</strong><span>${p.hours}</span></div><div><strong>RECOMENDAÇÕES</strong><span>Aguardando dados reais</span></div><div><strong>ABRANGÊNCIA</strong><span>${p.tags[1] || p.city}</span></div></div>
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
  q('#roadmap-grid').innerHTML = roadmap.map((item, index) => `<article class="roadmap-card"><span class="roadmap-icon">${item.icon}</span><span class="state">${item.state}</span><h3>${item.title}</h3><p>${item.text}</p><button class="vote-button" data-vote="${index}">Tenho interesse</button></article>`).join('');
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
  if (vote && !vote.classList.contains('voted')) { vote.classList.add('voted'); vote.textContent = 'Interesse registrado neste dispositivo'; }
});

q('#home-search-button').addEventListener('click', () => navigate('explorar', q('#home-search').value));
q('#home-search').addEventListener('keydown', event => { if (event.key === 'Enter') navigate('explorar', event.target.value); });
['#explore-search', '#city-filter', '#mode-filter'].forEach(selector => q(selector).addEventListener('input', renderResults));
q('#referral-form').addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(event.target);
  q('#referral-count').textContent = '1';
  q('#referral-progress').style.width = '33%';
  event.target.reset();
  showMessage('Indicação enviada!', `${data.get('name')} foi adicionado à sua lista de indicações. A publicação dependerá da aceitação do convidado.`);
});
q('#founder-button').addEventListener('click', () => showMessage('Pré-cadastro demonstrativo', 'Na versão pública, este botão abrirá o pré-cadastro gratuito de 30 dias. Cadastros válidos alimentarão a meta comunitária de 1.000, 2.000, 4.000 e assim por diante.'));
q('#verify-my-seal').addEventListener('click', () => showMessage('Selo em desenvolvimento', 'Nenhum selo real foi emitido. A validação só será exibida depois que o cadastro e os critérios estiverem funcionando.'));

renderFeatured();
renderResults();
renderRoadmap();
