'use strict';

const esc = (s) =>
  String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));

const kfmt = (n) => {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
};

const daysAgo = (iso) => {
  if (!iso) return 'never';
  const d = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
  if (d <= 0) return 'today';
  if (d === 1) return 'yesterday';
  if (d < 30) return `${d}d ago`;
  if (d < 365) return `${Math.floor(d / 30)}mo ago`;
  return `${Math.floor(d / 365)}y ago`;
};

const sizeLabel = (kb) => (kb >= 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${kb} KB`);

/** The org profile repo is the page itself - it is never listed as a project. */
const isProfileRepo = (r) => r.name === '.github';
const projectRepos = (repos) => repos.filter((r) => !isProfileRepo(r));

/* ---------------------------------------------------------------- meta ---- */

function renderMeta(data) {
  const { org, repos, contributors } = data;
  const projects = projectRepos(repos);
  const priv = projects.filter((r) => r.private).length;
  const since = new Date(org.createdAt).getFullYear();

  const badges = [
    `👥 ${org.followers} Followers`,
    `📦 ${projects.length} Repos`,
    `🔒 ${priv} Private`,
    `⚡ ${contributors.length} Members`,
    `📅 Since ${since}`,
  ];
  return badges.map((b) => `<span class="xl-badge">${esc(b)}</span>`).join('\n');
}

/* ----------------------------------------------------------- repo cards ---- */

function renderRepos(data) {
  const repos = projectRepos(data.repos);
  if (!repos.length) return '<p class="xl-empty">no repositories yet</p>';

  const maxCommits = Math.max(1, ...repos.map((r) => r.commits || 0));

  return repos
    .map((r) => {
      const pct = Math.max(3, Math.round(((r.commits || 0) / maxCommits) * 100));
      const vis = r.private ? '🔒' : '🌐';
      const lang = r.language ? `<span class="xl-repo-langname">${esc(r.language)}</span>` : '';
      const topics = r.topics.slice(0, 3).map((t) => `<span class="xl-chip">${esc(t)}</span>`).join('');
      return `
  <div class="xl-repo">
    <div class="xl-repo-top">
      <span class="xl-repo-vis" title="${r.private ? 'private' : 'public'}">${vis}</span>
      <span class="xl-repo-name" title="${esc(r.fullName)}">${esc(r.name)}</span>
    </div>
    <p class="xl-repo-desc">${esc(r.description) || '&nbsp;'}</p>
    <div class="xl-repo-stats">
      <span class="xl-metric"><b>${kfmt(r.commits || 0)}</b> commits</span>
      <span class="xl-metric"><b>${kfmt(r.stars)}</b> ★</span>
      <span class="xl-metric"><b>${kfmt(r.forks)}</b> ⑂</span>
      <span class="xl-metric"><b>${esc(sizeLabel(r.sizeKb))}</b> size</span>
    </div>
    <div class="xl-repo-bar"><i style="--w:${pct}%"></i></div>
    <div class="xl-repo-foot">${lang}<span class="xl-dotsep">·</span>${esc(daysAgo(r.pushedAt))}${topics ? `<span class="xl-dotsep">·</span>${topics}` : ''}</div>
  </div>`;
    })
    .join('\n');
}

/* ------------------------------------------------------------ languages ---- */

function renderLanguages(data) {
  const entries = Object.entries(data.languages).sort((a, b) => b[1] - a[1]);
  if (!entries.length) return '<p class="xl-empty">no language data</p>';

  const total = entries.reduce((s, [, v]) => s + v, 0);
  return entries
    .slice(0, 8)
    .map(([lang, bytes]) => {
      const share = (bytes / total) * 100;
      return `
  <div class="xl-langrow">
    <span class="xl-langname">${esc(lang)}</span>
    <div class="xl-langtrack"><i style="--w:${share.toFixed(1)}%"></i></div>
    <span class="xl-langpct">${share.toFixed(1)}%</span>
  </div>`;
    })
    .join('\n');
}

/* -------------------------------------------------------- contributors ---- */

/**
 * Vertical 3D bar chart: one bar per organisation member, height = commits.
 * Purely a read-out - no links, no click targets.
 */
function renderContributors(data) {
  const rows = data.contributors;
  if (!rows.length) return '<p class="xl-empty">no members found</p>';

  const max = Math.max(1, ...rows.map((r) => r.commits));
  const totalCommits = rows.reduce((s, r) => s + r.commits, 0);
  const totalRepos = new Set(rows.flatMap((r) => r.repos || [])).size;

  const bars = rows
    .map((r) => {
      const h = r.commits > 0 ? Math.max(7, Math.round((r.commits / max) * 100)) : 3;
      const dim = r.commits > 0 ? '' : ' xl-bar-zero';
      return `
    <div class="xl-bar${dim}" style="--h:${h}%">
      <span class="xl-bar-value">${kfmt(r.commits)}</span>
      <div class="xl-bar-front"></div>
      <div class="xl-bar-cap"></div>
      <div class="xl-bar-side"></div>
    </div>`;
    })
    .join('');

  const labels = rows
    .map((r) => `
    <div class="xl-label" title="${esc(r.login)} · ${r.commits} commits · ${r.repos.length} repo(s)">
      <img class="xl-label-ava" src="${esc(r.avatar)}" alt="" loading="lazy" />
      <span class="xl-label-name">${esc(r.login)}</span>
      <b class="xl-label-num">${kfmt(r.commits)}</b>
    </div>`)
    .join('');

  return `
<div class="xl-chart-head">
  <span class="xl-chart-title">COMMITS BY MEMBER</span>
  <span class="xl-chart-sub">${rows.length} member(s) · ${kfmt(totalCommits)} commit(s) · ${totalRepos} repo(s)</span>
</div>
<div class="xl-chart">
  <div class="xl-chart-scene">
    <div class="xl-chart-floor"></div>${bars}
  </div>
  <div class="xl-chart-labels">${labels}
  </div>
</div>`;
}

module.exports = { renderMeta, renderRepos, renderLanguages, renderContributors, esc };
