import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import mermaid from 'astro-mermaid';
import rehypeSectionNumber from './src/plugins/rehype-section-number.mjs';

export default defineConfig({
	site: 'https://yusufarbc.github.io',
	base: '/ag-yonetimi-ve-guvenligi',
	markdown: {
		rehypePlugins: [rehypeSectionNumber],
	},
	integrations: [
		mermaid({
			theme: 'neutral',
			autoTheme: true,
		}),
		starlight({
			title: 'Ağ Yönetimi ve Güvenliği',
			defaultLocale: 'root',
			locales: {
				root: {
					label: 'Türkçe',
					lang: 'tr',
				},
			},
			social: [
				{
					icon: 'github',
					label: 'GitHub',
					href: 'https://github.com/yusufarbc/ag-yonetimi-ve-guvenligi',
				},
			],
			editLink: {
				baseUrl: 'https://github.com/yusufarbc/ag-yonetimi-ve-guvenligi/edit/main/',
			},
			customCss: [
				'./src/styles/tokens.css',
				'./src/styles/typography.css',
				'./src/styles/layout.css',
				'./src/styles/responsive.css',
			],
			head: [
				{
					tag: 'script',
					content: `
						(function () {
							function splitSidebarLabels() {
								var labels = document.querySelectorAll('.sidebar-content a > span:first-child');
								for (var i = 0; i < labels.length; i++) {
									var span = labels[i];
									var match = /^(\\d+\\.\\d+)\\s+(.+)$/.exec(span.textContent);
									if (!match) continue;
									span.textContent = '';
									var numEl = document.createElement('span');
									numEl.className = 'chapter-num';
									numEl.textContent = match[1];
									span.appendChild(numEl);
									span.appendChild(document.createTextNode(match[2]));
								}
							}
							function revealActiveSidebarLink() {
								var active = document.querySelector('.sidebar-content [aria-current="page"]');
								if (active) active.scrollIntoView({ block: 'center' });
							}
							function init() {
								splitSidebarLabels();
								revealActiveSidebarLink();
							}
							if (document.readyState === 'loading') {
								document.addEventListener('DOMContentLoaded', init);
							} else {
								init();
							}
						})();
					`,
				},
			],
			sidebar: [
				{
					label: '01. Ağ Mimarileri ve Trafik Akışı',
					collapsed: true,
					items: [{ autogenerate: { directory: '01-ag-mimarileri-ve-trafik-akisi' } }],
				},
				{
					label: '02. Bağlantı ve Ağ Katmanı Protokolleri',
					collapsed: true,
					items: [{ autogenerate: { directory: '02-baglanti-ve-ag-katmani-protokolleri' } }],
				},
				{
					label: '03. Taşıma Katmanı (TCP/UDP) Analizi',
					collapsed: true,
					items: [{ autogenerate: { directory: '03-tasima-katmani-tcp-ve-udp-analizi' } }],
				},
				{
					label: '04. Uygulama Katmanı Protokolleri',
					collapsed: true,
					items: [{ autogenerate: { directory: '04-uygulama-katmani-protokolleri' } }],
				},
				{
					label: '05. Ağ Savunma Teknolojileri ve Mimarisi',
					collapsed: true,
					items: [{ autogenerate: { directory: '05-ag-savunma-teknolojileri-ve-mimarisi' } }],
				},
				{
					label: '06. Ağ Saldırıları, DoS/DDoS ve Paket Tespiti',
					collapsed: true,
					items: [{ autogenerate: { directory: '06-ag-saldirilari-dos-ddos-ve-paket-tespiti' } }],
				},
				{
					label: '07. Gizli Kanallar (C2) ve Tehdit Avcılığı',
					collapsed: true,
					items: [{ autogenerate: { directory: '07-gizli-kanallar-c2-ve-tehdit-avciligi' } }],
				},
				{
					label: '08. Kimlik ve Active Directory Güvenliği',
					collapsed: true,
					items: [{ autogenerate: { directory: '08-kimlik-ve-active-directory-guvenligi' } }],
				},
				{
					label: '09. Ağ Yönetimi, İzleme ve Telemetri',
					collapsed: true,
					items: [{ autogenerate: { directory: '09-ag-yonetimi-izleme-ve-telemetri' } }],
				},
				{
					label: '10. Ağ Otomasyonu ve NetDevOps',
					collapsed: true,
					items: [{ autogenerate: { directory: '10-ag-otomasyonu-ve-netdevops' } }],
				},
				{
					label: '11. Bulut Ağları ve Hibrit Altyapı Güvenliği',
					collapsed: true,
					items: [{ autogenerate: { directory: '11-bulut-aglari-ve-hibrit-altyapi-guvenligi' } }],
				},
				{
					label: '12. SOC/NOC Operasyonları ve Ağ Adli Bilişimi',
					collapsed: true,
					items: [{ autogenerate: { directory: '12-soc-noc-ve-ag-adli-bilisimi' } }],
				},
			],
		}),
	],
});
