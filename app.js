const profiles = [];

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
const preregisterModal = q('#preregister-modal');

const backend = {
  endpoint: ''
};

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

function emptyProfiles(message) {
  return `<div class="panel empty-profiles"><span class="category-icon">＋</span><h3>Nenhum perfil publicado ainda</h3><p class="muted">${message}</p><button class="primary" data-open-preregister>Quero participar do início</button></div>`;
}

function renderFeatured() { q('#featured-profiles').innerHTML = emptyProfiles('Os primeiros perfis serão criados a partir de pré-cadastros reais e autorizados.'); }

function renderResults() {
  const term = q('#explore-search').value.toLowerCase().trim();
  const city = q('#city-filter').value;
  const mode = q('#mode-filter').value;
  const filtered = profiles.filter(p => {
    const haystack = [p.name, p.category, p.city, ...p.tags].join(' ').toLowerCase();
    return (!term || haystack.includes(term)) && (!city || p.city === city) && (!mode || p.mode === mode);
  });
  q('#result-count').textContent = 'Nenhum perfil publicado';
  q('#results-grid').innerHTML = filtered.length ? filtered.map(profileCard).join('') : emptyProfiles('A busca será preenchida somente com pessoas e empresas que concluírem o cadastro e autorizarem a publicação.');
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
  const preregister = event.target.closest('[data-open-preregister]');
  if (preregister) preregisterModal.showModal();
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
  event.target.reset();
  showMessage('Formulário em preparação', `Nenhum dado de ${data.get('name')} foi enviado ou armazenado. O envio será ativado junto com o pré-cadastro real.`);
});
q('#verify-my-seal').addEventListener('click', () => showMessage('Selo em desenvolvimento', 'Nenhum selo real foi emitido. A validação só será exibida depois que o cadastro e os critérios estiverem funcionando.'));

q('#preregister-form').addEventListener('submit', async event => {
  event.preventDefault();
  const form = event.currentTarget;
  const submit = q('#preregister-submit');
  const data = new FormData(form);
  if (data.get('website')) return;
  if (!backend.endpoint) {
    showMessage('Ativação em andamento', 'O formulário está pronto, mas a planilha ainda não foi conectada. Nenhum dado foi enviado.');
    return;
  }

  const contactType = String(data.get('contact_type'));
  let contactValue = String(data.get('contact_value')).trim();
  if (contactType === 'whatsapp') contactValue = contactValue.replace(/\D/g, '');
  else contactValue = contactValue.toLowerCase();

  const payload = {
    submission_id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    full_name: String(data.get('full_name')).trim(),
    city: String(data.get('city')).trim(),
    state: String(data.get('state')),
    contact_type: contactType,
    contact_value: contactValue,
    participation_type: String(data.get('participation_type')),
    category: String(data.get('category')).trim() || null,
    support_interest: data.get('support_interest') === 'on',
    contact_consent: data.get('contact_consent') === 'on',
    privacy_consent: data.get('privacy_consent') === 'on',
    source: 'github_pages'
  };

  submit.disabled = true;
  submit.textContent = 'Enviando...';
  try {
    await fetch(backend.endpoint, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload)
    });
    const result = await waitForSubmission(payload.submission_id);
    if (result.code === 'duplicate') throw new Error('duplicate');
    if (!result.ok) throw new Error('submit');
    form.reset();
    preregisterModal.close();
    showMessage('Pré-cadastro recebido!', 'Seus dados foram registrados de forma privada. Nenhum perfil foi publicado. Entraremos em contato quando a próxima etapa estiver disponível.');
    await updateRegistrationCount();
  } catch (error) {
    const copy = error.message === 'duplicate' ? 'Este contato já possui um pré-cadastro.' : 'Não foi possível enviar agora. Tente novamente em alguns instantes.';
    showMessage('Não foi possível concluir', copy);
  } finally {
    submit.disabled = false;
    submit.innerHTML = 'Concluir pré-cadastro <span>→</span>';
  }
});

async function updateRegistrationCount() {
  if (!backend.endpoint) return;
  try {
    const result = await jsonp({ action: 'count' });
    const count = Number(result.count);
    const target = count < 1000 ? 1000 : 2 ** Math.ceil(Math.log2(count / 1000)) * 1000;
    q('#member-count').textContent = count.toLocaleString('pt-BR');
    q('#members-left').textContent = Math.max(target - count, 0).toLocaleString('pt-BR');
    q('#member-progress').style.width = `${Math.min((count / target) * 100, 100)}%`;
  } catch (_) {}
}

async function waitForSubmission(submissionId) {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    await new Promise(resolve => setTimeout(resolve, 700 + attempt * 350));
    try {
      const result = await jsonp({ action: 'status', id: submissionId });
      if (result.found) return result;
    } catch (_) {}
  }
  return { ok: false };
}

function jsonp(params) {
  return new Promise((resolve, reject) => {
    const callback = `__beerre_${Date.now()}_${Math.random().toString(16).slice(2)}`;
    const script = document.createElement('script');
    const timeout = setTimeout(() => finish(new Error('timeout')), 8000);
    const finish = (error, value) => {
      clearTimeout(timeout);
      script.remove();
      delete window[callback];
      error ? reject(error) : resolve(value);
    };
    window[callback] = value => finish(null, value);
    const query = new URLSearchParams({ ...params, callback });
    script.src = `${backend.endpoint}?${query}`;
    script.onerror = () => finish(new Error('network'));
    document.head.appendChild(script);
  });
}

renderFeatured();
renderResults();
renderRoadmap();
updateRegistrationCount();
